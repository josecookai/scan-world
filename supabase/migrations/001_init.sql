-- ============================================================
-- 001_init.sql — Initial schema for Scan the World
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- TABLE: public.users
-- Extends Supabase auth.users; populated via trigger on insert.
-- ------------------------------------------------------------
CREATE TABLE public.users (
    id             uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email          text        NOT NULL UNIQUE,
    username       text        UNIQUE,
    avatar_url     text,
    bio            text,
    country        text,
    points         int         NOT NULL DEFAULT 0,
    tier           text        NOT NULL DEFAULT 'scout',
    role           text        NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
    created_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'Application-level user profiles that extend auth.users.';
COMMENT ON COLUMN public.users.tier IS 'Derived from points: scout | explorer | correspondent | field_agent | world_scanner';
COMMENT ON COLUMN public.users.role IS 'Application role: user or admin';

-- ------------------------------------------------------------
-- TABLE: public.submissions
-- User-submitted video URLs awaiting or already reviewed.
-- ------------------------------------------------------------
CREATE TABLE public.submissions (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Video metadata
    platform            text        NOT NULL CHECK (platform IN ('youtube', 'tiktok')),
    video_url           text        NOT NULL UNIQUE,
    video_id            text,
    title               text,
    thumbnail_url       text,
    duration_seconds    int,

    -- Location
    location_country    text,
    location_city       text,
    lat                 float,
    lng                 float,

    -- Classification
    category            text,
    description         text,
    device_type         text        CHECK (device_type IN ('iphone', 'gopro', 'insta360', 'android', 'other')),

    -- Review workflow
    status              text        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'accepted', 'rejected', 'flagged')),
    quality_score       int         CHECK (quality_score BETWEEN 0 AND 100),   -- set by admin
    points_awarded      int,

    -- Timestamps
    submitted_at        timestamptz NOT NULL DEFAULT now(),
    reviewed_at         timestamptz,
    points_awarded_at   timestamptz
);

COMMENT ON TABLE public.submissions IS 'Video URL submissions made by users.';
COMMENT ON COLUMN public.submissions.quality_score IS 'Admin-assigned quality score 0–100; drives points calculation.';
COMMENT ON COLUMN public.submissions.points_awarded IS 'Points granted after 24h delay once submission is accepted.';

-- Indexes
CREATE INDEX idx_submissions_user_id  ON public.submissions (user_id);
CREATE INDEX idx_submissions_status   ON public.submissions (status);
CREATE INDEX idx_submissions_submitted_at ON public.submissions (submitted_at DESC);

-- ------------------------------------------------------------
-- TABLE: public.point_events
-- Append-only ledger of all point credits/debits.
-- ------------------------------------------------------------
CREATE TABLE public.point_events (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount      int         NOT NULL,                          -- positive = credit, negative = debit
    reason      text        NOT NULL,
    metadata    jsonb,
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.point_events IS 'Immutable ledger of all point transactions.';

-- Indexes
CREATE INDEX idx_point_events_user_id    ON public.point_events (user_id);
CREATE INDEX idx_point_events_created_at ON public.point_events (created_at DESC);

-- ------------------------------------------------------------
-- TABLE: public.point_transfers
-- Peer-to-peer point transfers between users.
-- ------------------------------------------------------------
CREATE TABLE public.point_transfers (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    to_user_id   uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount       int         NOT NULL CHECK (amount > 0),
    note         text,
    created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.point_transfers IS 'Peer-to-peer point transfer records.';

-- ------------------------------------------------------------
-- TABLE: public.external_datasets
-- Catalogue of third-party datasets shown on the platform.
-- ------------------------------------------------------------
CREATE TABLE public.external_datasets (
    id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name           text        NOT NULL,
    description    text,
    focus          text,
    item_count     int,
    duration_hours float,
    license        text,
    source_url     text,
    download_url   text,
    paper_url      text,
    device_types   text[],
    indexed_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.external_datasets IS 'External dataset catalogue for discovery.';
