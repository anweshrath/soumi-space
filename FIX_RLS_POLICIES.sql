-- Fix RLS Policies for website_content table
-- This will drop existing policies and create new ones

-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow public read access" ON public.website_content;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.website_content;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.website_content;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON public.website_content;
DROP POLICY IF EXISTS "Allow all operations" ON public.website_content;

-- Create a simple policy that allows all operations
CREATE POLICY "Allow all operations" ON public.website_content
    FOR ALL USING (true)
    WITH CHECK (true); 