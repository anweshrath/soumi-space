-- Update skills data with all 4 categories
UPDATE website_content 
SET content = jsonb_set(
    content,
    '{skills}',
    '{
        "Admissions & Immigration": [
            {"name": "Australia Specialist", "percentage": 95, "color": "#6a5acd"},
            {"name": "Visa Application Processing", "percentage": 90, "color": "#8e6ee6"},
            {"name": "Immigration Regulations", "percentage": 85, "color": "#ffa726"},
            {"name": "Student Counseling", "percentage": 90, "color": "#6a5acd"},
            {"name": "Application Review", "percentage": 95, "color": "#8e6ee6"}
        ],
        "Management & Leadership": [
            {"name": "Team Leadership", "percentage": 85, "color": "#6a5acd"},
            {"name": "Process Optimization", "percentage": 90, "color": "#8e6ee6"},
            {"name": "Training & Development", "percentage": 80, "color": "#ffa726"},
            {"name": "Decision-Making", "percentage": 85, "color": "#6a5acd"},
            {"name": "Stakeholder Management", "percentage": 80, "color": "#8e6ee6"}
        ],
        "Finance & Accounting": [
            {"name": "Financial Analysis", "percentage": 85, "color": "#6a5acd"},
            {"name": "Accounting Software", "percentage": 75, "color": "#8e6ee6"},
            {"name": "Reports Management", "percentage": 90, "color": "#ffa726"},
            {"name": "Reconciliation", "percentage": 85, "color": "#6a5acd"}
        ],
        "Languages & Communication": [
            {"name": "English", "percentage": 90, "color": "#6a5acd"},
            {"name": "Hindi", "percentage": 85, "color": "#8e6ee6"},
            {"name": "Bengali", "percentage": 100, "color": "#ffa726"},
            {"name": "Written Communication", "percentage": 90, "color": "#6a5acd"},
            {"name": "Presentation Skills", "percentage": 85, "color": "#8e6ee6"}
        ]
    }'::jsonb
)
WHERE section_name = 'skills'; 