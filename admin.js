// Admin Panel JavaScript
console.log('Admin.js loaded!');
alert('Admin.js is loading!');

// Simple test to see if this code executes
try {
    console.log('Admin.js execution test - this should appear');
    alert('Admin.js execution test - this should appear');
} catch (error) {
    console.error('Error in admin.js:', error);
    alert('Error in admin.js: ' + error.message);
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    console.error('Error details:', event.message, 'at', event.filename, 'line', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

class AdminPanel {
    constructor() {
        console.log('AdminPanel constructor called');
        this.isAuthenticated = false;
        this.currentSection = 'hero';
        this.websiteData = {};
        this.contentManager = new WebsiteContentManager();
        this.supabase = null;
        this.init().catch(error => {
            console.error('Admin panel initialization failed:', error);
        });
    }

    async init() {
        this.logToDebug('Admin panel initializing...', 'info');
        
        // Wait a bit for Supabase to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!this.initSupabase()) {
            this.logToDebug('Failed to initialize Supabase - admin panel will not work properly', 'error');
        } else {
            // Test the connection
            await this.testSupabaseConnection();
        }
        
        this.checkAuth();
        this.bindEvents();
        this.loadData();
        this.setupNavigation();
        this.logToDebug('Admin panel initialization complete', 'success');
    }

    initSupabase() {
        try {
            this.logToDebug('Initializing Supabase client...', 'info');
            
            // Wait for Supabase to be available
            if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
                this.logToDebug('Supabase library not loaded! Waiting...', 'warning');
                // Try again in 1 second
                setTimeout(() => this.initSupabase(), 1000);
                return false;
            }
            
            this.supabase = window.supabase.createClient(
                'https://wwpjacyzmteiexchtnfj.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q'
            );
            
            this.logToDebug('Supabase client initialized successfully', 'success');
            return true;
        } catch (error) {
            this.logToDebug(`Supabase initialization error: ${error.message}`, 'error');
            return false;
        }
    }

    // Authentication
    checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (token) {
            this.isAuthenticated = true;
            this.showAdminPanel();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-panel').classList.add('hidden');
    }

    showAdminPanel() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        console.log('Admin panel shown');
        // Check if save button exists after showing panel
        setTimeout(() => {
            const saveBtn = document.getElementById('save-btn');
            console.log('Save button after showing panel:', saveBtn);
        }, 500);
    }

    // Event Bindings
    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            console.log('Login form found, adding event listener');
            loginForm.addEventListener('submit', (e) => {
                console.log('Login form submitted!');
                this.handleLogin(e);
            });
        } else {
            console.error('Login form not found!');
        }

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Buttons
        const saveBtn = document.getElementById('save-btn');
        console.log('Looking for save button...', saveBtn);
        if (saveBtn) {
            console.log('Save button found, adding event listener');
            saveBtn.addEventListener('click', () => {
                console.log('Save button clicked!');
                this.saveChanges();
            });
        } else {
            console.error('Save button not found!');
            // Try again after a delay
            setTimeout(() => {
                const retrySaveBtn = document.getElementById('save-btn');
                console.log('Retrying to find save button...', retrySaveBtn);
                if (retrySaveBtn) {
                    console.log('Save button found on retry, adding event listener');
                    retrySaveBtn.addEventListener('click', () => {
                        console.log('Save button clicked!');
                        this.saveChanges();
                    });
                }
            }, 1000);
        }

        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showPreview());
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Credential change form
        const changeCredentialsForm = document.getElementById('change-credentials-form');
        if (changeCredentialsForm) {
            changeCredentialsForm.addEventListener('submit', (e) => this.changeCredentials());
        }

        // Modal
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closePreview());
        }

        // Form inputs
        this.bindFormInputs();
        
        // Form configuration
        this.bindFormConfiguration();

        // Add buttons
        const addExperienceBtn = document.getElementById('add-experience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperience());
        }

        // Add skill buttons for each category
        const addSkillBtns = document.querySelectorAll('.add-skill-btn');
        console.log('Found add skill buttons:', addSkillBtns.length);
        addSkillBtns.forEach(btn => {
            console.log('Adding event listener to button:', btn);
            btn.addEventListener('click', (e) => {
                console.log('Add skill button clicked');
                const button = e.target.closest('.add-skill-btn');
                const categoryId = button.dataset.category;
                console.log('Category ID from button:', categoryId);
                this.addSkill(categoryId);
            });
        });

        const addTestimonialBtn = document.getElementById('add-testimonial');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', () => this.addTestimonial());
        }

        const addLinkedInPostBtn = document.getElementById('add-linkedin-post');
        if (addLinkedInPostBtn) {
            addLinkedInPostBtn.addEventListener('click', () => this.addLinkedInPost());
        }

        // File upload handlers
        this.bindFileUploadHandlers();

        // Theme selection handlers
        this.bindThemeHandlers();

        // Test connection button
        const testConnectionBtn = document.getElementById('test-connection');
        if (testConnectionBtn) {
            testConnectionBtn.addEventListener('click', () => this.testSupabaseConnection());
        }

        // Clear debug log button
        const clearLogBtn = document.getElementById('clear-log');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => this.clearDebugLog());
        }
    }

    // Debug logging functions
    logToDebug(message, type = 'info') {
        console.log(`[DEBUG] ${message}`);
        
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.textContent = `[${timestamp}] ${message}`;
            debugLog.appendChild(logEntry);
            debugLog.scrollTop = debugLog.scrollHeight;
        } else {
            console.error('Debug log element not found!');
        }
    }

    // Test Supabase connection
    async testSupabaseConnection() {
        if (!this.supabase) {
            this.logToDebug('Supabase client not initialized', 'error');
            return false;
        }

        try {
            this.logToDebug('Testing Supabase connection...', 'info');
            
            // Test admin_users table
            const { data: adminData, error: adminError } = await this.supabase
                .from('admin_users')
                .select('count')
                .limit(1);
            
            if (adminError) {
                this.logToDebug(`Admin table test failed: ${adminError.message}`, 'error');
            } else {
                this.logToDebug('Admin table accessible', 'success');
            }
            
            // Test website_content table
            const { data: contentData, error: contentError } = await this.supabase
                .from('website_content')
                .select('count')
                .limit(1);
            
            if (contentError) {
                this.logToDebug(`Website content table test failed: ${contentError.message}`, 'error');
            } else {
                this.logToDebug('Website content table accessible', 'success');
            }
            
            this.logToDebug('Supabase connection test completed', 'success');
            return true;
        } catch (error) {
            this.logToDebug(`Connection test exception: ${error.message}`, 'error');
            return false;
        }
    }

    clearDebugLog() {
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            debugLog.innerHTML = '';
        }
    }

    // File upload handlers
    bindFileUploadHandlers() {
        // Hero image upload
        const heroImageUpload = document.getElementById('hero-image-upload');
        if (heroImageUpload) {
            heroImageUpload.addEventListener('change', (e) => this.handleImageUpload(e, 'hero'));
        }

        // Bind file upload handlers for testimonials (will be called when testimonials are created)
        this.bindTestimonialFileUploads();
    }

    bindTestimonialFileUploads() {
        const testimonialUploads = document.querySelectorAll('.testimonial-image-upload');
        testimonialUploads.forEach(upload => {
            upload.addEventListener('change', (e) => this.handleImageUpload(e, 'testimonial'));
        });
    }

    async handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('File size must be less than 5MB', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select an image file', 'error');
            return;
        }

        try {
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            if (type === 'hero') {
                // Update hero image
                document.getElementById('hero-image').value = base64;
                const previewImg = document.getElementById('hero-preview-img');
                if (previewImg) {
                    previewImg.src = base64;
                    previewImg.style.display = 'block';
                }
            } else if (type === 'testimonial') {
                // Update testimonial image
                const index = event.target.getAttribute('data-index');
                const testimonialImageInput = document.querySelector(`.testimonial-image[data-index="${index}"]`);
                if (testimonialImageInput) {
                    testimonialImageInput.value = base64;
                }
                
                // Update preview
                const previewImg = event.target.closest('.image-upload-container').querySelector('.testimonial-preview-img');
                if (previewImg) {
                    previewImg.src = base64;
                    previewImg.style.display = 'block';
                }
            }

            this.showMessage('Image uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showMessage('Error uploading image', 'error');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Theme handlers
    bindThemeHandlers() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.getAttribute('data-theme');
                this.selectTheme(selectedTheme);
            });
        });
    }

    selectTheme(themeName) {
        // Remove selected class from all options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selected class to clicked option
        const selectedOption = document.querySelector(`[data-theme="${themeName}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Store theme selection
        if (!this.websiteData.settings) this.websiteData.settings = {};
        this.websiteData.settings.theme = themeName;

        // Update preview iframe with new theme
        this.updateThemeInPreview(themeName);

        this.showMessage(`Theme "${themeName}" selected!`, 'success');
    }

    updateThemeInPreview(themeName) {
        const iframe = document.getElementById('preview-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'CHANGE_THEME',
                theme: themeName
            }, '*');
        }
    }

    // Login Handler
    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        this.logToDebug(`Login attempt for username: ${username}`, 'info');

        // Check if Supabase is available
        if (!this.supabase) {
            this.logToDebug('Supabase client not available, trying to initialize...', 'error');
            if (!this.initSupabase()) {
                this.logToDebug('Failed to initialize Supabase', 'error');
                this.showMessage('Database connection not available. Please refresh the page.', 'error');
                return;
            }
        }

        try {
            this.logToDebug('Connecting to Supabase...', 'info');
            
            // Get admin user from Supabase
            const { data, error } = await this.supabase
                .from('admin_users')
                .select('*')
                .eq('username', username)
                .single();

            this.logToDebug(`Supabase query completed. Error: ${error ? error.message : 'None'}`, 'info');
            this.logToDebug(`Data received: ${data ? 'Yes' : 'No'}`, 'info');

            if (error) {
                this.logToDebug(`Database error: ${error.message}`, 'error');
                this.showMessage('Invalid credentials!', 'error');
                return;
            }

            if (!data) {
                this.logToDebug('No user found with this username', 'error');
                this.showMessage('Invalid credentials!', 'error');
                return;
            }

            this.logToDebug(`User found. Checking password...`, 'info');
            this.logToDebug(`Stored password hash: ${data.password_hash}`, 'info');
            this.logToDebug(`Entered password: ${password}`, 'info');

            // Simple password check (in production, use proper hashing)
            if (data.password_hash === password) {
                this.logToDebug('Password match! Login successful', 'success');
                localStorage.setItem('admin_token', 'authenticated');
                localStorage.setItem('admin_username', username);
                this.isAuthenticated = true;
                this.showAdminPanel();
                this.showMessage('Login successful!', 'success');
            } else {
                this.logToDebug('Password mismatch! Login failed', 'error');
                this.showMessage('Invalid credentials!', 'error');
            }
        } catch (error) {
            this.logToDebug(`Login exception: ${error.message}`, 'error');
            console.error('Login error:', error);
            this.showMessage('Login failed!', 'error');
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        this.isAuthenticated = false;
        this.showLoginScreen();
        this.showMessage('Logged out successfully!', 'success');
    }

    // Change Credentials
    async changeCredentials() {
        const currentUsername = localStorage.getItem('admin_username');
        const newUsername = document.getElementById('new-username').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!newUsername || !currentPassword || !newPassword || !confirmPassword) {
            this.showMessage('All fields are required!', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match!', 'error');
            return;
        }

        try {
            // Verify current credentials
            const { data: currentUser, error: verifyError } = await this.supabase
                .from('admin_users')
                .select('*')
                .eq('username', currentUsername)
                .single();

            if (verifyError || !currentUser || currentUser.password_hash !== currentPassword) {
                this.showMessage('Current password is incorrect!', 'error');
                return;
            }

            // Update credentials
            const { error: updateError } = await this.supabase
                .from('admin_users')
                .update({
                    username: newUsername,
                    password_hash: newPassword
                })
                .eq('username', currentUsername);

            if (updateError) {
                this.showMessage('Error updating credentials!', 'error');
                return;
            }

            // Update local storage
            localStorage.setItem('admin_username', newUsername);
            
            // Clear form
            document.getElementById('new-username').value = '';
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';

            this.showMessage('Credentials updated successfully!', 'success');
        } catch (error) {
            console.error('Error changing credentials:', error);
            this.showMessage('Error updating credentials!', 'error');
        }
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update editor sections
        document.querySelectorAll('.editor-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(`${section}-editor`).classList.add('active');

        this.currentSection = section;
    }

    // Form Input Binding
    bindFormInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updatePreview(e.target);
            });
        });
    }

    // Data Management
    async loadData() {
        try {
            this.websiteData = await this.contentManager.loadAllContent();
            if (Object.keys(this.websiteData).length === 0) {
                // If no data in Supabase, use default structure
                this.websiteData = this.getDefaultData();
            }
            this.populateForms();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showMessage('Error loading data from database', 'error');
            this.websiteData = this.getDefaultData();
            this.populateForms();
        }
    }

    getDefaultData() {
        return {
            hero: {
                greeting: 'Hello, I\'m',
                name: 'Soumita Chatterjee',
                subtitle: 'Australia Immigration Specialist',
                description: 'Driving growth & operational excellence through expertise in global immigration, financial analysis, team leadership & process optimization.',
                image: 'https://soumita.space/images/soumita-office-1.jpeg'
            },
            about: {
                title: 'Bridging Education & Immigration',
                description: 'A unique blend of financial expertise and educational consulting, dedicated to empowering global aspirations.',
                text: `From the meticulous world of audit and accounting to the dynamic realm of education consulting, my career journey has been a testament to adaptability and continuous growth.

Beginning as an Audit & Accounts Assistant, I cultivated an unwavering commitment to precision and accuracy. This foundation is now the cornerstone of my approach to education consulting.

As a Senior Admission Officer specializing in Australian immigration, I've discovered my true calling: helping individuals navigate complex educational and immigration landscapes with clarity and confidence.

My philosophy centers on creating seamless experiences that transform international dreams into reality, backed by rigorous planning, deep industry knowledge, and operational excellence.`
            },
            experience: [
                {
                    title: 'Senior Admissions Officer',
                    company: 'EPA Global',
                    date: 'Aug 2023 – Present',
                    description: 'Headed Australia immigration specialization. Managed cross-functional international teams. Oversaw international student admissions. Designed advanced training programs. Improved operational efficiency by 40%.'
                },
                {
                    title: 'Admissions Officer',
                    company: 'EPA Global',
                    date: 'Apr 2022 – Jul 2023',
                    description: 'Conducted comprehensive application reviews. Facilitated student interviews. Delivered exceptional client service. Processed complex visa applications. Guided on immigration compliance.'
                }
            ],
            skills: {
                'Admissions & Immigration': [
                    { name: 'Australia Specialist', percentage: 95 },
                    { name: 'Visa Application Processing', percentage: 90 },
                    { name: 'Immigration Regulations', percentage: 85 },
                    { name: 'Student Counseling', percentage: 90 },
                    { name: 'Application Review', percentage: 95 }
                ]
            },
            testimonials: [
                {
                    name: 'Ananya S.',
                    title: 'Master\'s Student',
                    quote: 'Soumita transformed my dream of studying in Australia into reality. Her meticulous approach was exceptional.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
                },
                {
                    name: 'Priya S.',
                    title: 'Senior Colleague',
                    quote: 'Her commitment to excellence and process optimization has elevated our entire team\'s performance.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
                },
                {
                    name: 'Vikram N.',
                    title: 'Parent of Applicant',
                    quote: 'Her guidance for my son\'s application was invaluable. She is trustworthy, knowledgeable, and incredibly patient.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                },
                {
                    name: 'Sunita K.',
                    title: 'Skilled Migration Applicant',
                    quote: 'The entire visa process was demystified thanks to Soumita. I felt supported at every single step.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
                }
            ],
            contact: {
                email: 'hello@soumita.space',
                linkedin: 'https://www.linkedin.com/in/soumita-chatterjee',
                location: 'Kolkata, India'
            },
            settings: {
                title: 'Soumita Chatterjee – Australia Immigration Specialist',
                primaryColor: '#6a5acd',
                secondaryColor: '#8e6ee6',
                accentColor: '#ffa726'
            }
        };
    }

    populateForms() {
        // Hero section
        if (this.websiteData.hero) {
            document.getElementById('hero-greeting').value = this.websiteData.hero.greeting || '';
            document.getElementById('hero-name').value = this.websiteData.hero.name || '';
            document.getElementById('hero-subtitle').value = this.websiteData.hero.subtitle || '';
            document.getElementById('hero-description').value = this.websiteData.hero.description || '';
            document.getElementById('hero-image').value = this.websiteData.hero.image || '';
            if (this.websiteData.hero.typewriterTitles) {
                document.getElementById('typewriter-titles').value = this.websiteData.hero.typewriterTitles.join(', ');
            }
        }

        // About section
        if (this.websiteData.about) {
            document.getElementById('about-title').value = this.websiteData.about.title || '';
            document.getElementById('about-description').value = this.websiteData.about.description || '';
            document.getElementById('about-text').value = this.websiteData.about.text || '';
        }

        // Contact section
        if (this.websiteData.contact) {
            document.getElementById('contact-email').value = this.websiteData.contact.email || '';
            document.getElementById('contact-linkedin').value = this.websiteData.contact.linkedin || '';
            document.getElementById('contact-location').value = this.websiteData.contact.location || '';
        }

        // Settings
        if (this.websiteData.settings) {
            document.getElementById('site-title').value = this.websiteData.settings.title || '';
            document.getElementById('primary-color').value = this.websiteData.settings.primaryColor || '#6a5acd';
            document.getElementById('secondary-color').value = this.websiteData.settings.secondaryColor || '#8e6ee6';
            document.getElementById('accent-color').value = this.websiteData.settings.accentColor || '#ffa726';
        }

        // Populate dynamic sections
        this.populateExperience();
        this.populateSkills();
        this.populateTestimonials();
        this.populateLinkedInPosts();
    }

    // Dynamic Section Population
    populateExperience() {
        const container = document.getElementById('experience-list');
        if (!container) return;

        container.innerHTML = '';
        if (this.websiteData.experience) {
            this.websiteData.experience.forEach((exp, index) => {
                container.appendChild(this.createExperienceItem(exp, index));
            });
        }
    }

    populateSkills() {
        console.log('Populating skills...');
        console.log('Current skills data:', this.websiteData.skills);
        
        const categories = {
            'admissions': 'Admissions & Immigration',
            'management': 'Management & Leadership', 
            'finance': 'Finance & Accounting',
            'languages': 'Languages & Communication'
        };

        Object.entries(categories).forEach(([categoryId, categoryName]) => {
            const container = document.getElementById(`skills-${categoryId}`);
            console.log(`Looking for container: skills-${categoryId}`, container);
            
            if (!container) {
                console.log(`Container not found for ${categoryId}`);
                return;
            }

            container.innerHTML = '';
            
            // Check if skills exist for this category
            if (this.websiteData.skills && this.websiteData.skills[categoryName] && this.websiteData.skills[categoryName].length > 0) {
                console.log(`Found skills for ${categoryName}:`, this.websiteData.skills[categoryName]);
                this.websiteData.skills[categoryName].forEach((skill, index) => {
                    container.appendChild(this.createSkillItem(skill, index, categoryId));
                });
            } else {
                console.log(`No skills found for ${categoryName}, adding default skills`);
                // Add default skills for empty categories
                const defaultSkills = this.getDefaultSkillsForCategory(categoryName);
                defaultSkills.forEach((skill, index) => {
                    container.appendChild(this.createSkillItem(skill, index, categoryId));
                });
            }
        });
    }

    getDefaultSkillsForCategory(categoryName) {
        const defaultSkills = {
            'Admissions & Immigration': [
                { name: 'Australia Specialist', percentage: 95, color: '#6a5acd' },
                { name: 'Visa Application Processing', percentage: 90, color: '#8e6ee6' },
                { name: 'Immigration Regulations', percentage: 85, color: '#ffa726' },
                { name: 'Student Counseling', percentage: 90, color: '#6a5acd' },
                { name: 'Application Review', percentage: 95, color: '#8e6ee6' }
            ],
            'Management & Leadership': [
                { name: 'Team Leadership', percentage: 85, color: '#6a5acd' },
                { name: 'Process Optimization', percentage: 90, color: '#8e6ee6' },
                { name: 'Training & Development', percentage: 80, color: '#ffa726' },
                { name: 'Decision-Making', percentage: 85, color: '#6a5acd' },
                { name: 'Stakeholder Management', percentage: 80, color: '#8e6ee6' }
            ],
            'Finance & Accounting': [
                { name: 'Financial Analysis', percentage: 85, color: '#6a5acd' },
                { name: 'Accounting Software', percentage: 75, color: '#8e6ee6' },
                { name: 'Reports Management', percentage: 90, color: '#ffa726' },
                { name: 'Reconciliation', percentage: 85, color: '#6a5acd' }
            ],
            'Languages & Communication': [
                { name: 'English', percentage: 90, color: '#6a5acd' },
                { name: 'Hindi', percentage: 85, color: '#8e6ee6' },
                { name: 'Bengali', percentage: 100, color: '#ffa726' },
                { name: 'Written Communication', percentage: 90, color: '#6a5acd' },
                { name: 'Presentation Skills', percentage: 85, color: '#8e6ee6' }
            ]
        };
        
        return defaultSkills[categoryName] || [];
    }

    populateTestimonials() {
        console.log('Populating testimonials...');
        console.log('Current testimonials data:', this.websiteData.testimonials);
        
        const container = document.getElementById('testimonials-list');
        if (!container) {
            console.log('Testimonials container not found');
            return;
        }

        container.innerHTML = '';
        if (this.websiteData.testimonials && this.websiteData.testimonials.length > 0) {
            console.log(`Found ${this.websiteData.testimonials.length} testimonials`);
            this.websiteData.testimonials.forEach((testimonial, index) => {
                console.log(`Creating testimonial ${index}:`, testimonial);
                container.appendChild(this.createTestimonialItem(testimonial, index));
            });
        } else {
            console.log('No testimonials found, using default testimonials');
            // Add default testimonials if none exist
            const defaultTestimonials = this.getDefaultTestimonials();
            defaultTestimonials.forEach((testimonial, index) => {
                container.appendChild(this.createTestimonialItem(testimonial, index));
            });
        }

        // Bind file upload handlers for testimonials
        this.bindTestimonialFileUploads();
    }

    populateLinkedInPosts() {
        console.log('Populating LinkedIn posts...');
        console.log('Current LinkedIn data:', this.websiteData.linkedin);
        
        const container = document.getElementById('linkedin-posts-list');
        if (!container) {
            console.log('LinkedIn posts container not found');
            return;
        }

        container.innerHTML = '';
        if (this.websiteData.linkedin && this.websiteData.linkedin.length > 0) {
            console.log(`Found ${this.websiteData.linkedin.length} LinkedIn posts`);
            this.websiteData.linkedin.forEach((post, index) => {
                console.log(`Creating LinkedIn post ${index}:`, post);
                container.appendChild(this.createLinkedInPostItem(post, index));
            });
        } else {
            console.log('No LinkedIn posts found, using default posts');
            const defaultPosts = this.getDefaultLinkedInPosts();
            defaultPosts.forEach((post, index) => {
                container.appendChild(this.createLinkedInPostItem(post, index));
            });
        }
    }

    getDefaultLinkedInPosts() {
        return [
            {
                url: 'https://www.linkedin.com/posts/soumita-chatterjee_australia-immigration-specialist-activity-123456789',
                title: 'Discipline > Motivation',
                description: 'Discipline > Motivation. I don\'t wait for motivation. It\'s Thursday. Work needs to get done. Problems need solving. Teams need clarity. Students need direction. That\'s more than enough reason to show up.',
                date: '1 week ago',
                image: ''
            },
            {
                url: 'https://www.linkedin.com/posts/soumita-chatterjee_digital-transformation-immigration-activity-123456789',
                title: 'The impact of digital transformation on immigration processes',
                description: 'Exploring how technology is revolutionizing visa applications and making the process more efficient for students and professionals.',
                date: '2 weeks ago',
                image: ''
            }
        ];
    }

    getDefaultTestimonials() {
        return [
            {
                name: 'Ananya S.',
                title: 'Master\'s Student',
                quote: 'Soumita transformed my dream of studying in Australia into reality. Her meticulous approach was exceptional.',
                rating: 5,
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
            },
            {
                name: 'Priya S.',
                title: 'Senior Colleague',
                quote: 'Her commitment to excellence and process optimization has elevated our entire team\'s performance.',
                rating: 5,
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
            },
            {
                name: 'Vikram N.',
                title: 'Parent of Applicant',
                quote: 'Her guidance for my son\'s application was invaluable. She is trustworthy, knowledgeable, and incredibly patient.',
                rating: 5,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            {
                name: 'Sunita K.',
                title: 'Skilled Migration Applicant',
                quote: 'The entire visa process was demystified thanks to Soumita. I felt supported at every single step.',
                rating: 5,
                image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
            }
        ];
    }

    // Create Dynamic Items
    createExperienceItem(exp, index) {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <h3>Experience ${index + 1}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="exp-title" value="${exp.title}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="exp-company" value="${exp.company}" data-index="${index}">
                </div>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="text" class="exp-date" value="${exp.date}" data-index="${index}">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="exp-description" rows="4" data-index="${index}">${exp.description}</textarea>
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="adminPanel.removeExperience(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }

    createSkillItem(skill, index, categoryId) {
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Skill Name</label>
                    <input type="text" class="skill-name" value="${skill.name}" data-index="${index}" data-category="${categoryId}">
                </div>
                <div class="form-group">
                    <label>Percentage</label>
                    <input type="number" class="skill-percentage" value="${skill.percentage}" min="0" max="100" data-index="${index}" data-category="${categoryId}">
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" class="skill-color" value="${skill.color || '#6a5acd'}" data-index="${index}" data-category="${categoryId}">
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="adminPanel.removeSkill(${index}, '${categoryId}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }

    createTestimonialItem(testimonial, index) {
        const div = document.createElement('div');
        div.className = 'testimonial-item';
        div.innerHTML = `
            <h3>Testimonial ${index + 1}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="testimonial-name" value="${testimonial.name || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="testimonial-title" value="${testimonial.title || ''}" data-index="${index}">
                </div>
            </div>
            <div class="form-group">
                <label>Profile Image</label>
                <div class="image-upload-container">
                    <div class="image-input-group">
                        <label class="input-label">Image URL</label>
                        <input type="url" class="testimonial-image" value="${testimonial.image || ''}" placeholder="https://example.com/image.jpg" data-index="${index}">
                    </div>
                    <div class="image-input-group">
                        <label class="input-label">Or Upload Image</label>
                        <input type="file" class="testimonial-image-upload" accept="image/*" data-index="${index}">
                        <small>Max 5MB, JPG, PNG, or GIF</small>
                    </div>
                    <div class="image-preview testimonial-image-preview" data-index="${index}">
                        <img class="testimonial-preview-img" src="${testimonial.image || ''}" alt="Testimonial preview" onerror="this.style.display='none'">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Rating (1-5)</label>
                <input type="number" class="testimonial-rating" value="${testimonial.rating || 5}" min="1" max="5" data-index="${index}">
            </div>
            <div class="form-group">
                <label>Quote</label>
                <textarea class="testimonial-quote" rows="3" data-index="${index}">${testimonial.quote || ''}</textarea>
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="adminPanel.removeTestimonial(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }

    createLinkedInPostItem(post, index) {
        const div = document.createElement('div');
        div.className = 'linkedin-post-item';
        div.setAttribute('data-index', index);
        div.innerHTML = `
            <h3>LinkedIn Post ${index + 1}</h3>
            <div class="form-group">
                <label>LinkedIn Post URL</label>
                <input type="url" class="linkedin-post-url" value="${post.url || ''}" data-index="${index}" placeholder="https://www.linkedin.com/posts/...">
                <small>Enter the LinkedIn post URL</small>
            </div>
            <div class="form-group">
                <label>Post Title</label>
                <input type="text" class="linkedin-post-title" value="${post.title || ''}" data-index="${index}" placeholder="Enter post title">
            </div>
            <div class="form-group">
                <label>Post Content</label>
                <textarea class="linkedin-post-description" rows="4" data-index="${index}" placeholder="Enter the post content/description">${post.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Cover Image URL</label>
                <input type="url" class="linkedin-post-image" value="${post.image || ''}" data-index="${index}" placeholder="https://example.com/image.jpg">
                <small>Optional: Add an image URL for the post</small>
            </div>
            <div class="form-group">
                <label>Date Posted</label>
                <input type="text" class="linkedin-post-date" value="${post.date || ''}" data-index="${index}" placeholder="e.g., 2 days ago, 1 week ago">
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="adminPanel.removeLinkedInPost(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }

    // Add Items
    addExperience() {
        if (!this.websiteData.experience) this.websiteData.experience = [];
        
        const newExp = {
            title: 'New Position',
            company: 'Company Name',
            date: 'Date Range',
            description: 'Description of responsibilities and achievements.'
        };
        
        this.websiteData.experience.push(newExp);
        this.populateExperience();
        this.showMessage('Experience added!', 'success');
    }

    addSkill(categoryId) {
        console.log('Adding skill for category:', categoryId);
        
        if (!this.websiteData.skills) this.websiteData.skills = {};
        
        const categories = {
            'admissions': 'Admissions & Immigration',
            'management': 'Management & Leadership', 
            'finance': 'Finance & Accounting',
            'languages': 'Languages & Communication'
        };
        
        const categoryName = categories[categoryId];
        console.log('Category name:', categoryName);
        
        if (!categoryName) {
            console.log('Invalid category ID:', categoryId);
            return;
        }
        
        if (!this.websiteData.skills[categoryName]) {
            this.websiteData.skills[categoryName] = [];
        }
        
        const newSkill = {
            name: 'New Skill',
            percentage: 80,
            color: '#6a5acd'
        };
        
        console.log('Adding skill to category:', categoryName, newSkill);
        this.websiteData.skills[categoryName].push(newSkill);
        this.populateSkills();
        this.showMessage('Skill added!', 'success');
    }

    addTestimonial() {
        if (!this.websiteData.testimonials) this.websiteData.testimonials = [];
        
        const newTestimonial = {
            name: 'Client Name',
            title: 'Client Title',
            quote: 'Client testimonial quote.',
            rating: 5,
            image: ''
        };
        
        this.websiteData.testimonials.push(newTestimonial);
        this.populateTestimonials();
        this.showMessage('Testimonial added!', 'success');
    }

    addLinkedInPost() {
        if (!this.websiteData.linkedin) this.websiteData.linkedin = [];
        
        const newPost = {
            url: 'https://www.linkedin.com/posts/...',
            title: 'LinkedIn Post Title',
            description: 'Brief description of the post content...',
            date: '2 days ago'
        };
        
        this.websiteData.linkedin.push(newPost);
        this.populateLinkedInPosts();
        this.showMessage('LinkedIn post added!', 'success');
    }

    // Remove Items
    removeExperience(index) {
        this.websiteData.experience.splice(index, 1);
        this.populateExperience();
        this.showMessage('Experience removed!', 'success');
    }

    removeSkill(index, categoryId) {
        const categories = {
            'admissions': 'Admissions & Immigration',
            'management': 'Management & Leadership', 
            'finance': 'Finance & Accounting',
            'languages': 'Languages & Communication'
        };
        
        const categoryName = categories[categoryId];
        if (!categoryName || !this.websiteData.skills[categoryName]) return;
        
        this.websiteData.skills[categoryName].splice(index, 1);
        this.populateSkills();
        this.showMessage('Skill removed!', 'success');
    }

    removeTestimonial(index) {
        this.websiteData.testimonials.splice(index, 1);
        this.populateTestimonials();
        this.showMessage('Testimonial removed!', 'success');
    }

    removeLinkedInPost(index) {
        this.websiteData.linkedin.splice(index, 1);
        this.populateLinkedInPosts();
        this.showMessage('LinkedIn post removed!', 'success');
    }



    // Update Preview
    updatePreview(input) {
        const fieldId = input.id;
        const value = input.value;
        
        // Update data
        if (fieldId.startsWith('hero-')) {
            const field = fieldId.replace('hero-', '');
            if (!this.websiteData.hero) this.websiteData.hero = {};
            this.websiteData.hero[field] = value;
        } else if (fieldId.startsWith('about-')) {
            const field = fieldId.replace('about-', '');
            if (!this.websiteData.about) this.websiteData.about = {};
            this.websiteData.about[field] = value;
        } else if (fieldId.startsWith('contact-')) {
            const field = fieldId.replace('contact-', '');
            if (!this.websiteData.contact) this.websiteData.contact = {};
            this.websiteData.contact[field] = value;
        } else if (fieldId.startsWith('site-')) {
            const field = fieldId.replace('site-', '');
            if (!this.websiteData.settings) this.websiteData.settings = {};
            this.websiteData.settings[field] = value;
        }

        // Update preview iframe
        this.updatePreviewIframe();
    }

    updatePreviewIframe() {
        const iframe = document.getElementById('preview-iframe');
        if (iframe && iframe.contentWindow) {
            // Send data to iframe
            iframe.contentWindow.postMessage({
                type: 'UPDATE_WEBSITE',
                data: this.websiteData
            }, '*');
        }
    }

    // Save Changes
    async saveChanges() {
        try {
            console.log('Starting save process...');
            this.logToDebug('Starting save process...', 'info');
            
            // Collect all form data
            this.collectFormData();
            console.log('Form data collected:', this.websiteData);
            this.logToDebug(`Form data collected: ${JSON.stringify(this.websiteData)}`, 'info');
            
            // Check if Supabase is available
            if (!this.supabase) {
                console.error('Supabase client not available');
                this.showMessage('Database connection not available', 'error');
                return;
            }
            
            // Save each section to Supabase directly
            for (const [sectionName, content] of Object.entries(this.websiteData)) {
                console.log(`Saving section: ${sectionName}`, content);
                this.logToDebug(`Saving section: ${sectionName}`, 'info');
                
                const upsertData = {
                    section_name: sectionName,
                    content: content
                };
                console.log('Upsert data:', upsertData);
                
                const { data, error } = await this.supabase
                    .from('website_content')
                    .upsert(upsertData, {
                        onConflict: 'section_name'
                    });
                
                if (error) {
                    console.error(`Error saving ${sectionName}:`, error);
                    this.logToDebug(`Error saving ${sectionName}: ${error.message}`, 'error');
                    throw error;
                }
                
                console.log(`Successfully saved ${sectionName}`);
                this.logToDebug(`Successfully saved ${sectionName}`, 'success');
            }
            
            // Update the main website
            this.updateMainWebsite();
            
            // Refresh the main website content
            if (window.refreshWebsiteContent) {
                this.logToDebug('Refreshing main website content...', 'info');
                await window.refreshWebsiteContent();
                this.logToDebug('Main website content refreshed', 'success');
            } else {
                this.logToDebug('Refresh function not available', 'warning');
            }
            
            this.showMessage('Changes saved successfully to database!', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showMessage('Error saving data to database: ' + error.message, 'error');
        }
    }

    collectFormData() {
        console.log('Collecting form data...');
        
        try {
            // Hero section
            const heroGreeting = document.getElementById('hero-greeting');
            const heroName = document.getElementById('hero-name');
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroDescription = document.getElementById('hero-description');
            const heroImage = document.getElementById('hero-image');
            
            console.log('Hero fields found:', {
                greeting: heroGreeting,
                name: heroName,
                subtitle: heroSubtitle,
                description: heroDescription,
                image: heroImage
            });
            
            this.websiteData.hero = {
                greeting: heroGreeting ? heroGreeting.value : '',
                name: heroName ? heroName.value : '',
                subtitle: heroSubtitle ? heroSubtitle.value : '',
                description: heroDescription ? heroDescription.value : '',
                image: heroImage ? heroImage.value : '',
                typewriterTitles: document.getElementById('typewriter-titles') ? document.getElementById('typewriter-titles').value.split(',').map(t => t.trim()) : []
            };

            // About section
            const aboutTitle = document.getElementById('about-title');
            const aboutDescription = document.getElementById('about-description');
            const aboutText = document.getElementById('about-text');
            
            if (!aboutTitle || !aboutDescription || !aboutText) {
                throw new Error('About section fields not found');
            }
            
            this.websiteData.about = {
                title: aboutTitle.value,
                description: aboutDescription.value,
                text: aboutText.value
            };

            // Contact section
            const contactEmail = document.getElementById('contact-email');
            const contactLinkedin = document.getElementById('contact-linkedin');
            const contactLocation = document.getElementById('contact-location');
            
            if (!contactEmail || !contactLinkedin || !contactLocation) {
                throw new Error('Contact section fields not found');
            }
            
            this.websiteData.contact = {
                email: contactEmail.value,
                linkedin: contactLinkedin.value,
                location: contactLocation.value
            };

            // Settings
            const siteTitle = document.getElementById('site-title');
            const primaryColor = document.getElementById('primary-color');
            const secondaryColor = document.getElementById('secondary-color');
            const accentColor = document.getElementById('accent-color');
            
            if (!siteTitle || !primaryColor || !secondaryColor || !accentColor) {
                throw new Error('Settings fields not found');
            }
            
            this.websiteData.settings = {
                title: siteTitle.value,
                primaryColor: primaryColor.value,
                secondaryColor: secondaryColor.value,
                accentColor: accentColor.value,
                theme: this.websiteData.settings?.theme || 'modern'
            };

                    // Collect dynamic data
        this.collectExperienceData();
        this.collectSkillsData();
        this.collectTestimonialsData();
        this.collectLinkedInData();
        this.collectFormConfiguration();
            
        } catch (error) {
            console.error('Error in collectFormData:', error);
            throw error;
        }
    }

    collectExperienceData() {
        const experiences = [];
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            experiences.push({
                title: item.querySelector('.exp-title').value,
                company: item.querySelector('.exp-company').value,
                date: item.querySelector('.exp-date').value,
                description: item.querySelector('.exp-description').value
            });
        });
        this.websiteData.experience = experiences;
    }

    collectSkillsData() {
        const categories = {
            'admissions': 'Admissions & Immigration',
            'management': 'Management & Leadership', 
            'finance': 'Finance & Accounting',
            'languages': 'Languages & Communication'
        };
        
        this.websiteData.skills = {};
        
                    Object.entries(categories).forEach(([categoryId, categoryName]) => {
                const skills = [];
                document.querySelectorAll(`#skills-${categoryId} .skill-item`).forEach((item, index) => {
                    skills.push({
                        name: item.querySelector('.skill-name').value,
                        percentage: parseInt(item.querySelector('.skill-percentage').value),
                        color: item.querySelector('.skill-color').value
                    });
                });
                this.websiteData.skills[categoryName] = skills;
            });
    }

    collectTestimonialsData() {
        const testimonials = [];
        document.querySelectorAll('.testimonial-item').forEach((item, index) => {
            testimonials.push({
                name: item.querySelector('.testimonial-name').value,
                title: item.querySelector('.testimonial-title').value,
                quote: item.querySelector('.testimonial-quote').value,
                rating: parseInt(item.querySelector('.testimonial-rating').value) || 5,
                image: item.querySelector('.testimonial-image').value
            });
        });
        this.websiteData.testimonials = testimonials;
    }

    collectLinkedInData() {
        const linkedinPosts = [];
        document.querySelectorAll('.linkedin-post-item').forEach((item, index) => {
            linkedinPosts.push({
                url: item.querySelector('.linkedin-post-url').value,
                title: item.querySelector('.linkedin-post-title').value,
                description: item.querySelector('.linkedin-post-description').value,
                date: item.querySelector('.linkedin-post-date').value,
                image: item.querySelector('.linkedin-post-image').value
            });
        });
        this.websiteData.linkedin = linkedinPosts;
    }
    
    collectFormConfiguration() {
        const formType = document.getElementById('form-type')?.value || 'email';
        const formConfig = {
            type: formType,
            email: {
                recipient: document.getElementById('recipient-email')?.value || '',
                subject: document.getElementById('email-subject')?.value || ''
            },
            autoresponder: {
                code: document.getElementById('autoresponder-code')?.value || '',
                parsedData: this.parsedFormData || null
            },
            googleForm: {
                url: document.getElementById('google-form-url')?.value || '',
                height: document.getElementById('google-form-height')?.value || '600'
            },
            custom: {
                fields: this.collectCustomFields()
            }
        };
        this.websiteData.form_config = formConfig;
    }

    // Update Main Website
    updateMainWebsite() {
        // This would typically send data to a backend
        // For now, we'll use localStorage and the main page can read from it
        console.log('Website data updated:', this.websiteData);
    }

    // Preview Functions
    showPreview() {
        document.getElementById('preview-modal').classList.remove('hidden');
        this.updatePreviewIframe();
    }

    closePreview() {
        document.getElementById('preview-modal').classList.add('hidden');
    }

    // Navigation Setup
    setupNavigation() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                this.switchSection(hash);
            }
        });

        // Set initial section
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.switchSection(hash);
        }
    }

    // Utility Functions
    // Form Configuration Functions
    bindFormConfiguration() {
        const formTypeSelect = document.getElementById('form-type');
        if (formTypeSelect) {
            formTypeSelect.addEventListener('change', (e) => this.showFormConfig(e.target.value));
        }
        
        const parseAutoresponderBtn = document.getElementById('parse-autoresponder');
        if (parseAutoresponderBtn) {
            parseAutoresponderBtn.addEventListener('click', () => this.parseAutoresponderCode());
        }
        
        const addCustomFieldBtn = document.getElementById('add-custom-field');
        if (addCustomFieldBtn) {
            addCustomFieldBtn.addEventListener('click', () => this.addCustomField());
        }
        
        const saveFormConfigBtn = document.getElementById('save-form-config');
        if (saveFormConfigBtn) {
            saveFormConfigBtn.addEventListener('click', () => this.saveFormConfiguration());
        }
        
        // Load existing form configuration
        this.loadFormConfiguration();
    }
    
    showFormConfig(formType) {
        // Hide all config sections
        document.querySelectorAll('.form-config-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected config section
        const configSection = document.getElementById(`${formType}-config`);
        if (configSection) {
            configSection.style.display = 'block';
        }
    }
    
    parseAutoresponderCode() {
        const codeTextarea = document.getElementById('autoresponder-code');
        const code = codeTextarea.value;
        
        if (!code) {
            this.showMessage('Please paste autoresponder code first', 'error');
            return;
        }
        
        try {
            // Parse the code and extract form elements
            const parser = new DOMParser();
            const doc = parser.parseFromString(code, 'text/html');
            
            // Extract form action, method, and fields
            const form = doc.querySelector('form');
            if (!form) {
                this.showMessage('No form found in the code', 'error');
                return;
            }
            
            const formData = {
                action: form.getAttribute('action') || '',
                method: form.getAttribute('method') || 'POST',
                fields: []
            };
            
            // Extract input fields
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.type !== 'hidden' && input.name) {
                    formData.fields.push({
                        name: input.name,
                        type: input.type || 'text',
                        label: this.extractLabel(input),
                        required: input.hasAttribute('required'),
                        placeholder: input.placeholder || ''
                    });
                }
            });
            
            // Store parsed data
            this.parsedFormData = formData;
            
            this.showMessage('Autoresponder code parsed successfully!', 'success');
            console.log('Parsed form data:', formData);
            
        } catch (error) {
            this.showMessage('Error parsing autoresponder code: ' + error.message, 'error');
        }
    }
    
    extractLabel(input) {
        // Try to find associated label
        const id = input.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return label.textContent.trim();
        }
        
        // Try to find label as parent or sibling
        const parentLabel = input.closest('label');
        if (parentLabel) return parentLabel.textContent.trim();
        
        // Use name as fallback
        return input.name || 'Field';
    }
    
    addCustomField() {
        const fieldsList = document.getElementById('custom-fields-list');
        const fieldIndex = fieldsList.children.length;
        
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'custom-field-item';
        fieldDiv.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Field Name</label>
                    <input type="text" class="field-name" placeholder="firstName" value="">
                </div>
                <div class="form-group">
                    <label>Field Type</label>
                    <select class="field-type">
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" class="field-label" placeholder="First Name" value="">
                </div>
                <div class="form-group">
                    <label>Required</label>
                    <input type="checkbox" class="field-required" checked>
                </div>
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        fieldsList.appendChild(fieldDiv);
    }
    
    async saveFormConfiguration() {
        const formType = document.getElementById('form-type').value;
        const formConfig = {
            type: formType,
            email: {
                recipient: document.getElementById('recipient-email').value,
                subject: document.getElementById('email-subject').value
            },
            autoresponder: {
                code: document.getElementById('autoresponder-code').value,
                parsedData: this.parsedFormData || null
            },
            googleForm: {
                url: document.getElementById('google-form-url').value,
                height: document.getElementById('google-form-height').value
            },
            custom: {
                fields: this.collectCustomFields()
            }
        };
        
        try {
            // Save to Supabase
            const { error } = await this.supabase
                .from('website_content')
                .upsert({
                    section_name: 'form_config',
                    content: formConfig
                }, {
                    onConflict: 'section_name'
                });
            
            if (error) throw error;
            
            this.showMessage('Form configuration saved successfully!', 'success');
            
        } catch (error) {
            this.showMessage('Error saving form configuration: ' + error.message, 'error');
        }
    }
    
    collectCustomFields() {
        const fields = [];
        document.querySelectorAll('.custom-field-item').forEach(item => {
            fields.push({
                name: item.querySelector('.field-name').value,
                type: item.querySelector('.field-type').value,
                label: item.querySelector('.field-label').value,
                required: item.querySelector('.field-required').checked
            });
        });
        return fields;
    }
    
    loadFormConfiguration() {
        // Load existing form configuration from database
        if (this.websiteData.form_config) {
            const config = this.websiteData.form_config;
            
            document.getElementById('form-type').value = config.type || 'email';
            this.showFormConfig(config.type || 'email');
            
            if (config.email) {
                document.getElementById('recipient-email').value = config.email.recipient || '';
                document.getElementById('email-subject').value = config.email.subject || '';
            }
            
            if (config.autoresponder) {
                document.getElementById('autoresponder-code').value = config.autoresponder.code || '';
            }
            
            if (config.googleForm) {
                document.getElementById('google-form-url').value = config.googleForm.url || '';
                document.getElementById('google-form-height').value = config.googleForm.height || '600';
            }
            
            if (config.custom && config.custom.fields) {
                this.populateCustomFields(config.custom.fields);
            }
        }
    }
    
    populateCustomFields(fields) {
        const fieldsList = document.getElementById('custom-fields-list');
        fieldsList.innerHTML = '';
        
        fields.forEach(field => {
            this.addCustomField();
            const lastField = fieldsList.lastElementChild;
            lastField.querySelector('.field-name').value = field.name;
            lastField.querySelector('.field-type').value = field.type;
            lastField.querySelector('.field-label').value = field.label;
            lastField.querySelector('.field-required').checked = field.required;
        });
    }

    showMessage(message, type = 'success') {
        const container = document.getElementById('message-container');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        container.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Initialize Admin Panel
console.log('About to create AdminPanel instance...');
const adminPanel = new AdminPanel();
console.log('AdminPanel instance created:', adminPanel);

// Handle iframe messages
window.addEventListener('message', (event) => {
    if (event.data.type === 'REQUEST_WEBSITE_DATA') {
        event.source.postMessage({
            type: 'WEBSITE_DATA',
            data: adminPanel.websiteData
        }, '*');
    }
});

// Test debug console immediately
setTimeout(() => {
    if (adminPanel && typeof adminPanel.logToDebug === 'function') {
        adminPanel.logToDebug('Debug console test - this should appear!', 'success');
    } else {
        console.error('AdminPanel or logToDebug not available');
    }
}, 1000); 