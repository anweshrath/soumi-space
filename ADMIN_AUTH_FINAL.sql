-- ADMIN AUTHENTICATION - FINAL CLEAN VERSION
-- This file creates the admin users table and initial credentials

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create admin users table
CREATE TABLE public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON public.admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert initial admin user
INSERT INTO public.admin_users (username, password_hash) VALUES
('admin', 'soumita2024');

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.admin_users
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.admin_users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON public.admin_users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON public.admin_users
    FOR DELETE USING (auth.role() = 'authenticated'); 