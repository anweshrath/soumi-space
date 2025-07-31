# Supabase Integration Setup

## Overview
This project now uses Supabase for data persistence instead of localStorage. The admin panel saves content to Supabase, and the main website loads content from Supabase.

## Files Created/Modified

### New Files:
- `ADMIN_AUTH_FINAL.sql` - Admin authentication table
- `WEBSITE_DATA_FINAL.sql` - Website content table
- `supabase-config.js` - Supabase configuration and content management
- `website-loader.js` - Script to load content from Supabase to the main website

### Modified Files:
- `admin.html` - Added Supabase client and configuration scripts
- `admin.js` - Updated to use Supabase instead of localStorage
- `index.html` - Added Supabase client and website loader script

## Setup Instructions

### 1. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. **First**: Copy and paste the contents of `ADMIN_AUTH_FINAL.sql` and run it
4. **Second**: Copy and paste the contents of `WEBSITE_DATA_FINAL.sql` and run it

### 2. Configuration
The Supabase credentials are already configured in `supabase-config.js`:
- Project URL: `https://wwpjacyzmteiexchtnfj.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Usage
1. **Admin Panel**: Access `admin.html` and log in with:
   - Username: `admin`
   - Password: `soumita2024`
2. **Main Website**: Access `index.html` to see the website with content loaded from Supabase

## How It Works

### Admin Panel (`admin.html`)
- Saves content to Supabase when you click "Save Changes"
- Loads existing content from Supabase when you log in
- Updates are immediately reflected in the database

### Main Website (`index.html`)
- Automatically loads content from Supabase when the page loads
- Displays the latest content saved from the admin panel
- No manual refresh needed - content is loaded dynamically

## Database Schema

The `website_content` table stores:
- `section_name`: The section being edited (hero, about, experience, etc.)
- `content`: JSON data containing all the content for that section
- `created_at` and `updated_at`: Timestamps for tracking changes

## Troubleshooting

1. **Content not loading**: Check browser console for errors
2. **Admin panel not working**: Verify Supabase credentials in `supabase-config.js`
3. **Database errors**: Ensure the schema has been created in Supabase

## Security Notes

- The anon key is used for client-side access
- Row Level Security (RLS) is enabled on the database
- Consider implementing proper authentication for production use 