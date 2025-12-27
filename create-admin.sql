-- ============================================
-- Create Initial Admin User Script
-- ============================================
-- 
-- This script creates an initial admin user for sanadmin
-- 
-- IMPORTANT: Replace the password hash with your own!
-- 
-- Generate password hash:
--   node -e "const argon2 = require('@node-rs/argon2'); argon2.hash('YourSecurePassword').then(console.log)"
-- 
-- USAGE:
--   psql $DATABASE_URL -f create-admin.sql
-- 
-- ============================================

-- Generate a unique ID for the admin user
INSERT INTO "user" (
    "id",
    "username",
    "password_hash",
    "role",
    "created_at"
) VALUES (
    'admin-' || gen_random_uuid()::text,
    'admin',
    -- ⚠️ REPLACE THIS WITH YOUR ACTUAL ARGON2 HASH ⚠️
    -- Generate with: node scripts/generate-password-hash.js "YourPassword"
    -- This placeholder will NOT work - it must be replaced!
    'REPLACE_WITH_YOUR_ACTUAL_ARGON2_HASH_FROM_GENERATE_SCRIPT',
    'superadmin',
    NOW()
)
ON CONFLICT ("username") DO NOTHING;

-- Verify the admin user was created
SELECT 
    "id",
    "username",
    "role",
    "created_at"
FROM "user"
WHERE "username" = 'admin';

-- Display instructions
DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Admin User Creation';
    RAISE NOTICE '====================================';
    RAISE NOTICE '';
    RAISE NOTICE 'If you see the admin user above, creation was successful!';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Remember to replace the password hash';
    RAISE NOTICE 'with your own generated hash before running this script.';
    RAISE NOTICE '';
    RAISE NOTICE 'To generate a password hash:';
    RAISE NOTICE '  1. Install dependencies: npm install @node-rs/argon2';
    RAISE NOTICE '  2. Run: node scripts/generate-password-hash.js';
    RAISE NOTICE '  3. Copy the hash and replace it in this file';
    RAISE NOTICE '';
    RAISE NOTICE 'Username: admin';
    RAISE NOTICE 'Password: (the one you hashed)';
    RAISE NOTICE '';
    RAISE NOTICE '====================================';
END $$;
