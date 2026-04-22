-- ============================================================
-- 003_rls.sql — Row Level Security policies and views
-- ============================================================

-- ============================================================
-- Helper: is_admin()
-- Returns true when the calling JWT belongs to a user whose role
-- is 'admin'.  Used in RLS policies without repeatedly joining.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
          AND role = 'admin'
    );
$$;

-- ============================================================
-- TABLE: public.users
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read user profiles
CREATE POLICY "users_select_public"
    ON public.users
    FOR SELECT
    USING (true);

-- A user can update only their own profile row
CREATE POLICY "users_update_own"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role bypasses all RLS (Supabase default for service_role key)
-- No explicit policy needed; service_role is excluded from RLS checks.

-- ============================================================
-- TABLE: public.submissions
-- ============================================================
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own submissions
CREATE POLICY "submissions_select_own"
    ON public.submissions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can read all submissions
CREATE POLICY "submissions_select_admin"
    ON public.submissions
    FOR SELECT
    USING (public.is_admin());

-- Users can insert their own submissions
CREATE POLICY "submissions_insert_own"
    ON public.submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can update any submission (scoring, status changes)
CREATE POLICY "submissions_update_admin"
    ON public.submissions
    FOR UPDATE
    USING (public.is_admin());

-- Service role handles all writes (award_submission_points, etc.)
-- Covered by service_role RLS bypass.

-- ============================================================
-- TABLE: public.point_events
-- ============================================================
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own point events
CREATE POLICY "point_events_select_own"
    ON public.point_events
    FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can read all point events
CREATE POLICY "point_events_select_admin"
    ON public.point_events
    FOR SELECT
    USING (public.is_admin());

-- No UPDATE or DELETE policies → immutable ledger for regular users.
-- Service role can still write (inserts happen via credit_points function
-- which runs with SECURITY DEFINER).

-- ============================================================
-- TABLE: public.point_transfers
-- ============================================================
ALTER TABLE public.point_transfers ENABLE ROW LEVEL SECURITY;

-- Either participant (sender or receiver) can read the transfer
CREATE POLICY "point_transfers_select_participants"
    ON public.point_transfers
    FOR SELECT
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Admins can read all transfers
CREATE POLICY "point_transfers_select_admin"
    ON public.point_transfers
    FOR SELECT
    USING (public.is_admin());

-- Inserts are handled by service role (no user-facing insert policy).

-- ============================================================
-- TABLE: public.external_datasets
-- ============================================================
ALTER TABLE public.external_datasets ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required)
CREATE POLICY "external_datasets_select_public"
    ON public.external_datasets
    FOR SELECT
    USING (true);

-- Write access handled by service role only.

-- ============================================================
-- VIEW: public.public_leaderboard
-- Top users by points — publicly readable.
-- ============================================================
CREATE OR REPLACE VIEW public.public_leaderboard
WITH (security_invoker = false)
AS
SELECT
    u.id,
    u.username,
    u.avatar_url,
    u.country,
    u.points,
    u.tier,
    RANK() OVER (ORDER BY u.points DESC) AS rank
FROM public.users u
ORDER BY u.points DESC;

-- Grant public (anon + authenticated) SELECT on the leaderboard view
GRANT SELECT ON public.public_leaderboard TO anon, authenticated;
