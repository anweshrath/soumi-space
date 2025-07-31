-- Check what's currently in the skills section
SELECT section_name, content->'skills' as skills_data 
FROM website_content 
WHERE section_name = 'skills'; 