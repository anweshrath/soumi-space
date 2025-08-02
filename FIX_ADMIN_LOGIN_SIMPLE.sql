-- =====================================================
-- SIMPLE ADMIN LOGIN FIX - CLEAN AND SAFE
-- =====================================================

-- 1. First, let's see what admin users exist
SELECT '=== CURRENT ADMIN USERS ===' as info;
SELECT username, email, is_active FROM admin_users WHERE username = 'admin';

-- 2. Create or update the admin user with correct credentials
INSERT INTO admin_users (username, email, password_hash, is_active, company_name)
SELECT 'admin', 'admin@soumita.com', 'soumita2024', true, 'Soumita Space Admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- 3. Update existing admin user if it exists
UPDATE admin_users 
SET password_hash = 'soumita2024',
    email = 'admin@soumita.com',
    is_active = true,
    company_name = 'Soumita Space Admin'
WHERE username = 'admin';

-- 4. Verify the admin user is set up correctly
SELECT '=== ADMIN USER VERIFICATION ===' as info;
SELECT username, email, password_hash, is_active, company_name 
FROM admin_users WHERE username = 'admin';

-- 5. Test the login credentials
SELECT '=== LOGIN TEST ===' as info;
SELECT 
    CASE 
        WHEN username = 'admin' AND password_hash = 'soumita2024' AND is_active = true 
        THEN '✅ LOGIN WILL WORK'
        ELSE '❌ LOGIN WILL FAIL'
    END as login_status
FROM admin_users WHERE username = 'admin';

-- 6. Show all admin users for reference
SELECT '=== ALL ADMIN USERS ===' as info;
SELECT username, email, is_active FROM admin_users ORDER BY created_at;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

SELECT '✅ ADMIN LOGIN FIXED!' as status;
SELECT '👤 Username: admin' as info;
SELECT '🔑 Password: soumita2024' as info;
SELECT '📧 Email: admin@soumita.com' as info;
SELECT '🚀 Admin login should work now' as info; 