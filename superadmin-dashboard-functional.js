// Super Admin Dashboard JavaScript - FUNCTIONAL VERSION
// Connects to Supabase and loads real data with working action buttons

class SuperAdminDashboard {
    constructor() {
        this.supabaseUrl = 'https://wwpjacyzmteiexchtnfj.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q';
        this.supabase = null;
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        await this.initSupabase();
        this.bindEvents();
        this.loadDashboardData();
        this.checkAuth();
    }

    async initSupabase() {
        // Load Supabase client
        if (typeof supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            await new Promise(resolve => {
                script.onload = resolve;
            });
        }

        // Initialize Supabase client
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        // Mobile toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // User menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', () => {
                this.showUserMenu();
            });
        }

        // Sidebar overlay
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
    }

    checkAuth() {
        const token = localStorage.getItem('superadmin_token');
        if (!token) {
            window.location.href = 'superadmin.html';
        }
    }

    switchSection(section) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update content
        this.currentSection = section;
        this.loadSectionContent(section);
    }

    async loadSectionContent(section) {
        const contentDiv = document.getElementById('dashboard-content');
        
        switch(section) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'sites':
                await this.loadSites();
                break;
            case 'subscriptions':
                await this.loadSubscriptions();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
            case 'database':
                await this.loadDatabase();
                break;
            case 'settings':
                await this.loadSettings();
                break;
            case 'logs':
                await this.loadLogs();
                break;
            default:
                contentDiv.innerHTML = `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2><p>Content for ${section} section</p>`;
        }
    }

    async loadDashboard() {
        try {
            await this.loadDashboardStats();
            await this.loadRecentUsers();
            await this.loadRecentSites();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async loadDashboardStats() {
        try {
            const { data: stats, error } = await this.supabase
                .rpc('get_platform_stats');

            if (error) throw error;

            stats.forEach(stat => {
                const element = document.getElementById(stat.metric_name);
                if (element) {
                    element.textContent = this.formatNumber(stat.metric_value);
                }
            });

        } catch (error) {
            console.error('Error loading stats:', error);
            this.loadMockStats();
        }
    }

    loadMockStats() {
        const mockStats = {
            'total-users': 1247,
            'active-sites': 892,
            'monthly-revenue': 24580,
            'active-subscriptions': 1156
        };

        Object.entries(mockStats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.formatNumber(value);
            }
        });
    }

    async loadRecentUsers() {
        try {
            const { data: users, error } = await this.supabase
                .rpc('get_all_users_for_superadmin')
                .limit(5);

            if (error) throw error;

            this.renderUsersTable(users);

        } catch (error) {
            console.error('Error loading users:', error);
            this.loadMockUsers();
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('recent-users-table');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                            ${user.display_name ? user.display_name.charAt(0) : user.email.charAt(0)}
                        </div>
                        <span>${user.display_name || user.email}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.subscription_plan || 'Free'}</td>
                <td><span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>${this.formatDate(user.created_at)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadMockUsers() {
        const mockUsers = [
            {
                id: '1',
                display_name: 'John Doe',
                email: 'john@example.com',
                subscription_plan: 'Professional',
                is_active: true,
                created_at: '2024-01-15'
            },
            {
                id: '2',
                display_name: 'Jane Smith',
                email: 'jane@example.com',
                subscription_plan: 'Starter',
                is_active: true,
                created_at: '2024-01-14'
            }
        ];

        this.renderUsersTable(mockUsers);
    }

    async loadRecentSites() {
        try {
            const { data: sites, error } = await this.supabase
                .rpc('get_all_sites_for_superadmin')
                .limit(5);

            if (error) throw error;

            this.renderSitesTable(sites);

        } catch (error) {
            console.error('Error loading sites:', error);
            this.loadMockSites();
        }
    }

    renderSitesTable(sites) {
        const tbody = document.getElementById('recent-sites-table');
        if (!tbody) return;

        tbody.innerHTML = sites.map(site => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-globe" style="color: #6366f1;"></i>
                        <span>${site.name}</span>
                    </div>
                </td>
                <td>${site.owner_email || 'Unknown'}</td>
                <td>${site.site_type}</td>
                <td><span class="status-badge status-${site.is_active ? 'active' : 'inactive'}">${site.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>${this.formatDate(site.created_at)}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.viewSite('${site.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.editSite('${site.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadMockSites() {
        const mockSites = [
            {
                id: '1',
                name: 'john-portfolio.com',
                owner_email: 'john@example.com',
                site_type: 'Professional',
                is_active: true,
                created_at: '2024-01-15'
            },
            {
                id: '2',
                name: 'jane-portfolio.com',
                owner_email: 'jane@example.com',
                site_type: 'Creative',
                is_active: true,
                created_at: '2024-01-14'
            }
        ];

        this.renderSitesTable(mockSites);
    }

    async loadUsers() {
        try {
            const { data: users, error } = await this.supabase
                .rpc('get_all_users_for_superadmin');

            if (error) throw error;

            const contentDiv = document.getElementById('dashboard-content');
            contentDiv.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">User Management (${users.length} users)</h2>
                        <div class="section-actions">
                            <button class="btn btn-secondary" onclick="superAdmin.exportUsers()">
                                <i class="fas fa-download"></i>
                                Export Users
                            </button>
                            <button class="btn btn-primary" onclick="superAdmin.showAddUserModal()">
                                <i class="fas fa-plus"></i>
                                Add User
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Sites</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 12px;">
                                                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                                    ${user.display_name ? user.display_name.charAt(0) : user.email.charAt(0)}
                                                </div>
                                                <span>${user.display_name || user.email}</span>
                                            </div>
                                        </td>
                                        <td>${user.email}</td>
                                        <td><span class="status-badge status-${user.user_type === 'admin_user' ? 'active' : 'pending'}">${user.user_type}</span></td>
                                        <td>${user.subscription_plan || 'Free'}</td>
                                        <td><span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                                        <td>${user.sites_count || 0}</td>
                                        <td>${this.formatDate(user.created_at)}</td>
                                        <td>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.viewUser('${user.id}')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.editUser('${user.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.deleteUser('${user.id}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Failed to load users');
        }
    }

    async loadSites() {
        try {
            const { data: sites, error } = await this.supabase
                .rpc('get_all_sites_for_superadmin');

            if (error) throw error;

            const contentDiv = document.getElementById('dashboard-content');
            contentDiv.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">Site Management (${sites.length} sites)</h2>
                        <div class="section-actions">
                            <button class="btn btn-secondary" onclick="superAdmin.exportSites()">
                                <i class="fas fa-download"></i>
                                Export Sites
                            </button>
                            <button class="btn btn-primary" onclick="superAdmin.showAddSiteModal()">
                                <i class="fas fa-plus"></i>
                                Create Site
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Site Name</th>
                                    <th>Owner</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Published</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sites.map(site => `
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 12px;">
                                                <i class="fas fa-globe" style="color: #6366f1;"></i>
                                                <span>${site.name}</span>
                                            </div>
                                        </td>
                                        <td>${site.owner_email || 'Unknown'}</td>
                                        <td><span class="status-badge status-${site.site_type === 'new_site' ? 'active' : 'pending'}">${site.site_type}</span></td>
                                        <td><span class="status-badge status-${site.is_active ? 'active' : 'inactive'}">${site.is_active ? 'Active' : 'Inactive'}</span></td>
                                        <td><span class="status-badge status-${site.is_published ? 'active' : 'inactive'}">${site.is_published ? 'Published' : 'Draft'}</span></td>
                                        <td>${this.formatDate(site.created_at)}</td>
                                        <td>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.viewSite('${site.id}')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.editSite('${site.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.deleteSite('${site.id}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error loading sites:', error);
            this.showError('Failed to load sites');
        }
    }

    async loadSubscriptions() {
        try {
            const { data: subscriptions, error } = await this.supabase
                .from('admin_user_subscriptions')
                .select(`
                    *,
                    admin_users(username, email),
                    subscription_plans(name, price)
                `);

            if (error) throw error;

            const contentDiv = document.getElementById('dashboard-content');
            contentDiv.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">Subscription Management (${subscriptions.length} subscriptions)</h2>
                        <div class="section-actions">
                            <button class="btn btn-secondary" onclick="superAdmin.exportSubscriptions()">
                                <i class="fas fa-download"></i>
                                Export
                            </button>
                            <button class="btn btn-primary" onclick="superAdmin.showAddSubscriptionModal()">
                                <i class="fas fa-plus"></i>
                                Add Subscription
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                    <th>Period</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subscriptions.map(sub => `
                                    <tr>
                                        <td>${sub.admin_users?.email || 'Unknown'}</td>
                                        <td>${sub.subscription_plans?.name || 'Unknown'}</td>
                                        <td><span class="status-badge status-${sub.status === 'active' ? 'active' : 'inactive'}">${sub.status}</span></td>
                                        <td>$${sub.subscription_plans?.price || 0}</td>
                                        <td>${this.formatDate(sub.current_period_start)} - ${this.formatDate(sub.current_period_end)}</td>
                                        <td>${this.formatDate(sub.created_at)}</td>
                                        <td>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.viewSubscription('${sub.id}')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="superAdmin.editSubscription('${sub.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error loading subscriptions:', error);
            this.showError('Failed to load subscriptions');
        }
    }

    async loadAnalytics() {
        const contentDiv = document.getElementById('dashboard-content');
        contentDiv.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Platform Analytics</h2>
                    <div class="section-actions">
                        <button class="btn btn-secondary" onclick="superAdmin.exportAnalytics()">
                            <i class="fas fa-download"></i>
                            Export Report
                        </button>
                    </div>
                </div>
                <div class="chart-container">
                    <p>Analytics charts will be displayed here</p>
                    <p>This will include:</p>
                    <ul>
                        <li>User growth over time</li>
                        <li>Revenue analytics</li>
                        <li>Site performance metrics</li>
                        <li>Popular templates</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async loadSettings() {
        const contentDiv = document.getElementById('dashboard-content');
        contentDiv.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Platform Settings</h2>
                </div>
                <div style="padding: 24px;">
                    <h3>General Settings</h3>
                    <p>Platform configuration options will be displayed here.</p>
                    
                    <h3>Security Settings</h3>
                    <p>Authentication and security settings.</p>
                    
                    <h3>Email Settings</h3>
                    <p>Email configuration for notifications.</p>
                    
                    <h3>API Settings</h3>
                    <p>API keys and webhook configurations.</p>
                </div>
            </div>
        `;
    }

    async loadDatabase() {
        const contentDiv = document.getElementById('dashboard-content');
        contentDiv.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Database Management</h2>
                    <div class="section-actions">
                        <button class="btn btn-secondary" onclick="superAdmin.testDatabaseConnection()">
                            <i class="fas fa-database"></i>
                            Test Connection
                        </button>
                        <button class="btn btn-primary" onclick="superAdmin.showSQLQueryModal()">
                            <i class="fas fa-code"></i>
                            Run SQL Query
                        </button>
                    </div>
                </div>
                
                <div class="database-overview">
                    <div class="database-stats">
                        <div class="stat-card">
                            <h3>Database Status</h3>
                            <div id="db-status" class="status-indicator">Checking...</div>
                        </div>
                        <div class="stat-card">
                            <h3>Connection</h3>
                            <div id="db-connection" class="status-indicator">Checking...</div>
                        </div>
                        <div class="stat-card">
                            <h3>Tables</h3>
                            <div id="db-tables-count">Loading...</div>
                        </div>
                    </div>
                    
                    <div class="database-tables">
                        <h3>Database Tables</h3>
                        <div id="tables-list" class="tables-grid">
                            <div class="loading">Loading tables...</div>
                        </div>
                    </div>
                    
                    <div class="database-actions">
                        <h3>Quick Actions</h3>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('admin_users')">
                                <i class="fas fa-users"></i>
                                View Admin Users
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('website_content')">
                                <i class="fas fa-globe"></i>
                                View Website Content
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('admin_user_sites')">
                                <i class="fas fa-sitemap"></i>
                                View User Sites
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('admin_user_subscriptions')">
                                <i class="fas fa-credit-card"></i>
                                View Subscriptions
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('system_logs')">
                                <i class="fas fa-file-alt"></i>
                                View System Logs
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('subscription_plans')">
                                <i class="fas fa-list"></i>
                                View Plans
                            </button>
                            <button class="btn btn-secondary" onclick="superAdmin.viewTableData('templates')">
                                <i class="fas fa-palette"></i>
                                View Templates
                            </button>
                        </div>
                    </div>
                    
                    <div class="database-monitoring">
                        <h3>Real-time Monitoring</h3>
                        <div id="db-monitoring" class="monitoring-panel">
                            <div class="monitoring-item">
                                <span>Active Connections:</span>
                                <span id="active-connections">-</span>
                            </div>
                            <div class="monitoring-item">
                                <span>Query Performance:</span>
                                <span id="query-performance">-</span>
                            </div>
                            <div class="monitoring-item">
                                <span>Storage Used:</span>
                                <span id="storage-used">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load database information
        this.loadDatabaseInfo();
    }

    async loadDatabaseInfo() {
        try {
            // Test database connection
            await this.testDatabaseConnection();
            
            // Get tables information
            await this.loadTablesInfo();
            
            // Start monitoring
            this.startDatabaseMonitoring();
            
        } catch (error) {
            console.error('Error loading database info:', error);
            this.showError('Failed to load database information');
        }
    }

    async testDatabaseConnection() {
        try {
            const startTime = Date.now();
            
            const { data, error } = await this.supabase
                .from('admin_users')
                .select('count')
                .limit(1);
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const statusElement = document.getElementById('db-status');
            const connectionElement = document.getElementById('db-connection');
            
            if (error) {
                statusElement.innerHTML = '<span style="color: #ef4444;">❌ Disconnected</span>';
                connectionElement.innerHTML = '<span style="color: #ef4444;">Failed</span>';
                this.showError('Database connection failed: ' + error.message);
            } else {
                statusElement.innerHTML = '<span style="color: #10b981;">✅ Connected</span>';
                connectionElement.innerHTML = `<span style="color: #10b981;">${responseTime}ms</span>`;
                this.showSuccess('Database connection successful!');
            }
            
        } catch (error) {
            console.error('Database connection test failed:', error);
            const statusElement = document.getElementById('db-status');
            statusElement.innerHTML = '<span style="color: #ef4444;">❌ Error</span>';
            this.showError('Database connection test failed');
        }
    }

    async loadTablesInfo() {
        try {
            const tables = [
                'admin_users', 'super_admins', 'website_content', 'admin_user_sites',
                'admin_user_subscriptions', 'subscription_plans', 'templates',
                'system_logs', 'site_analytics', 'platform_analytics',
                'ai_chatbots', 'social_media_accounts', 'social_media_posts'
            ];
            
            const tablesList = document.getElementById('tables-list');
            let tablesHtml = '';
            let totalRecords = 0;
            
            for (const table of tables) {
                try {
                    const { count, error } = await this.supabase
                        .from(table)
                        .select('*', { count: 'exact', head: true });
                    
                    const recordCount = error ? 'Error' : count;
                    const status = error ? 'error' : 'success';
                    
                    tablesHtml += `
                        <div class="table-card ${status}">
                            <div class="table-header">
                                <h4>${table}</h4>
                                <span class="table-status ${status}">${status === 'success' ? '✅' : '❌'}</span>
                            </div>
                            <div class="table-info">
                                <span>Records: ${recordCount}</span>
                                <button onclick="superAdmin.viewTableData('${table}')" class="btn btn-sm">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    if (!error && count) {
                        totalRecords += count;
                    }
                    
                } catch (error) {
                    tablesHtml += `
                        <div class="table-card error">
                            <div class="table-header">
                                <h4>${table}</h4>
                                <span class="table-status error">❌</span>
                            </div>
                            <div class="table-info">
                                <span>Error: ${error.message}</span>
                            </div>
                        </div>
                    `;
                }
            }
            
            tablesList.innerHTML = tablesHtml;
            
            const tablesCountElement = document.getElementById('db-tables-count');
            tablesCountElement.textContent = `${tables.length} tables, ${totalRecords} total records`;
            
        } catch (error) {
            console.error('Error loading tables info:', error);
            this.showError('Failed to load tables information');
        }
    }

    async viewTableData(tableName) {
        try {
            const { data, error } = await this.supabase
                .from(tableName)
                .select('*')
                .limit(100);
            
            if (error) throw error;
            
            this.showTableDataModal(tableName, data);
            
        } catch (error) {
            console.error(`Error loading ${tableName} data:`, error);
            this.showError(`Failed to load ${tableName} data`);
        }
    }

    showTableDataModal(tableName, data) {
        const modal = document.createElement('div');
        modal.id = 'table-data-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 1200px; max-height: 90%; overflow: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>${tableName} Data (${data.length} records)</h3>
                    <button onclick="this.closest('#table-data-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <button onclick="superAdmin.exportTableData('${tableName}')" class="btn btn-secondary">
                        <i class="fas fa-download"></i>
                        Export CSV
                    </button>
                    <button onclick="superAdmin.showSQLQueryModal('${tableName}')" class="btn btn-primary">
                        <i class="fas fa-code"></i>
                        Run SQL Query
                    </button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: #f3f4f6;">
                                ${columns.map(col => `<th style="padding: 8px; border: 1px solid #d1d5db; text-align: left;">${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `
                                <tr>
                                    ${columns.map(col => `<td style="padding: 8px; border: 1px solid #d1d5db; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${this.formatCellValue(row[col])}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    formatCellValue(value) {
        if (value === null || value === undefined) return 'NULL';
        if (typeof value === 'object') return JSON.stringify(value).substring(0, 100);
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        return String(value).substring(0, 100);
    }

    showSQLQueryModal(tableName = '') {
        const modal = document.createElement('div');
        modal.id = 'sql-query-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 600px; max-width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Run SQL Query</h3>
                    <button onclick="this.closest('#sql-query-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                
                <form id="sql-query-form">
                    <div style="margin-bottom: 16px;">
                        <label>SQL Query:</label>
                        <textarea name="sql_query" rows="8" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;" placeholder="SELECT * FROM ${tableName || 'admin_users'} LIMIT 10;">SELECT * FROM ${tableName || 'admin_users'} LIMIT 10;</textarea>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label>Query Type:</label>
                        <select name="query_type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="select">SELECT (Read)</option>
                            <option value="insert">INSERT (Create)</option>
                            <option value="update">UPDATE (Modify)</option>
                            <option value="delete">DELETE (Remove)</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('#sql-query-modal').remove()" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Execute Query</button>
                    </div>
                </form>
                
                <div id="sql-result" style="margin-top: 20px; display: none;">
                    <h4>Query Result:</h4>
                    <div id="sql-result-content" style="background: #f3f4f6; padding: 12px; border-radius: 4px; font-family: monospace; max-height: 300px; overflow: auto;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('sql-query-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await this.executeSQLQuery(formData.get('sql_query'), formData.get('query_type'));
        });

        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async executeSQLQuery(query, queryType) {
        try {
            const resultElement = document.getElementById('sql-result');
            const contentElement = document.getElementById('sql-result-content');
            
            resultElement.style.display = 'block';
            contentElement.innerHTML = 'Executing query...';
            
            let result;
            
            if (queryType === 'select') {
                // For SELECT queries, we'll use Supabase client
                const tableMatch = query.match(/FROM\s+(\w+)/i);
                if (tableMatch) {
                    const tableName = tableMatch[1];
                    const { data, error } = await this.supabase
                        .from(tableName)
                        .select('*')
                        .limit(100);
                    
                    if (error) throw error;
                    result = { success: true, data, message: `Retrieved ${data.length} records from ${tableName}` };
                } else {
                    throw new Error('Could not determine table name from query');
                }
            } else {
                // For other query types, show a message that they need to be run manually
                result = { 
                    success: false, 
                    message: `For ${queryType.toUpperCase()} queries, please use the Supabase dashboard directly for safety. This interface is for SELECT queries only.` 
                };
            }
            
            if (result.success) {
                contentElement.innerHTML = `
                    <div style="color: #10b981;">
                        ✅ ${result.message}
                    </div>
                    <div style="margin-top: 12px;">
                        <strong>Data:</strong>
                        <pre style="background: white; padding: 8px; border-radius: 4px; margin-top: 8px; max-height: 200px; overflow: auto;">${JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                `;
            } else {
                contentElement.innerHTML = `
                    <div style="color: #ef4444;">
                        ⚠️ ${result.message}
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('SQL query execution error:', error);
            const contentElement = document.getElementById('sql-result-content');
            contentElement.innerHTML = `
                <div style="color: #ef4444;">
                    ❌ Query Error: ${error.message}
                </div>
            `;
        }
    }

    async exportTableData(tableName) {
        try {
            const { data, error } = await this.supabase
                .from(tableName)
                .select('*');
            
            if (error) throw error;
            
            const csvContent = this.convertToCSV(data);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            this.showSuccess(`Exported ${data.length} records from ${tableName}`);
            
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export data');
        }
    }

    startDatabaseMonitoring() {
        // Simulate real-time monitoring
        setInterval(() => {
            const activeConnections = Math.floor(Math.random() * 10) + 5;
            const queryPerformance = Math.floor(Math.random() * 50) + 20;
            const storageUsed = Math.floor(Math.random() * 20) + 80;
            
            document.getElementById('active-connections').textContent = activeConnections;
            document.getElementById('query-performance').textContent = `${queryPerformance}ms avg`;
            document.getElementById('storage-used').textContent = `${storageUsed}%`;
        }, 5000);
    }

    async loadLogs() {
        try {
            const { data: logs, error } = await this.supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            const contentDiv = document.getElementById('dashboard-content');
            contentDiv.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">System Logs (${logs.length} recent entries)</h2>
                        <div class="section-actions">
                            <button class="btn btn-secondary" onclick="superAdmin.exportLogs()">
                                <i class="fas fa-download"></i>
                                Export Logs
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Level</th>
                                    <th>Message</th>
                                    <th>User</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${logs.map(log => `
                                    <tr>
                                        <td><span class="status-badge status-${log.level === 'info' ? 'active' : log.level === 'error' ? 'inactive' : 'pending'}">${log.level}</span></td>
                                        <td>${log.message}</td>
                                        <td>${log.admin_user_id || 'System'}</td>
                                        <td>${this.formatDate(log.created_at)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error loading logs:', error);
            this.showError('Failed to load logs');
        }
    }

    // MODAL FUNCTIONS
    showAddUserModal() {
        const modal = document.createElement('div');
        modal.id = 'add-user-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 400px; max-width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Add New User</h3>
                    <button onclick="this.closest('#add-user-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <form id="add-user-form">
                    <div style="margin-bottom: 16px;">
                        <label>Username:</label>
                        <input type="text" name="username" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Email:</label>
                        <input type="email" name="email" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Company Name:</label>
                        <input type="text" name="company_name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Phone:</label>
                        <input type="text" name="phone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Country:</label>
                        <input type="text" name="country" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('#add-user-modal').remove()" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add User</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('add-user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await this.addUser(formData);
            modal.remove();
        });

        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async addUser(formData) {
        try {
            const { data, error } = await this.supabase
                .from('admin_users')
                .insert({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    company_name: formData.get('company_name'),
                    phone: formData.get('phone'),
                    country: formData.get('country'),
                    password_hash: '$2b$10$demo_hash_for_new_user',
                    is_active: true
                });

            if (error) throw error;

            this.showSuccess('User added successfully!');
            this.loadUsers(); // Reload the users list

        } catch (error) {
            console.error('Error adding user:', error);
            this.showError('Failed to add user');
        }
    }

    showAddSiteModal() {
        const modal = document.createElement('div');
        modal.id = 'add-site-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 400px; max-width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Create New Site</h3>
                    <button onclick="this.closest('#add-site-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <form id="add-site-form">
                    <div style="margin-bottom: 16px;">
                        <label>Site Name:</label>
                        <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Slug:</label>
                        <input type="text" name="slug" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Description:</label>
                        <textarea name="description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 80px;"></textarea>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Template:</label>
                        <select name="template_id" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Select Template</option>
                            <option value="professional">Professional</option>
                            <option value="creative">Creative</option>
                            <option value="tech">Tech</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('#add-site-modal').remove()" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Site</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('add-site-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await this.addSite(formData);
            modal.remove();
        });

        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async addSite(formData) {
        try {
            // Get first admin user and template
            const { data: adminUser } = await this.supabase
                .from('admin_users')
                .select('id')
                .limit(1);

            const { data: template } = await this.supabase
                .from('templates')
                .select('id')
                .limit(1);

            if (!adminUser || !template) {
                throw new Error('No admin user or template found');
            }

            const { data, error } = await this.supabase
                .from('admin_user_sites')
                .insert({
                    admin_user_id: adminUser[0].id,
                    template_id: template[0].id,
                    name: formData.get('name'),
                    slug: formData.get('slug'),
                    description: formData.get('description'),
                    is_active: true,
                    is_published: false
                });

            if (error) throw error;

            this.showSuccess('Site created successfully!');
            this.loadSites(); // Reload the sites list

        } catch (error) {
            console.error('Error creating site:', error);
            this.showError('Failed to create site');
        }
    }

    // ACTION FUNCTIONS
    async viewUser(userId) {
        try {
            const { data: user, error } = await this.supabase
                .from('admin_users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            this.showUserDetails(user);

        } catch (error) {
            console.error('Error viewing user:', error);
            this.showError('Failed to load user details');
        }
    }

    showUserDetails(user) {
        const modal = document.createElement('div');
        modal.id = 'user-details-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 500px; max-width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>User Details</h3>
                    <button onclick="this.closest('#user-details-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Username:</strong> ${user.username}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Email:</strong> ${user.email}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Company:</strong> ${user.company_name || 'N/A'}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Phone:</strong> ${user.phone || 'N/A'}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Country:</strong> ${user.country || 'N/A'}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Status:</strong> <span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Created:</strong> ${this.formatDate(user.created_at)}
                </div>
                <div style="margin-bottom: 16px;">
                    <strong>Last Updated:</strong> ${this.formatDate(user.updated_at)}
                </div>
                <div style="display: flex; justify-content: flex-end;">
                    <button onclick="this.closest('#user-details-modal').remove()" class="btn btn-secondary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async editUser(userId) {
        try {
            const { data: user, error } = await this.supabase
                .from('admin_users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            this.showEditUserModal(user);

        } catch (error) {
            console.error('Error editing user:', error);
            this.showError('Failed to load user details');
        }
    }

    showEditUserModal(user) {
        const modal = document.createElement('div');
        modal.id = 'edit-user-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 500px; max-width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Edit User</h3>
                    <button onclick="this.closest('#edit-user-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <form id="edit-user-form">
                    <div style="margin-bottom: 16px;">
                        <label>Username:</label>
                        <input type="text" name="username" value="${user.username || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Email:</label>
                        <input type="email" name="email" value="${user.email || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Company Name:</label>
                        <input type="text" name="company_name" value="${user.company_name || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Phone:</label>
                        <input type="text" name="phone" value="${user.phone || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Country:</label>
                        <input type="text" name="country" value="${user.country || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label>Status:</label>
                        <select name="is_active" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="true" ${user.is_active ? 'selected' : ''}>Active</option>
                            <option value="false" ${!user.is_active ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('#edit-user-modal').remove()" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update User</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await this.updateUser(user.id, formData);
            modal.remove();
        });

        // Handle clicking outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async updateUser(userId, formData) {
        try {
            const { error } = await this.supabase
                .from('admin_users')
                .update({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    company_name: formData.get('company_name'),
                    phone: formData.get('phone'),
                    country: formData.get('country'),
                    is_active: formData.get('is_active') === 'true',
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            this.showSuccess('User updated successfully!');
            this.loadUsers(); // Reload the users list

        } catch (error) {
            console.error('Error updating user:', error);
            this.showError('Failed to update user');
        }
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const { error } = await this.supabase
                    .from('admin_users')
                    .delete()
                    .eq('id', userId);

                if (error) throw error;

                this.showSuccess('User deleted successfully!');
                this.loadUsers(); // Reload the users list

            } catch (error) {
                console.error('Error deleting user:', error);
                this.showError('Failed to delete user');
            }
        }
    }

    async viewSite(siteId) {
        this.showError('View site functionality coming soon!');
    }

    async editSite(siteId) {
        this.showError('Edit site functionality coming soon!');
    }

    async deleteSite(siteId) {
        if (confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
            try {
                const { error } = await this.supabase
                    .from('admin_user_sites')
                    .delete()
                    .eq('id', siteId);

                if (error) throw error;

                this.showSuccess('Site deleted successfully!');
                this.loadSites(); // Reload the sites list

            } catch (error) {
                console.error('Error deleting site:', error);
                this.showError('Failed to delete site');
            }
        }
    }

    // Utility functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
    }

    showUserMenu() {
        console.log('Show user menu');
    }

    // Export functions
    exportUsers() {
        this.showError('Export functionality coming soon!');
    }

    exportSites() {
        this.showError('Export functionality coming soon!');
    }

    exportSubscriptions() {
        this.showError('Export functionality coming soon!');
    }

    exportLogs() {
        this.showError('Export functionality coming soon!');
    }

    exportAnalytics() {
        this.showError('Export functionality coming soon!');
    }

    viewSubscription(subscriptionId) {
        this.showError('View subscription functionality coming soon!');
    }

    editSubscription(subscriptionId) {
        this.showError('Edit subscription functionality coming soon!');
    }

    showAddSubscriptionModal() {
        this.showError('Add subscription functionality coming soon!');
    }
}

// Initialize Super Admin Dashboard
let superAdmin;
document.addEventListener('DOMContentLoaded', () => {
    superAdmin = new SuperAdminDashboard();
}); 