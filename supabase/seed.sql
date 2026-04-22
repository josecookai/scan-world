-- ============================================================
-- seed.sql — Development seed data
-- NOTE: Uses placeholder UUIDs; does NOT touch auth.users.
--       Run after all migrations have been applied.
-- ============================================================

-- ============================================================
-- Users  (3 rows: 1 admin, 2 regular)
-- ============================================================
INSERT INTO public.users (id, email, username, avatar_url, bio, country, points, tier, role, created_at)
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'admin@scanworld.dev',
        'admin',
        NULL,
        'Platform administrator',
        'US',
        0,
        'scout',
        'admin',
        now() - INTERVAL '60 days'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'alice@example.com',
        'alice_explorer',
        'https://i.pravatar.cc/150?u=alice',
        'Street photographer and urban explorer.',
        'DE',
        725,
        'explorer',
        'user',
        now() - INTERVAL '30 days'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'bob@example.com',
        'bob_scout',
        'https://i.pravatar.cc/150?u=bob',
        'Aspiring world traveller.',
        'BR',
        150,
        'scout',
        'user',
        now() - INTERVAL '15 days'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Submissions  (5 rows with varied statuses)
-- ============================================================
INSERT INTO public.submissions (
    id,
    user_id,
    platform,
    video_url,
    video_id,
    title,
    thumbnail_url,
    duration_seconds,
    location_country,
    location_city,
    lat,
    lng,
    category,
    description,
    device_type,
    status,
    quality_score,
    points_awarded,
    submitted_at,
    reviewed_at,
    points_awarded_at
)
VALUES
    -- 1. Accepted + points already awarded (alice)
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        'youtube',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'dQw4w9WgXcQ',
        'Berlin Street Scene – Alexanderplatz at Night',
        'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        180,
        'DE',
        'Berlin',
        52.5200,
        13.4050,
        'urban',
        'Nighttime timelapse around Alexanderplatz.',
        'iphone',
        'accepted',
        85,
        -- points: 85*2 + 50 (iphone) + 25 (country) + 25 (category) = 270
        270,
        now() - INTERVAL '10 days',
        now() - INTERVAL '9 days',
        now() - INTERVAL '8 days'
    ),
    -- 2. Accepted + points awarded (alice)
    (
        '10000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        'youtube',
        'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        'ScMzIvxBSi4',
        'Hamburg Harbour Morning Walk',
        'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
        240,
        'DE',
        'Hamburg',
        53.5488,
        9.9872,
        'waterfront',
        'Early morning walk along the Elbphilharmonie promenade.',
        'gopro',
        'accepted',
        75,
        -- points: 75*2 + 50 (gopro) + 25 (country) + 25 (category) = 250
        -- but we only awarded 250 - let alice's total land at 725 via events
        250,
        now() - INTERVAL '7 days',
        now() - INTERVAL '6 days',
        now() - INTERVAL '5 days'
    ),
    -- 3. Pending (bob) — awaiting review
    (
        '10000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        'youtube',
        'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        'ysz5S6PUM-U',
        'Sao Paulo City Center Rush Hour',
        'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
        300,
        'BR',
        'São Paulo',
        -23.5505,
        -46.6333,
        'urban',
        'Rush hour footage from Paulista Avenue.',
        'android',
        'pending',
        NULL,
        NULL,
        now() - INTERVAL '2 days',
        NULL,
        NULL
    ),
    -- 4. Rejected (bob)
    (
        '10000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000003',
        'youtube',
        'https://www.youtube.com/watch?v=9bZkp7q19f0',
        '9bZkp7q19f0',
        'Random Indoor Clip',
        'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
        60,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'Low quality indoor recording, does not meet outdoor requirement.',
        'other',
        'rejected',
        15,
        NULL,
        now() - INTERVAL '5 days',
        now() - INTERVAL '4 days',
        NULL
    ),
    -- 5. Flagged (alice) — under moderation review
    (
        '10000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000002',
        'tiktok',
        'https://www.tiktok.com/@user/video/7000000000000000001',
        '7000000000000000001',
        'Suspicious Repost',
        NULL,
        120,
        'FR',
        'Paris',
        48.8566,
        2.3522,
        'landmark',
        'Possibly duplicated content — under review.',
        'iphone',
        'flagged',
        NULL,
        NULL,
        now() - INTERVAL '1 day',
        NULL,
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Point events  (ledger entries for the two accepted submissions)
-- ============================================================
INSERT INTO public.point_events (id, user_id, amount, reason, metadata, created_at)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        270,
        'submission_accepted',
        '{"submission_id": "10000000-0000-0000-0000-000000000001"}'::jsonb,
        now() - INTERVAL '8 days'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        250,
        'submission_accepted',
        '{"submission_id": "10000000-0000-0000-0000-000000000002"}'::jsonb,
        now() - INTERVAL '5 days'
    ),
    -- Bonus sign-up event for alice (brings total to 725 = 270 + 250 + 205)
    (
        '20000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        205,
        'welcome_bonus',
        '{"note": "Early adopter welcome bonus"}'::jsonb,
        now() - INTERVAL '30 days'
    ),
    -- Welcome bonus for bob (150 points)
    (
        '20000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000003',
        150,
        'welcome_bonus',
        '{"note": "Early adopter welcome bonus"}'::jsonb,
        now() - INTERVAL '15 days'
    )
ON CONFLICT (id) DO NOTHING;
