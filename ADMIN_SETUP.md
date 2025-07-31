# Admin Authentication Setup

## What's Been Updated

### 1. Database Schema (`ADMIN_AUTH_FINAL.sql` and `WEBSITE_DATA_FINAL.sql`)
- Added `admin_users` table for storing admin credentials
- Added default admin user with username: `admin` and password: `soumita2024`
- Added proper RLS policies for security

### 2. Admin Panel (`admin.html`)
- Added "Change Credentials" section in the sidebar
- Added form for updating username and password
- Integrated with Supabase authentication

### 3. Admin JavaScript (`admin.js`)
- Updated authentication to use Supabase instead of hardcoded credentials
- Added `changeCredentials()` function for updating admin credentials
- Added proper error handling and validation

## Setup Instructions

### Step 1: Update Database Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. **First**: Copy and paste `ADMIN_AUTH_FINAL.sql` content and run it
4. **Second**: Copy and paste `WEBSITE_DATA_FINAL.sql` content and run it
4. Run the SQL to create the admin_users table

### Step 2: Test Admin Login
1. Access `admin.html`
2. Login with:
   - Username: `admin`
   - Password: `soumita2024`

### Step 3: Change Credentials (Optional)
1. After logging in, click on "Change Credentials" in the sidebar
2. Enter your new username and password
3. Click "Update Credentials"

## Features

### Authentication
- Secure login using Supabase database
- Session management with localStorage
- Proper logout functionality

### Credential Management
- Change username and password from admin panel
- Current password verification
- Password confirmation validation
- Automatic form clearing after successful update

### Security
- Row Level Security (RLS) enabled on admin_users table
- Proper error handling and user feedback
- Input validation for all forms

## Default Credentials
- **Username**: `admin`
- **Password**: `soumita2024`

## Troubleshooting

1. **Can't login**: Make sure the admin_users table was created in Supabase
2. **Credential change not working**: Check browser console for errors
3. **Database errors**: Verify Supabase connection in `admin.js`

## Files Modified
- `ADMIN_AUTH_FINAL.sql` - Admin authentication table
- `WEBSITE_DATA_FINAL.sql` - Website content table
- `admin.html` - Added credentials change form
- `admin.js` - Updated authentication logic 