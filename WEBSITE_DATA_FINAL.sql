-- WEBSITE DATA - FINAL CLEAN VERSION
-- This file creates the website content table and initial data

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.website_content CASCADE;

-- Create timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create website content table
CREATE TABLE public.website_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section_name);
CREATE INDEX IF NOT EXISTS idx_website_content_updated ON public.website_content(updated_at);

-- Create trigger
CREATE TRIGGER update_website_content_updated_at 
    BEFORE UPDATE ON public.website_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial website content
INSERT INTO public.website_content (section_name, content) VALUES
('hero', '{"greeting": "Hello, I am", "name": "Soumita Chatterjee", "subtitle": "Australia Immigration Specialist", "description": "Driving growth & operational excellence through expertise in global immigration, financial analysis, team leadership & process optimization.", "image": "https://soumita.space/images/soumita-office-1.jpeg"}'),
('about', '{"title": "Bridging Education & Immigration", "description": "A unique blend of financial expertise and educational consulting, dedicated to empowering global aspirations.", "text": "From the meticulous world of audit and accounting to the dynamic realm of education consulting, my career journey has been a testament to adaptability and continuous growth.\n\nBeginning as an Audit & Accounts Assistant, I cultivated an unwavering commitment to precision and accuracy. This foundation is now the cornerstone of my approach to education consulting.\n\nAs a Senior Admission Officer specializing in Australian immigration, I have discovered my true calling: helping individuals navigate complex educational and immigration landscapes with clarity and confidence.\n\nMy philosophy centers on creating seamless experiences that transform international dreams into reality, backed by rigorous planning, deep industry knowledge, and operational excellence."}'),
('experience', '[{"title": "Senior Admissions Officer", "company": "EPA Global", "date": "Aug 2023 – Present", "description": "Headed Australia immigration specialization. Managed cross-functional international teams. Oversaw international student admissions. Designed advanced training programs. Improved operational efficiency by 40%."}, {"title": "Admissions Officer", "company": "EPA Global", "date": "Apr 2022 – Jul 2023", "description": "Conducted comprehensive application reviews. Facilitated student interviews. Delivered exceptional client service. Processed complex visa applications. Guided on immigration compliance."}]'),
('skills', '{"Admissions & Immigration": [{"name": "Australia Specialist", "percentage": 95}, {"name": "Visa Application Processing", "percentage": 90}, {"name": "Immigration Regulations", "percentage": 85}, {"name": "Student Counseling", "percentage": 90}, {"name": "Application Review", "percentage": 95}]}'),
('testimonials', '[{"name": "Ananya S.", "title": "Masters Student", "quote": "Soumita transformed my dream of studying in Australia into reality. Her meticulous approach was exceptional.", "rating": 5}, {"name": "Priya S.", "title": "Senior Colleague", "quote": "Her commitment to excellence and process optimization has elevated our entire teams performance.", "rating": 5}]'),
('contact', '{"email": "hello@soumita.space", "linkedin": "https://www.linkedin.com/in/soumita-chatterjee", "location": "Kolkata, India"}'),
('settings', '{"title": "Soumita Chatterjee – Australia Immigration Specialist", "primaryColor": "#6a5acd", "secondaryColor": "#8e6ee6", "accentColor": "#ffa726"}');

-- Enable RLS
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Allow all operations" ON public.website_content
    FOR ALL USING (true)
    WITH CHECK (true); 