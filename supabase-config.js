// Supabase Configuration
console.log('supabase-config.js loaded');

const SUPABASE_CONFIG = {
    url: 'https://wwpjacyzmteiexchtnfj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk2OTYwMiwiZXhwIjoyMDY0NTQ1NjAyfQ.c5Q1uauvggvVjDB-96l3brCUmwMfiLjwOGefjYAfDrs'
};

// Initialize Supabase client (will be created after library loads)
let supabase = null;

// Function to initialize Supabase client
function initSupabaseClient() {
    try {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('Supabase client initialized in config');
            return true;
        }
        console.log('Supabase library not ready yet');
        return false;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return false;
    }
}

// Website content management functions
class WebsiteContentManager {
    constructor() {
        this.supabase = null;
        this.init();
    }

    init() {
        if (!supabase) {
            if (!initSupabaseClient()) {
                console.error('Supabase library not loaded');
                return false;
            }
        }
        this.supabase = supabase;
        return true;
    }

    // Load all website content
    async loadAllContent() {
        try {
            const { data, error } = await this.supabase
                .from('website_content')
                .select('*');
            
            if (error) throw error;
            
            // Convert array to object with section_name as key
            const content = {};
            data.forEach(item => {
                content[item.section_name] = item.content;
            });
            
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
            return {};
        }
    }

    // Load specific section
    async loadSection(sectionName) {
        try {
            const { data, error } = await this.supabase
                .from('website_content')
                .select('content')
                .eq('section_name', sectionName)
                .single();
            
            if (error) throw error;
            return data.content;
        } catch (error) {
            console.error(`Error loading section ${sectionName}:`, error);
            return null;
        }
    }

    // Save section content
    async saveSection(sectionName, content) {
        try {
            const { data, error } = await this.supabase
                .from('website_content')
                .upsert({
                    section_name: sectionName,
                    content: content
                }, {
                    onConflict: 'section_name'
                });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error saving section ${sectionName}:`, error);
            throw error;
        }
    }

    // Update specific section
    async updateSection(sectionName, content) {
        try {
            const { data, error } = await this.supabase
                .from('website_content')
                .update({ content: content })
                .eq('section_name', sectionName);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error updating section ${sectionName}:`, error);
            throw error;
        }
    }

    // Delete section
    async deleteSection(sectionName) {
        try {
            const { error } = await this.supabase
                .from('website_content')
                .delete()
                .eq('section_name', sectionName);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`Error deleting section ${sectionName}:`, error);
            throw error;
        }
    }
}

// Export for use in other files
window.WebsiteContentManager = WebsiteContentManager;
window.supabase = supabase; 