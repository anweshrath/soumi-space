-- =====================================================
-- FINAL FIX FOR ADMIN LOGIN - ENSURES ADMIN USER EXISTS
-- =====================================================

-- First, let's check if admin_users table exists and has the right structure
SELECT '=== CHECKING ADMIN_USERS TABLE ===' as info;

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_users'
) as table_exists;

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- Check if admin user exists
SELECT '=== CHECKING ADMIN USER ===' as info;
SELECT id, username, email, password_hash, is_active, created_at 
FROM admin_users 
WHERE username = 'admin';

-- If admin user doesn't exist, create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin') THEN
        INSERT INTO admin_users (
            username, 
            email, 
            password_hash, 
            is_active, 
            company_name,
            created_at,
            updated_at
        ) VALUES (
            'admin',
            'admin@example.com',
            'soumita2024',  -- Simple password for now
            true,
            'Admin Company',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Admin user created successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- Verify admin user exists now
SELECT '=== VERIFYING ADMIN USER ===' as info;
SELECT id, username, email, password_hash, is_active, created_at 
FROM admin_users 
WHERE username = 'admin';

-- Test the login query
SELECT '=== TESTING LOGIN QUERY ===' as info;
SELECT 
    id,
    username,
    email,
    password_hash,
    is_active
FROM admin_users 
WHERE username = 'admin' 
AND password_hash = 'soumita2024';

SELECT '=== ADMIN LOGIN SHOULD NOW WORK ===' as success; 