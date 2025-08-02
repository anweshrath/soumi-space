// Supabase Configuration
// Replace these values with your actual Supabase project details

const SUPABASE_CONFIG = {
    // Your Supabase project URL
    url: 'https://wwpjacyzmteiexchtnfj.supabase.co',
    
    // Your Supabase anon key (public key)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q',
    
    // Your Supabase service role key (for admin operations)
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk2OTYwMiwiZXhwIjoyMDY0NTQ1NjAyfQ.c5Q1uauvggvVjDB-96l3brCUmwMfiLjwOGefjYAfDrs'
};

// Super Admin Configuration
const SUPERADMIN_CONFIG = {
    // Default Super Admin credentials
    defaultUsername: 'superadmin',
    defaultPassword: 'admin123',
    
    // Session timeout (in minutes)
    sessionTimeout: 60,
    
    // Dashboard refresh interval (in seconds)
    refreshInterval: 30,
    
    // Features enabled for Super Admin
    features: {
        userManagement: true,
        siteManagement: true,
        subscriptionManagement: true,
        analytics: true,
        systemLogs: true,
        backups: true,
        apiAccess: true
    }
};

// Database table names
const TABLES = {
    USERS: 'users',
    ADMIN_USERS: 'admin_users',
    USER_SITES: 'user_sites',
    SUBSCRIPTION_PLANS: 'subscription_plans',
    USER_SUBSCRIPTIONS: 'user_subscriptions',
    TEMPLATES: 'templates',
    SYSTEM_LOGS: 'system_logs',
    WEBSITE_CONTENT: 'website_content'
};

// Database views
const VIEWS = {
    ALL_USERS: 'all_users',
    ALL_SITES: 'all_sites',
    SUPERADMIN_DASHBOARD: 'superadmin_dashboard'
};

// Database functions
const FUNCTIONS = {
    GET_PLATFORM_STATS: 'get_platform_stats',
    GET_ALL_USERS: 'get_all_users_for_superadmin',
    GET_ALL_SITES: 'get_all_sites_for_superadmin'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        SUPERADMIN_CONFIG,
        TABLES,
        VIEWS,
        FUNCTIONS
    };
} else {
    // For browser usage
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.SUPERADMIN_CONFIG = SUPERADMIN_CONFIG;
    window.TABLES = TABLES;
    window.VIEWS = VIEWS;
    window.FUNCTIONS = FUNCTIONS;
} 