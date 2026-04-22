-- ============================================================
-- 002_functions.sql — PL/pgSQL functions and triggers
-- ============================================================

-- ------------------------------------------------------------
-- FUNCTION: handle_new_user
-- Triggered on auth.users INSERT → creates a matching public.users row.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_code int;
BEGIN
    -- Generate a unique 8-digit verification code (10000000–99999999)
    LOOP
        v_code := floor(random() * 90000000 + 10000000)::int;
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE verification_code = v_code);
    END LOOP;

    INSERT INTO public.users (id, email, username, avatar_url, verification_code, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        -- derive a username from the email local part (before @)
        split_part(NEW.email, '@', 1),
        NEW.raw_user_meta_data->>'avatar_url',
        v_code,
        now()
    )
    ON CONFLICT (id) DO NOTHING;   -- idempotent; avoid duplicate on retry
    RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- FUNCTION: calculate_tier
-- Returns the tier name for a given point total.
-- Thresholds:
--   scout          <    500
--   explorer       500  – 1 999
--   correspondent  2 000 – 9 999
--   field_agent    10 000 – 49 999
--   world_scanner  50 000+
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_tier(p_points int)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN CASE
        WHEN p_points >= 50000 THEN 'world_scanner'
        WHEN p_points >= 10000 THEN 'field_agent'
        WHEN p_points >=  2000 THEN 'correspondent'
        WHEN p_points >=   500 THEN 'explorer'
        ELSE                        'scout'
    END;
END;
$$;

-- ------------------------------------------------------------
-- FUNCTION: calculate_submission_points
-- Derives the point award from a submission's attributes.
--
-- Formula:
--   base            = quality_score * 2            (max 200)
--   device bonus    = +50 (iphone/gopro/insta360)
--                     +20 (android)
--                       0 (other / null)
--   location bonus  = +25 if location_country is set
--   scene bonus     = +25 if category is set
--   total           = base + bonuses
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_submission_points(
    p_quality_score  int,
    p_device_type    text,
    p_location_country text,
    p_category       text
)
RETURNS int
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_base      int;
    v_device    int;
    v_location  int;
    v_scene     int;
BEGIN
    -- Base: quality score × 2
    v_base := COALESCE(p_quality_score, 0) * 2;

    -- Device bonus
    v_device := CASE
        WHEN p_device_type IN ('iphone', 'gopro', 'insta360') THEN 50
        WHEN p_device_type = 'android'                         THEN 20
        ELSE 0
    END;

    -- Location bonus
    v_location := CASE WHEN p_location_country IS NOT NULL AND p_location_country <> '' THEN 25 ELSE 0 END;

    -- Scene / category bonus
    v_scene := CASE WHEN p_category IS NOT NULL AND p_category <> '' THEN 25 ELSE 0 END;

    RETURN v_base + v_device + v_location + v_scene;
END;
$$;

-- ------------------------------------------------------------
-- FUNCTION: credit_points
-- Inserts a point_event, updates users.points, recalculates tier.
--
-- Parameters:
--   p_user_id  — target user
--   p_amount   — points to add (positive) or subtract (negative)
--   p_reason   — short text label (e.g. 'submission_accepted')
--   p_metadata — optional JSONB context (e.g. submission_id)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.credit_points(
    p_user_id  uuid,
    p_amount   int,
    p_reason   text,
    p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_points int;
BEGIN
    -- Append to immutable ledger
    INSERT INTO public.point_events (user_id, amount, reason, metadata)
    VALUES (p_user_id, p_amount, p_reason, p_metadata);

    -- Update running total and recalculate tier atomically
    UPDATE public.users
    SET
        points = GREATEST(0, points + p_amount),   -- floor at 0
        tier   = public.calculate_tier(GREATEST(0, points + p_amount))
    WHERE id = p_user_id
    RETURNING points INTO v_new_points;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'credit_points: user % not found', p_user_id;
    END IF;
END;
$$;

-- ------------------------------------------------------------
-- FUNCTION: award_submission_points
-- Called by the admin scoring endpoint (or a scheduled job) after
-- the 24h delay.  Computes points, credits the user, and stamps
-- the submission with points_awarded and points_awarded_at.
--
-- Parameters:
--   p_submission_id — UUID of the accepted submission
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.award_submission_points(p_submission_id uuid)
RETURNS int    -- returns the points awarded
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sub      public.submissions%ROWTYPE;
    v_points   int;
BEGIN
    -- Lock the row to prevent double-award
    SELECT * INTO v_sub
    FROM public.submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'award_submission_points: submission % not found', p_submission_id;
    END IF;

    IF v_sub.status <> 'accepted' THEN
        RAISE EXCEPTION 'award_submission_points: submission % is not accepted (status=%)', p_submission_id, v_sub.status;
    END IF;

    IF v_sub.points_awarded IS NOT NULL THEN
        RAISE EXCEPTION 'award_submission_points: submission % has already been awarded % points', p_submission_id, v_sub.points_awarded;
    END IF;

    -- Calculate points
    v_points := public.calculate_submission_points(
        v_sub.quality_score,
        v_sub.device_type,
        v_sub.location_country,
        v_sub.category
    );

    -- Credit user
    PERFORM public.credit_points(
        v_sub.user_id,
        v_points,
        'submission_accepted',
        jsonb_build_object('submission_id', p_submission_id)
    );

    -- Stamp the submission
    UPDATE public.submissions
    SET
        points_awarded    = v_points,
        points_awarded_at = now()
    WHERE id = p_submission_id;

    RETURN v_points;
END;
$$;
