-- ============================================================
-- 004_verification_code.sql — Video ownership verification
-- ============================================================

-- Add verification_code column to users (8-digit unique integer)
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS verification_code int UNIQUE;

COMMENT ON COLUMN public.users.verification_code IS
    '8-digit unique code used for video ownership verification (e.g. #scanworld20002139).';

-- Back-fill existing users with a random 8-digit code
UPDATE public.users
SET verification_code = floor(random() * 90000000 + 10000000)::int
WHERE verification_code IS NULL;

-- Enforce NOT NULL after back-fill
ALTER TABLE public.users
    ALTER COLUMN verification_code SET NOT NULL;
