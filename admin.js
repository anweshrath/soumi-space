// Admin Panel JavaScript
console.log('Admin.js loaded!');

// Simple test to see if this code executes
try {
    console.log('Admin.js execution test - this should appear');
} catch (error) {
    console.error('Error in admin.js:', error);
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    console.error('Error details:', event.message, 'at', event.filename, 'line', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Advanced Editor Class
class AdvancedEditor {
    constructor(textareaId, options = {}) {
        this.textareaId = textareaId;
        this.textarea = document.getElementById(textareaId);
        this.options = {
            enableRichText: true,
            enableHtml: true,
            enableGoogleFonts: true,
            defaultMode: 'text', // 'text', 'rich', 'html'
            ...options
        };
        
        this.currentMode = this.options.defaultMode;
        this.originalValue = this.textarea.value;
        this.editorContainer = null;
        this.richEditor = null;
        this.htmlEditor = null;
        
        this.googleFonts = [
            { name: 'Inter', value: 'Inter', category: 'sans-serif' },
            { name: 'Roboto', value: 'Roboto', category: 'sans-serif' },
            { name: 'Open Sans', value: 'Open Sans', category: 'sans-serif' },
            { name: 'Lato', value: 'Lato', category: 'sans-serif' },
            { name: 'Poppins', value: 'Poppins', category: 'sans-serif' },
            { name: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
            { name: 'Georgia', value: 'Georgia', category: 'serif' },
            { name: 'Times New Roman', value: 'Times New Roman', category: 'serif' },
            { name: 'Merriweather', value: 'Merriweather', category: 'serif' },
            { name: 'Source Code Pro', value: 'Source Code Pro', category: 'monospace' },
            { name: 'Courier New', value: 'Courier New', category: 'monospace' }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.textarea) {
            console.error(`Textarea with id '${this.textareaId}' not found`);
            return;
        }
        
        this.createEditorContainer();
        this.loadGoogleFonts();
        this.setupEventListeners();
        this.switchMode(this.currentMode);
    }
    
    createEditorContainer() {
        // Hide original textarea
        this.textarea.style.display = 'none';
        
        // Create container
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = 'advanced-editor-wrapper';
        this.editorContainer.setAttribute('data-textarea-id', this.textareaId);
        
        // Create toggle buttons
        this.createToggleButtons();
        
        // Create editors
        this.createRichTextEditor();
        this.createHtmlEditor();
        
        // Insert after textarea
        this.textarea.parentNode.insertBefore(this.editorContainer, this.textarea.nextSibling);
    }
    
    createToggleButtons() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'editor-toggle-container';
        
        if (this.options.enableRichText) {
            const richBtn = document.createElement('button');
            richBtn.className = 'editor-toggle-btn';
            richBtn.innerHTML = '<i class="fas fa-bold"></i> Rich Text';
            richBtn.setAttribute('data-mode', 'rich');
            toggleContainer.appendChild(richBtn);
        }
        
        if (this.options.enableHtml) {
            const htmlBtn = document.createElement('button');
            htmlBtn.className = 'editor-toggle-btn';
            htmlBtn.innerHTML = '<i class="fas fa-code"></i> HTML';
            htmlBtn.setAttribute('data-mode', 'html');
            toggleContainer.appendChild(htmlBtn);
        }
        
        const textBtn = document.createElement('button');
        textBtn.className = 'editor-toggle-btn';
        textBtn.innerHTML = '<i class="fas fa-font"></i> Plain Text';
        textBtn.setAttribute('data-mode', 'text');
        toggleContainer.appendChild(textBtn);
        
        this.editorContainer.appendChild(toggleContainer);
    }
    
    createRichTextEditor() {
        const container = document.createElement('div');
        container.className = 'advanced-editor-container';
        container.style.display = 'none';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'advanced-editor-toolbar';
        toolbar.innerHTML = this.getRichTextToolbar();
        container.appendChild(toolbar);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'advanced-editor-content';
        content.contentEditable = true;
        content.innerHTML = this.textarea.value;
        container.appendChild(content);
        
        this.richEditor = container;
        this.editorContainer.appendChild(container);
        
        // Setup toolbar events
        this.setupRichTextToolbar(toolbar, content);
    }
    
    createHtmlEditor() {
        const container = document.createElement('div');
        container.className = 'html-editor-container';
        container.style.display = 'none';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'html-editor-toolbar';
        toolbar.innerHTML = `
            <span>HTML Editor</span>
            <button class="html-editor-btn" data-action="format">Format HTML</button>
        `;
        container.appendChild(toolbar);
        
        // Create content area
        const content = document.createElement('textarea');
        content.className = 'advanced-editor-content html-editor-content';
        content.value = this.textarea.value;
        container.appendChild(content);
        
        this.htmlEditor = container;
        this.editorContainer.appendChild(container);
        
        // Setup HTML editor events
        this.setupHtmlEditorEvents(toolbar, content);
    }
    
    getRichTextToolbar() {
        return `
            <div class="toolbar-group">
                <button class="toolbar-btn" data-command="bold" title="Bold"><i class="fas fa-bold"></i></button>
                <button class="toolbar-btn" data-command="italic" title="Italic"><i class="fas fa-italic"></i></button>
                <button class="toolbar-btn" data-command="underline" title="Underline"><i class="fas fa-underline"></i></button>
            </div>
            <div class="toolbar-group">
                <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
                <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
            </div>
            <div class="toolbar-group">
                <button class="toolbar-btn" data-command="createLink" title="Insert Link"><i class="fas fa-link"></i></button>
                <button class="toolbar-btn" data-command="unlink" title="Remove Link"><i class="fas fa-unlink"></i></button>
            </div>
            <div class="toolbar-group">
                <select class="font-selector" data-command="fontName">
                    ${this.googleFonts.map(font => 
                        `<option value="${font.value}" style="font-family: '${font.value}', ${font.category}">${font.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="toolbar-group">
                <input type="color" class="color-picker" data-command="foreColor" title="Text Color">
            </div>
        `;
    }
    
    setupRichTextToolbar(toolbar, content) {
        // Formatting buttons
        toolbar.querySelectorAll('[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                
                if (command === 'createLink') {
                    const url = prompt('Enter URL:');
                    if (url) {
                        document.execCommand('createLink', false, url);
                    }
                } else if (command === 'fontName') {
                    const font = btn.value;
                    document.execCommand('fontName', false, font);
                } else if (command === 'foreColor') {
                    const color = btn.value;
                    document.execCommand('foreColor', false, color);
                } else {
                    document.execCommand(command, false, null);
                }
                
                content.focus();
            });
        });
        
        // Update toolbar state
        content.addEventListener('keyup', () => this.updateToolbarState(toolbar));
        content.addEventListener('mouseup', () => this.updateToolbarState(toolbar));
    }
    
    setupHtmlEditorEvents(toolbar, content) {
        toolbar.querySelector('[data-action="format"]').addEventListener('click', () => {
            try {
                content.value = this.formatHtml(content.value);
            } catch (error) {
                console.error('HTML formatting error:', error);
            }
        });
        
        content.addEventListener('input', () => {
            this.syncWithTextarea();
        });
    }
    
    setupEventListeners() {
        // Toggle button events
        this.editorContainer.querySelectorAll('.editor-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = btn.getAttribute('data-mode');
                this.switchMode(mode);
            });
        });
    }
    
    switchMode(mode) {
        // Hide all editors
        if (this.richEditor) this.richEditor.style.display = 'none';
        if (this.htmlEditor) this.htmlEditor.style.display = 'none';
        this.textarea.style.display = 'none';
        
        // Update toggle buttons
        this.editorContainer.querySelectorAll('.editor-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            }
        });
        
        // Show selected editor
        switch (mode) {
            case 'rich':
                if (this.richEditor) {
                    this.richEditor.style.display = 'block';
                    this.richEditor.querySelector('.advanced-editor-content').focus();
                }
                break;
            case 'html':
                if (this.htmlEditor) {
                    this.htmlEditor.style.display = 'block';
                    this.htmlEditor.querySelector('.html-editor-content').focus();
                }
                break;
            case 'text':
            default:
                this.textarea.style.display = 'block';
                this.textarea.focus();
                break;
        }
        
        this.currentMode = mode;
        this.syncContent();
    }
    
    syncContent() {
        const currentValue = this.getValue();
        
        // Update all editors with current value
        if (this.richEditor) {
            this.richEditor.querySelector('.advanced-editor-content').innerHTML = currentValue;
        }
        if (this.htmlEditor) {
            this.htmlEditor.querySelector('.html-editor-content').value = currentValue;
        }
        this.textarea.value = currentValue;
    }
    
    getValue() {
        switch (this.currentMode) {
            case 'rich':
                return this.richEditor ? this.richEditor.querySelector('.advanced-editor-content').innerHTML : '';
            case 'html':
                return this.htmlEditor ? this.htmlEditor.querySelector('.html-editor-content').value : '';
            case 'text':
            default:
                return this.textarea.value;
        }
    }
    
    setValue(value) {
        this.originalValue = value;
        this.syncContent();
    }
    
    syncWithTextarea() {
        const value = this.getValue();
        this.textarea.value = value;
        
        // Trigger change event for the original textarea
        const event = new Event('input', { bubbles: true });
        this.textarea.dispatchEvent(event);
        
        // Also trigger a custom event for the admin panel
        const customEvent = new CustomEvent('advancedEditorChange', {
            detail: { textareaId: this.textareaId, value: value }
        });
        this.textarea.dispatchEvent(customEvent);
    }
    
    updateToolbarState(toolbar) {
        toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            const command = btn.getAttribute('data-command');
            if (command) {
                const isActive = document.queryCommandState(command);
                btn.classList.toggle('active', isActive);
            }
        });
    }
    
    formatHtml(html) {
        // Simple HTML formatting
        return html
            .replace(/></g, '>\n<')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }
    
    loadGoogleFonts() {
        if (!this.options.enableGoogleFonts) return;
        
        const fontFamilies = this.googleFonts.map(font => font.value).join('|');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
    }
    
    destroy() {
        if (this.editorContainer) {
            this.editorContainer.remove();
        }
        this.textarea.style.display = 'block';
    }
}
class AdminPanel {
    constructor() {
        console.log('AdminPanel constructor called');
        this.isAuthenticated = false;
        this.currentSection = 'hero';
        this.websiteData = {};
        this.supabase = null;
        this.init().catch(error => {
            console.error('Admin panel initialization failed:', error);
        });
    }

    async init() {
        this.logToDebug('Admin panel initializing...', 'info');
        
        // Bind login events immediately (don't wait for Supabase)
        this.bindLoginEvents();
        
        // Try to initialize Supabase but don't block if it fails
        try {
            if (this.initSupabase()) {
                await this.testSupabaseConnection();
                this.logToDebug('Supabase initialized successfully', 'success');
            } else {
                this.logToDebug('Supabase not available - admin panel will work with local data', 'warning');
            }
        } catch (error) {
            this.logToDebug(`Supabase initialization failed: ${error.message}`, 'warning');
        }
        
        this.checkAuth();
        
        this.logToDebug('Admin panel initialization complete', 'success');
    }

    initSupabase() {
        try {
            this.logToDebug('Initializing Supabase client...', 'info');
            
            // Wait for Supabase to be available
            if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
                this.logToDebug('Supabase library not loaded - will retry silently', 'info');
                // Try again in 2 seconds silently
                setTimeout(() => this.initSupabase(), 2000);
                return false;
            }
            
            this.supabase = window.supabase.createClient(
                'https://wwpjacyzmteiexchtnfj.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q'
            );
            
            this.logToDebug('Supabase client initialized successfully', 'success');
            return true;
        } catch (error) {
            this.logToDebug(`Supabase initialization error: ${error.message}`, 'warning');
            return false;
        }
    }

    // Authentication
    checkAuth() {
        // Always show login screen - no auto-login
        this.showLoginScreen();
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-panel').classList.add('hidden');
    }

    showAdminPanel() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        console.log('Admin panel shown');
        
        // Bind events after admin panel is shown
        try {
            this.bindEvents();
            this.bindFormInputs();
            this.initializeAdvancedEditors();
            this.initializeHighlights();
            this.initializeStatistics();
            this.initializeFloatingSaveButton();
            this.initializeDeployModal();
            this.loadData();
            this.setupNavigation();
            
                        // Ensure first section is active and scroll to top
            setTimeout(() => {
                const firstNavItem = document.querySelector('.nav-item');
                if (firstNavItem) {
                    const firstSection = firstNavItem.getAttribute('data-section');
                    if (firstSection) {
                        this.switchSection(firstSection);
                    }
                }
                
                // Scroll admin panel to top
                const adminPanel = document.querySelector('.admin-panel');
                if (adminPanel) {
                    adminPanel.scrollTop = 0;
                }
            }, 100);
        } catch (error) {
            console.log('Admin panel initialization error:', error);
        }
        
        // Check if save button exists after showing panel
        setTimeout(() => {
            const saveBtn = document.getElementById('save-btn');
            console.log('Save button after showing panel:', saveBtn);
        }, 500);
    }

    // Login Event Bindings
    bindLoginEvents() {
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
    }

    // Admin Panel Event Bindings
    bindEvents() {
        // Admin panel events only (login events are bound separately)
        
        // Preview iframe load event
        const previewIframe = document.getElementById('preview-iframe');
        if (previewIframe) {
            previewIframe.addEventListener('load', () => {
                console.log('Preview iframe loaded');
                // Update iframe with current data after load
                setTimeout(() => {
                    this.updatePreviewIframe();
                }, 100);
            });
        }
        
        // Theme preview iframe load event
        const themePreviewIframe = document.getElementById('theme-preview-iframe');
        if (themePreviewIframe) {
            themePreviewIframe.addEventListener('load', () => {
                console.log('Theme preview iframe loaded');
            });
        }

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found nav items:', navItems.length);
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Global anchor prevention
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item') && e.target.href && e.target.href.includes('#')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
        
        // Retry navigation binding after a delay
        setTimeout(() => {
            const retryNavItems = document.querySelectorAll('.nav-item');
            retryNavItems.forEach(item => {
                if (!item.hasAttribute('data-bound')) {
                    console.log('Binding nav item:', item.textContent);
                    item.setAttribute('data-bound', 'true');
                    item.addEventListener('click', (e) => this.handleNavigation(e));
                }
            });
        }, 2000);

        // Buttons
        const saveBtn = document.getElementById('save-btn');
        console.log('Looking for save button...', saveBtn);
        if (saveBtn) {
            console.log('Save button found, adding event listener');
            saveBtn.addEventListener('click', () => {
                console.log('Save button clicked!');
                this.saveAllChanges();
            });
        } else {
            console.error('Save button not found!');
        }
        
        // Retry save button binding after a delay
        setTimeout(() => {
            const retrySaveBtn = document.getElementById('save-btn');
            if (retrySaveBtn && !retrySaveBtn.hasAttribute('data-bound')) {
                console.log('Save button found on retry, adding event listener');
                retrySaveBtn.setAttribute('data-bound', 'true');
                retrySaveBtn.addEventListener('click', () => {
                    console.log('Save button clicked!');
                    this.saveAllChanges();
                });
            }
        }, 2000);

        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Just call the working theme preview function
                this.showThemePreview();
            });
        }

        // New preview theme buttons
        const previewCurrentThemeBtn = document.getElementById('preview-current-theme');
        if (previewCurrentThemeBtn) {
            previewCurrentThemeBtn.addEventListener('click', () => this.showCurrentThemePreview());
        }

        const previewThemeLightboxBtn = document.getElementById('preview-theme-lightbox');
        if (previewThemeLightboxBtn) {
            previewThemeLightboxBtn.addEventListener('click', () => this.showThemePreviewLightbox());
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

        // Modal close buttons
        const previewModalClose = document.querySelector('#preview-modal .modal-close');
        console.log('Looking for preview modal close button:', previewModalClose);
        if (previewModalClose) {
            console.log('Preview modal close button found, adding event listener');
            previewModalClose.addEventListener('click', () => this.closePreview());
        } else {
            console.error('Preview modal close button not found!');
        }
        
        // Screen size toggle buttons
        const screenSizeBtns = document.querySelectorAll('.screen-size-btn');
        screenSizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.closest('.screen-size-btn').dataset.size;
                this.toggleScreenSize(size);
            });
        });
        
        const scriptModalClose = document.querySelector('#script-modal .modal-close');
        if (scriptModalClose) {
            scriptModalClose.addEventListener('click', () => this.closeScriptModal());
        }
        
        // Also handle escape key for preview modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const previewModal = document.getElementById('preview-modal');
                if (previewModal && !previewModal.classList.contains('hidden')) {
                    this.closePreview();
                }
            }
        });
        
        // Close preview modal on outside click
        const previewModal = document.getElementById('preview-modal');
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    this.closePreview();
                }
            });
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
        
        // Color preview handlers
        this.bindColorPreviewHandlers();
        
        // Theme preview handlers
        this.bindThemePreviewHandlers();
        
        // Global font set handlers
        this.bindGlobalFontSetHandlers();
        
        // Navigation color handlers
        this.bindNavigationColorHandlers();
    }

    // Debug logging functions
    logToDebug(message, type = 'info') {
        // Only log to console, don't create DOM elements or show notifications
        console.log(`[${type.toUpperCase()}] ${message}`);
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
        console.log('🔍 LOGIN DEBUG:', { username, password });



        // Check if Supabase is available
        console.log('🔍 SUPABASE CHECK:', { supabase: !!this.supabase });
        if (!this.supabase) {
            this.logToDebug('Supabase client not available, trying to initialize...', 'error');
            console.log('🔍 INITIALIZING SUPABASE...');
            if (!this.initSupabase()) {
                this.logToDebug('Failed to initialize Supabase', 'error');
                console.log('🔍 SUPABASE INIT FAILED');
                this.showMessage('Database connection not available. Please refresh the page.', 'error');
                return;
            }
        }
        console.log('🔍 SUPABASE READY');

        try {
            this.logToDebug('Connecting to Supabase...', 'info');
            
            // Get admin user from Supabase
            console.log('🔍 QUERYING SUPABASE for username:', username);
            const { data, error } = await this.supabase
                .from('admin_users')
                .select('*')
                .eq('username', username)
                .single();

            console.log('🔍 SUPABASE RESPONSE:', { data, error });
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
        const navItem = e.target.closest('.nav-item');
        if (!navItem) return;
        
        // Check if it's an external link (like page.html)
        const href = navItem.getAttribute('href');
        if (href && !href.includes('javascript:void(0)') && !href.includes('#')) {
            // Allow external links to work normally
            return true;
        }
        
        // Handle internal navigation
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Prevent any default anchor behavior
        if (e.target.href && e.target.href.includes('#')) {
            e.preventDefault();
            return false;
        }
        
        if (navItem) {
            const section = navItem.getAttribute('data-section');
            if (section) {
                this.switchSection(section);
            }
        }
        
        return false;
    }

    switchSection(section) {
        // Completely prevent any scroll behavior
        event && event.preventDefault();
        
        // FORCE SCROLL TO TOP BEFORE SHOWING SECTION
        const editorMain = document.querySelector('.editor-main');
        if (editorMain) {
            editorMain.scrollTop = 0;
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
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
        
        // IMMEDIATELY force all scroll positions to top
        const adminPanel = document.querySelector('.admin-panel');
        const activeSection = document.getElementById(`${section}-editor`);
        
        // Force all containers to top
        if (adminPanel) adminPanel.scrollTop = 0;
        if (editorMain) editorMain.scrollTop = 0;
        if (activeSection) activeSection.scrollTop = 0;
        
        // Force window and document to top
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Force all parent containers to top
        let parent = activeSection;
        while (parent && parent.parentElement) {
            parent.parentElement.scrollTop = 0;
            parent = parent.parentElement;
        }
        
        // Double-check after a brief delay
        setTimeout(() => {
            if (adminPanel) adminPanel.scrollTop = 0;
            if (editorMain) editorMain.scrollTop = 0;
            if (activeSection) activeSection.scrollTop = 0;
            window.scrollTo(0, 0);
            
            // Force content to be at top
            if (activeSection) {
                activeSection.style.position = 'relative';
                activeSection.style.top = '0';
                activeSection.style.transform = 'none';
                activeSection.style.marginTop = '0';
                activeSection.style.paddingTop = '0';
            }
        }, 50);
        
        // Prevent any scroll events for the next 100ms
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        
        document.addEventListener('scroll', preventScroll, { passive: false, capture: true });
        setTimeout(() => {
            document.removeEventListener('scroll', preventScroll, { passive: false, capture: true });
        }, 100);
        
        // Initialize section-specific functionality
        if (section === 'hero') {
            this.initializeAdvancedEditors();
            this.initializeButtonEditors();
            this.initializeNavigationLinks();
        } else if (section === 'navigation') {
            this.initializeNavigationAdmin();
        } else if (section === 'legal') {
            this.initializeLegalCompliance();
        } else if (section === 'footer') {
            console.log('Switching to footer section, initializing...');
            setTimeout(() => {
                this.initializeFooter();
            }, 100);
        } else if (section === 'contact') {
            console.log('Switching to contact section, initializing...');
            setTimeout(() => {
                this.initializeContactForm();
            }, 100);
        } else if (section === 'resume') {
            console.log('Switching to resume section, initializing...');
            setTimeout(() => {
                console.log('Calling initializeResumeGenerator...');
                this.initializeResumeGenerator();
            }, 100);
        }
    }

    // Form Input Binding
    bindFormInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updatePreview(e.target);
            });
        });
        
        // Listen for advanced editor changes
        document.addEventListener('advancedEditorChange', (e) => {
            this.updatePreview(e.detail.textareaId);
        });
        
        // Initialize advanced editors for textareas
        this.initializeAdvancedEditors();
    }
    
    initializeAdvancedEditors() {
        // Prevent duplicate initialization
        if (this.advancedEditors && Object.keys(this.advancedEditors).length > 0) {
            console.log('Advanced editors already initialized, skipping...');
            return;
        }
        
        // List of textarea IDs that should have advanced editors
        const advancedEditorTextareas = [
            'hero-description',
            'about-description', 
            'about-text',
            'typewriter-titles',
            'autoresponder-code'
        ];
        
        // Initialize advanced editors
        this.advancedEditors = {};
        advancedEditorTextareas.forEach(textareaId => {
            const textarea = document.getElementById(textareaId);
            if (textarea) {
                try {
                    this.advancedEditors[textareaId] = new AdvancedEditor(textareaId, {
                        enableRichText: true,
                        enableHtml: true,
                        enableGoogleFonts: true,
                        defaultMode: 'text'
                    });
                    
                    // Add event listener for content changes
                    textarea.addEventListener('input', (e) => {
                        this.updatePreview(e.target);
                    });
                } catch (error) {
                    console.error(`Failed to initialize advanced editor for ${textareaId}:`, error);
                }
            }
        });
        
        // Initialize button editors
        this.initializeButtonEditors();
        this.initializeNavigationAdmin();
        this.initializeScriptManager();
        this.initializeDarkMode();
    }
    
    initializeButtonEditors() {
        // Bind button editor events
        const buttonInputs = [
            'hero-btn-primary-text', 'hero-btn-primary-link', 'hero-btn-primary-link-type',
            'hero-btn-primary-bg-start', 'hero-btn-primary-bg-end', 'hero-btn-primary-text-color',
            'hero-btn-primary-border', 'hero-btn-primary-border-width', 'hero-btn-primary-radius',
            'hero-btn-primary-padding', 'hero-btn-primary-font-size', 'hero-btn-primary-new-tab',
            'hero-btn-secondary-text', 'hero-btn-secondary-link', 'hero-btn-secondary-link-type',
            'hero-btn-secondary-bg', 'hero-btn-secondary-text-color', 'hero-btn-secondary-border',
            'hero-btn-secondary-border-width', 'hero-btn-secondary-radius', 'hero-btn-secondary-padding',
            'hero-btn-secondary-font-size', 'hero-btn-secondary-new-tab'
        ];
        
        buttonInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.updatePreview());
                input.addEventListener('change', () => this.updatePreview());
            }
        });
    }
    

    
    initializeNavigationLinks() {
        // Add navigation link button
        const addNavLinkBtn = document.getElementById('add-nav-link');
        if (addNavLinkBtn) {
            addNavLinkBtn.addEventListener('click', () => this.addNavigationLink());
        }
        
        // Load existing navigation links
        this.loadNavigationLinks();
    }
    
    addNavigationLink() {
        const navLinksList = document.getElementById('nav-links-list');
        if (!navLinksList) return;
        
        const linkIndex = navLinksList.children.length;
        const linkItem = document.createElement('div');
        linkItem.className = 'nav-link-item';
        linkItem.innerHTML = `
            <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLink(${linkIndex})">
                <i class="fas fa-trash"></i>
            </button>
            <h5>Navigation Link ${linkIndex + 1}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Text</label>
                    <input type="text" class="nav-link-text" value="New Link" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Link Type</label>
                    <select class="nav-link-type" data-index="${linkIndex}">
                        <option value="anchor">Page Anchor</option>
                        <option value="external">External URL</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Target</label>
                    <input type="text" class="nav-link-target" value="#section" placeholder="#section or https://example.com" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Open in New Tab</label>
                    <input type="checkbox" class="nav-link-new-tab" data-index="${linkIndex}">
                </div>
            </div>
        `;
        
        navLinksList.appendChild(linkItem);
        
        // Add event listeners
        linkItem.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.updatePreview());
        });
    }
    
    removeNavigationLink(index) {
        const navLinksList = document.getElementById('nav-links-list');
        if (navLinksList && navLinksList.children[index]) {
            navLinksList.children[index].remove();
            this.updatePreview();
        }
    }
    
    loadNavigationLinks() {
        // Default navigation links
        const defaultLinks = [
            { text: 'Home', target: '#home', type: 'anchor', newTab: false },
            { text: 'About', target: '#about', type: 'anchor', newTab: false },
            { text: 'Experience', target: '#experience', type: 'anchor', newTab: false },
            { text: 'Skills', target: '#skills', type: 'anchor', newTab: false },
            { text: 'LinkedIn', target: '#linkedin', type: 'anchor', newTab: false },
            { text: 'Testimonials', target: '#testimonials', type: 'anchor', newTab: false },
            { text: 'Contact', target: '#contact', type: 'anchor', newTab: false }
        ];
        
        const navLinksList = document.getElementById('nav-links-list');
        if (!navLinksList) return;
        
        navLinksList.innerHTML = '';
        defaultLinks.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'nav-link-item';
            linkItem.innerHTML = `
                <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLink(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Navigation Link ${index + 1}</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Text</label>
                        <input type="text" class="nav-link-text" value="${link.text}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Link Type</label>
                        <select class="nav-link-type" data-index="${index}">
                            <option value="anchor" ${link.type === 'anchor' ? 'selected' : ''}>Page Anchor</option>
                            <option value="external" ${link.type === 'external' ? 'selected' : ''}>External URL</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Target</label>
                        <input type="text" class="nav-link-target" value="${link.target}" placeholder="#section or https://example.com" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Open in New Tab</label>
                        <input type="checkbox" class="nav-link-new-tab" data-index="${index}" ${link.newTab ? 'checked' : ''}>
                    </div>
                </div>
            `;
            
            navLinksList.appendChild(linkItem);
            
            // Add event listeners
            linkItem.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', () => this.updatePreview());
                input.addEventListener('change', () => this.updatePreview());
            });
        });
    }
    
    initializeNavigationAdmin() {
        // Only handle navigation links for theme users
        // Color and styling customization is disabled for preset themes
        
        // Initialize navigation links admin
        this.initializeNavigationLinksAdmin();
        
        // Show theme notice
        this.showThemeNotice();
        
        console.log('✅ Navigation admin initialized (theme mode)');
    }
    
    showThemeNotice() {
        const themeNotice = document.getElementById('theme-notice');
        if (themeNotice) {
            themeNotice.style.display = 'block';
        }
    }
    
    initializeLogoHandlers() {
        // Show/hide logo config based on show logo checkbox
        const showLogoCheckbox = document.getElementById('nav-show-logo');
        const logoConfig = document.getElementById('logo-config');
        
        if (showLogoCheckbox && logoConfig) {
            showLogoCheckbox.addEventListener('change', (e) => {
                logoConfig.style.display = e.target.checked ? 'block' : 'none';
                this.updatePreview();
            });
            
            // Set initial state
            logoConfig.style.display = showLogoCheckbox.checked ? 'block' : 'none';
        }
        
        // Logo type selection
        const logoType = document.getElementById('logo-type');
        const singleLogoSection = document.getElementById('single-logo-section');
        const dualLogoSection = document.getElementById('dual-logo-section');
        
        if (logoType && singleLogoSection && dualLogoSection) {
            logoType.addEventListener('change', (e) => {
                if (e.target.value === 'single') {
                    singleLogoSection.style.display = 'block';
                    dualLogoSection.style.display = 'none';
                } else {
                    singleLogoSection.style.display = 'none';
                    dualLogoSection.style.display = 'block';
                }
            });
        }
        
        // Logo upload handlers
        this.bindLogoUploadHandlers();
        
        // Logo size handler
        const logoSize = document.getElementById('logo-size');
        const logoSizeValue = document.getElementById('logo-size-value');
        
        if (logoSize && logoSizeValue) {
            logoSize.addEventListener('input', (e) => {
                logoSizeValue.textContent = e.target.value + 'px';
                this.updatePreview();
            });
        }
    }
    
    bindLogoUploadHandlers() {
        // Single logo upload
        const logoUpload = document.getElementById('logo-upload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => {
                this.handleLogoUpload(e, 'single');
            });
        }
        
        // Dark logo upload
        const logoDarkUpload = document.getElementById('logo-dark-upload');
        if (logoDarkUpload) {
            logoDarkUpload.addEventListener('change', (e) => {
                this.handleLogoUpload(e, 'dark');
            });
        }
        
        // Light logo upload
        const logoLightUpload = document.getElementById('logo-light-upload');
        if (logoLightUpload) {
            logoLightUpload.addEventListener('change', (e) => {
                this.handleLogoUpload(e, 'light');
            });
        }
    }
    
    handleLogoUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            
            if (type === 'single') {
                this.updateLogoPreview('logo-preview', 'logo-preview-img', logoData);
                if (!this.websiteData.navigation) this.websiteData.navigation = {};
                this.websiteData.navigation.logo = logoData;
            } else if (type === 'dark') {
                this.updateLogoPreview('logo-dark-preview', 'logo-dark-preview-img', logoData);
                if (!this.websiteData.navigation) this.websiteData.navigation = {};
                this.websiteData.navigation.logoDark = logoData;
            } else if (type === 'light') {
                this.updateLogoPreview('logo-light-preview', 'logo-light-preview-img', logoData);
                if (!this.websiteData.navigation) this.websiteData.navigation = {};
                this.websiteData.navigation.logoLight = logoData;
            }
            
            this.updatePreview();
        };
        reader.readAsDataURL(file);
    }
    
    updateLogoPreview(containerId, imgId, logoData) {
        const container = document.getElementById(containerId);
        const img = document.getElementById(imgId);
        
        if (container && img) {
            img.src = logoData;
            container.style.display = 'block';
        }
    }
    
    removeLogo(type = 'single') {
        if (type === 'single') {
            document.getElementById('logo-preview').style.display = 'none';
            document.getElementById('logo-upload').value = '';
            if (this.websiteData.navigation) {
                delete this.websiteData.navigation.logo;
            }
        } else if (type === 'dark') {
            document.getElementById('logo-dark-preview').style.display = 'none';
            document.getElementById('logo-dark-upload').value = '';
            if (this.websiteData.navigation) {
                delete this.websiteData.navigation.logoDark;
            }
        } else if (type === 'light') {
            document.getElementById('logo-light-preview').style.display = 'none';
            document.getElementById('logo-light-upload').value = '';
            if (this.websiteData.navigation) {
                delete this.websiteData.navigation.logoLight;
            }
        }
        
        this.updatePreview();
    }
    
    initializeLegalCompliance() {
        try {
            // Bind legal compliance events
            const generateLegalBtn = document.getElementById('generate-legal-pages');
            if (generateLegalBtn) {
                generateLegalBtn.addEventListener('click', () => {
                    this.generateLegalPages();
                });
            }
            
            // Load existing legal data
            this.loadLegalData();
        } catch (error) {
            console.log('Legal compliance initialization failed:', error);
        }
    }
    
    initializeFooter() {
        try {
            console.log('Initializing footer...');
            // Initialize footer functionality
            this.initializeFooterLinks();
            this.initializeFooterLogo();
            this.bindFooterHandlers();
            
            // Load existing footer data
            this.loadFooterData();
            console.log('Footer initialized successfully');
        } catch (error) {
            console.log('Footer initialization failed:', error);
        }
    }
    
    loadLegalData() {
        try {
            if (!this.websiteData.legal) return;
            
            const legal = this.websiteData.legal;
        
        // Populate company information
        document.getElementById('company-name').value = legal.companyName || '';
        document.getElementById('entity-type').value = legal.entityType || 'individual';
        document.getElementById('country-operation').value = legal.countryOperation || 'australia';
        document.getElementById('business-address').value = legal.businessAddress || '';
        document.getElementById('legal-email').value = legal.legalEmail || '';
        document.getElementById('legal-phone').value = legal.legalPhone || '';
        
        // Populate data collection settings
        document.getElementById('collect-name').checked = legal.collectName !== false;
        document.getElementById('collect-email').checked = legal.collectEmail !== false;
        document.getElementById('collect-phone').checked = legal.collectPhone || false;
        document.getElementById('collect-address').checked = legal.collectAddress || false;
        document.getElementById('collect-cookies').checked = legal.collectCookies !== false;
        document.getElementById('collect-usage').checked = legal.collectUsage || false;
        
        // Populate data usage purposes
        document.getElementById('purpose-contact').checked = legal.purposeContact !== false;
        document.getElementById('purpose-services').checked = legal.purposeServices !== false;
        document.getElementById('purpose-marketing').checked = legal.purposeMarketing || false;
        document.getElementById('purpose-analytics').checked = legal.purposeAnalytics !== false;
        document.getElementById('purpose-legal').checked = legal.purposeLegal || false;
        
        // Populate third party services
        document.getElementById('google-analytics').checked = legal.googleAnalytics || false;
        document.getElementById('facebook-pixel').checked = legal.facebookPixel || false;
        document.getElementById('hotjar').checked = legal.hotjar || false;
        document.getElementById('stripe').checked = legal.stripe || false;
        document.getElementById('paypal').checked = legal.paypal || false;
        document.getElementById('square').checked = legal.square || false;
        document.getElementById('mailchimp').checked = legal.mailchimp || false;
        document.getElementById('hubspot').checked = legal.hubspot || false;
        document.getElementById('zapier').checked = legal.zapier || false;
        
        // Populate legal pages to generate
        document.getElementById('generate-privacy').checked = legal.generatePrivacy !== false;
        document.getElementById('generate-terms').checked = legal.generateTerms !== false;
        document.getElementById('generate-disclaimer').checked = legal.generateDisclaimer !== false;
        document.getElementById('generate-cookies').checked = legal.generateCookies !== false;
        document.getElementById('generate-ccpa').checked = legal.generateCCPA || false;
        document.getElementById('generate-gdpr').checked = legal.generateGDPR || false;
        
        // Populate cookie consent settings
        document.getElementById('enable-cookie-consent').checked = legal.enableCookieConsent !== false;
        document.getElementById('cookie-message').value = legal.cookieMessage || 'We use cookies to enhance your experience, analyze site traffic, and personalize content. By continuing to use this site, you consent to our use of cookies.';
        document.getElementById('accept-button-text').value = legal.acceptButtonText || 'Accept All';
        document.getElementById('decline-button-text').value = legal.declineButtonText || 'Decline';
        
        // Populate data retention
        document.getElementById('data-retention').value = legal.dataRetention || 24;
        } catch (error) {
            console.log('Legal data loading failed:', error);
        }
    }
    
    generateLegalPages() {
        // Collect all legal data
        const legalData = this.collectLegalData();
        
        // Generate legal pages based on settings
        const generatedPages = [];
        
        if (legalData.generatePrivacy) {
            generatedPages.push({
                name: 'Privacy Policy',
                url: '/privacy-policy',
                status: 'generated',
                content: this.generatePrivacyPolicy(legalData)
            });
        }
        
        if (legalData.generateTerms) {
            generatedPages.push({
                name: 'Terms of Service',
                url: '/terms-of-service',
                status: 'generated',
                content: this.generateTermsOfService(legalData)
            });
        }
        
        if (legalData.generateDisclaimer) {
            generatedPages.push({
                name: 'Disclaimer',
                url: '/disclaimer',
                status: 'generated',
                content: this.generateDisclaimer(legalData)
            });
        }
        
        if (legalData.generateCookies) {
            generatedPages.push({
                name: 'Cookie Policy',
                url: '/cookie-policy',
                status: 'generated',
                content: this.generateCookiePolicy(legalData)
            });
        }
        
        if (legalData.generateCCPA) {
            generatedPages.push({
                name: 'CCPA Notice',
                url: '/ccpa-notice',
                status: 'generated',
                content: this.generateCCPANotice(legalData)
            });
        }
        
        if (legalData.generateGDPR) {
            generatedPages.push({
                name: 'GDPR Notice',
                url: '/gdpr-notice',
                status: 'generated',
                content: this.generateGDPRNotice(legalData)
            });
        }
        
        // Save legal data
        if (!this.websiteData.legal) this.websiteData.legal = {};
        this.websiteData.legal = { ...this.websiteData.legal, ...legalData, generatedPages };
        
        // Update preview
        this.updateLegalPagesPreview(generatedPages);
        
        // Show success message
        this.showMessage('Legal pages generated successfully!', 'success');
    }
    
    collectLegalData() {
        return {
            companyName: document.getElementById('company-name').value,
            entityType: document.getElementById('entity-type').value,
            countryOperation: document.getElementById('country-operation').value,
            businessAddress: document.getElementById('business-address').value,
            legalEmail: document.getElementById('legal-email').value,
            legalPhone: document.getElementById('legal-phone').value,
            
            // Data collection
            collectName: document.getElementById('collect-name').checked,
            collectEmail: document.getElementById('collect-email').checked,
            collectPhone: document.getElementById('collect-phone').checked,
            collectAddress: document.getElementById('collect-address').checked,
            collectCookies: document.getElementById('collect-cookies').checked,
            collectUsage: document.getElementById('collect-usage').checked,
            
            // Data usage purposes
            purposeContact: document.getElementById('purpose-contact').checked,
            purposeServices: document.getElementById('purpose-services').checked,
            purposeMarketing: document.getElementById('purpose-marketing').checked,
            purposeAnalytics: document.getElementById('purpose-analytics').checked,
            purposeLegal: document.getElementById('purpose-legal').checked,
            
            // Third party services
            googleAnalytics: document.getElementById('google-analytics').checked,
            facebookPixel: document.getElementById('facebook-pixel').checked,
            hotjar: document.getElementById('hotjar').checked,
            stripe: document.getElementById('stripe').checked,
            paypal: document.getElementById('paypal').checked,
            square: document.getElementById('square').checked,
            mailchimp: document.getElementById('mailchimp').checked,
            hubspot: document.getElementById('hubspot').checked,
            zapier: document.getElementById('zapier').checked,
            
            // Legal pages to generate
            generatePrivacy: document.getElementById('generate-privacy').checked,
            generateTerms: document.getElementById('generate-terms').checked,
            generateDisclaimer: document.getElementById('generate-disclaimer').checked,
            generateCookies: document.getElementById('generate-cookies').checked,
            generateCCPA: document.getElementById('generate-ccpa').checked,
            generateGDPR: document.getElementById('generate-gdpr').checked,
            
            // Cookie consent
            enableCookieConsent: document.getElementById('enable-cookie-consent').checked,
            cookieMessage: document.getElementById('cookie-message').value,
            acceptButtonText: document.getElementById('accept-button-text').value,
            declineButtonText: document.getElementById('decline-button-text').value,
            
            // Data retention
            dataRetention: parseInt(document.getElementById('data-retention').value)
        };
    }
    
    updateLegalPagesPreview(pages) {
        const previewContainer = document.querySelector('.legal-pages-list');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        
        pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'legal-page-item';
            pageItem.innerHTML = `
                <div class="page-info">
                    <span class="page-name">${page.name}</span>
                    <span class="page-status ${page.status === 'generated' ? 'status-generated' : 'status-pending'}">${page.status}</span>
                </div>
                <div class="page-actions">
                    <button class="btn-secondary btn-sm" onclick="window.adminPanel.viewFullPage('${page.name}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-secondary btn-sm" onclick="window.adminPanel.downloadPage('${page.name}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-primary btn-sm" onclick="window.adminPanel.addFooterLink('${page.name}', '${page.url}')">
                        <i class="fas fa-link"></i> Add to Footer
                    </button>
                </div>
            `;
            previewContainer.appendChild(pageItem);
        });
    }
    
    generatePrivacyPolicy(data) {
        return `
            <h1>Privacy Policy</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. Information We Collect</h2>
            <p>${data.companyName} ("we," "our," or "us") collects information you provide directly to us, including:</p>
            <ul>
                ${data.collectName ? '<li>Name and contact information</li>' : ''}
                ${data.collectEmail ? '<li>Email address</li>' : ''}
                ${data.collectPhone ? '<li>Phone number</li>' : ''}
                ${data.collectAddress ? '<li>Address information</li>' : ''}
                ${data.collectCookies ? '<li>Cookies and usage data</li>' : ''}
                ${data.collectUsage ? '<li>Website usage information</li>' : ''}
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                ${data.purposeContact ? '<li>Communicate with you</li>' : ''}
                ${data.purposeServices ? '<li>Provide our services</li>' : ''}
                ${data.purposeMarketing ? '<li>Send marketing communications</li>' : ''}
                ${data.purposeAnalytics ? '<li>Analyze and improve our website</li>' : ''}
                ${data.purposeLegal ? '<li>Comply with legal obligations</li>' : ''}
            </ul>
            
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            
            <h2>4. Data Retention</h2>
            <p>We retain your personal information for ${data.dataRetention} months or as long as necessary to fulfill the purposes outlined in this policy.</p>
            
            <h2>5. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    generateTermsOfService(data) {
        return `
            <h1>Terms of Service</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on ${data.companyName}'s website for personal, non-commercial transitory viewing only.</p>
            
            <h2>3. Disclaimer</h2>
            <p>The materials on ${data.companyName}'s website are provided on an 'as is' basis. ${data.companyName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            
            <h2>4. Limitations</h2>
            <p>In no event shall ${data.companyName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ${data.companyName}'s website.</p>
            
            <h2>5. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    generateDisclaimer(data) {
        return `
            <h1>Disclaimer</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. Information Accuracy</h2>
            <p>The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.</p>
            
            <h2>2. Professional Advice</h2>
            <p>Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
            
            <h2>3. External Links</h2>
            <p>Through this website, you are able to link to other websites which are not under the control of ${data.companyName}. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
            
            <h2>4. Contact Information</h2>
            <p>For questions about this Disclaimer, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    generateCookiePolicy(data) {
        return `
            <h1>Cookie Policy</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
            
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul>
                <li>To provide you with a better experience on our website</li>
                <li>To analyze how our website is used</li>
                <li>To personalize content and advertisements</li>
            </ul>
            
            <h2>3. Types of Cookies We Use</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website</li>
                <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites to display relevant advertisements</li>
            </ul>
            
            <h2>4. Managing Cookies</h2>
            <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
            
            <h2>5. Contact Information</h2>
            <p>For questions about our Cookie Policy, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    generateCCPANotice(data) {
        return `
            <h1>California Consumer Privacy Act (CCPA) Notice</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. Your Rights Under CCPA</h2>
            <p>Under the California Consumer Privacy Act (CCPA), California residents have the following rights:</p>
            <ul>
                <li>The right to know what personal information is collected, used, shared, or sold</li>
                <li>The right to delete personal information held by us</li>
                <li>The right to opt-out of the sale of personal information</li>
                <li>The right to non-discrimination for exercising your CCPA rights</li>
            </ul>
            
            <h2>2. Information We Collect</h2>
            <p>We collect the following categories of personal information:</p>
            <ul>
                ${data.collectName ? '<li>Identifiers (name, email address)</li>' : ''}
                ${data.collectPhone ? '<li>Contact information (phone number)</li>' : ''}
                ${data.collectAddress ? '<li>Geographic data (address)</li>' : ''}
                ${data.collectUsage ? '<li>Internet activity (browsing history)</li>' : ''}
            </ul>
            
            <h2>3. How to Exercise Your Rights</h2>
            <p>To exercise your CCPA rights, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    generateGDPRNotice(data) {
        return `
            <h1>General Data Protection Regulation (GDPR) Notice</h1>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            
            <h2>1. Your Rights Under GDPR</h2>
            <p>Under the GDPR, you have the following rights:</p>
            <ul>
                <li>The right to be informed about the collection and use of your personal data</li>
                <li>The right of access to your personal data</li>
                <li>The right to rectification of inaccurate personal data</li>
                <li>The right to erasure of your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your personal data</li>
                <li>Rights in relation to automated decision making and profiling</li>
            </ul>
            
            <h2>2. Legal Basis for Processing</h2>
            <p>We process your personal data based on the following legal grounds:</p>
            <ul>
                <li>Consent: When you have given us clear consent to process your personal data</li>
                <li>Contract: When processing is necessary for a contract we have with you</li>
                <li>Legitimate interests: When processing is necessary for our legitimate interests</li>
                <li>Legal obligation: When processing is necessary to comply with the law</li>
            </ul>
            
            <h2>3. Data Retention</h2>
            <p>We retain your personal data for ${data.dataRetention} months or as long as necessary to fulfill the purposes for which it was collected.</p>
            
            <h2>4. Contact Information</h2>
            <p>For questions about your GDPR rights, please contact us at:</p>
            <p>Email: ${data.legalEmail}<br>
            Phone: ${data.legalPhone}<br>
            Address: ${data.businessAddress}</p>
        `;
    }
    
    initializeNavigationLinksAdmin() {
        // Add navigation link button
        const addNavLinkBtn = document.getElementById('add-nav-link-admin');
        if (addNavLinkBtn) {
            addNavLinkBtn.addEventListener('click', () => this.addNavigationLinkAdmin());
        }
        
        // Load existing navigation links
        this.loadNavigationLinksAdmin();
    }
    
    addNavigationLinkAdmin() {
        const navLinksList = document.getElementById('nav-links-admin-list');
        if (!navLinksList) return;
        
        const linkIndex = navLinksList.children.length;
        const linkItem = document.createElement('div');
        linkItem.className = 'nav-link-item';
        linkItem.innerHTML = `
            <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLinkAdmin(${linkIndex})">
                <i class="fas fa-trash"></i>
            </button>
            <h5>Navigation Link ${linkIndex + 1}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Text</label>
                    <input type="text" class="nav-link-text-admin" value="New Link" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Link Type</label>
                    <select class="nav-link-type-admin" data-index="${linkIndex}">
                        <option value="anchor">Page Anchor</option>
                        <option value="external">External URL</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Target</label>
                    <input type="text" class="nav-link-target-admin" value="#section" placeholder="#section or https://example.com" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Open in New Tab</label>
                    <input type="checkbox" class="nav-link-new-tab-admin" data-index="${linkIndex}">
                </div>
            </div>
        `;
        
        navLinksList.appendChild(linkItem);
        
        // Add event listeners
        linkItem.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                this.collectNavigationData();
                this.updatePreview();
            });
            input.addEventListener('change', () => {
                this.collectNavigationData();
                this.updatePreview();
            });
        });
    }
    
    removeNavigationLinkAdmin(index) {
        const navLinksList = document.getElementById('nav-links-admin-list');
        if (navLinksList && navLinksList.children[index]) {
            navLinksList.children[index].remove();
            this.collectNavigationData();
            this.updatePreview();
        }
    }
    
    loadNavigationLinksAdmin() {
        // Default navigation links
        const defaultLinks = [
            { text: 'Home', target: '#home', type: 'anchor', newTab: false },
            { text: 'About', target: '#about', type: 'anchor', newTab: false },
            { text: 'Experience', target: '#experience', type: 'anchor', newTab: false },
            { text: 'Skills', target: '#skills', type: 'anchor', newTab: false },
            { text: 'LinkedIn', target: '#linkedin', type: 'anchor', newTab: false },
            { text: 'Testimonials', target: '#testimonials', type: 'anchor', newTab: false },
            { text: 'Contact', target: '#contact', type: 'anchor', newTab: false }
        ];
        
        const navLinksList = document.getElementById('nav-links-admin-list');
        if (!navLinksList) return;
        
        navLinksList.innerHTML = '';
        defaultLinks.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'nav-link-item';
            linkItem.innerHTML = `
                <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLinkAdmin(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Navigation Link ${index + 1}</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Text</label>
                        <input type="text" class="nav-link-text-admin" value="${link.text}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Link Type</label>
                        <select class="nav-link-type-admin" data-index="${index}">
                            <option value="anchor" ${link.type === 'anchor' ? 'selected' : ''}>Page Anchor</option>
                            <option value="external" ${link.type === 'external' ? 'selected' : ''}>External URL</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Target</label>
                        <input type="text" class="nav-link-target-admin" value="${link.target}" placeholder="#section or https://example.com" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Open in New Tab</label>
                        <input type="checkbox" class="nav-link-new-tab-admin" data-index="${index}" ${link.newTab ? 'checked' : ''}>
                    </div>
                </div>
            `;
            
            navLinksList.appendChild(linkItem);
            
            // Add event listeners
            linkItem.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', () => {
                    this.collectNavigationData();
                    this.updatePreview();
                });
                input.addEventListener('change', () => {
                    this.collectNavigationData();
                    this.updatePreview();
                });
            });
        });
        
        // Collect navigation data after loading
        this.collectNavigationData();
        console.log('✅ Navigation links loaded and initialized');
    }

    // Data Management
    async loadData() {
        try {
            console.log('Loading data...');
            
            // Always load default data first
            this.websiteData = this.getDefaultData();
            this.populateForms();
            
            // Try to load from Supabase if available
            if (this.supabase) {
                try {
                    const { data, error } = await this.supabase
                        .from('website_content')
                        .select('*');
                    
                    if (!error && data && data.length > 0) {
                        console.log(`Loaded ${data.length} sections from database`);
                        // Convert array to object
                        data.forEach(item => {
                            this.websiteData[item.section_name] = item.content;
                        });
                        this.populateForms();
                    }
                } catch (supabaseError) {
                    console.log('Supabase load failed, using default data');
                }
            }
        } catch (error) {
            console.log('Load data failed, using default data');
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

My philosophy centers on creating seamless experiences that transform international dreams into reality, backed by rigorous planning, deep industry knowledge, and operational excellence.`,
                highlights: [
                    'Australia Immigration Specialist',
                    '3+ Years Global Experience',
                    '200+ Successful Applications',
                    'Bachelor of Science Graduate'
                ],
                statistics: [
                    { number: '7', label: 'Years Total Experience' },
                    { number: '200', label: 'Students Guided' },
                    { number: '50', label: 'Partner Institutions' },
                    { number: '98', label: 'Success Rate %' }
                ]
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
            
            // Populate button data
            if (this.websiteData.hero.buttons) {
                this.populateButtonData(this.websiteData.hero.buttons);
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
        this.loadHighlights();
        this.loadStatistics();
        
        // Populate navigation data
        if (this.websiteData.navigation) {
            this.populateNavigationData(this.websiteData.navigation);
        }
        
        // Populate scripts data
        if (this.websiteData.scripts) {
            this.populateScriptsData(this.websiteData.scripts);
        }
    }
    
    populateButtonData(buttonData) {
        if (!buttonData) return;
        
        // Primary button
        if (buttonData.primary) {
            const primary = buttonData.primary;
            document.getElementById('hero-btn-primary-text').value = primary.text || 'Book a Consultation';
            document.getElementById('hero-btn-primary-link').value = primary.link || '#contact';
            document.getElementById('hero-btn-primary-link-type').value = primary.linkType || 'anchor';
            document.getElementById('hero-btn-primary-new-tab').checked = primary.newTab || false;
            
            if (primary.styling) {
                const styling = primary.styling;
                document.getElementById('hero-btn-primary-bg-start').value = styling.bgStart || '#6a5acd';
                document.getElementById('hero-btn-primary-bg-end').value = styling.bgEnd || '#9370db';
                document.getElementById('hero-btn-primary-text-color').value = styling.textColor || '#ffffff';
                document.getElementById('hero-btn-primary-border').value = styling.borderColor || 'transparent';
                document.getElementById('hero-btn-primary-border-width').value = styling.borderWidth || 0;
                document.getElementById('hero-btn-primary-radius').value = styling.borderRadius || 8;
                document.getElementById('hero-btn-primary-padding').value = styling.padding || 16;
                document.getElementById('hero-btn-primary-font-size').value = styling.fontSize || 16;
            }
        }
        
        // Secondary button
        if (buttonData.secondary) {
            const secondary = buttonData.secondary;
            document.getElementById('hero-btn-secondary-text').value = secondary.text || 'View Experience';
            document.getElementById('hero-btn-secondary-link').value = secondary.link || '#experience';
            document.getElementById('hero-btn-secondary-link-type').value = secondary.linkType || 'anchor';
            document.getElementById('hero-btn-secondary-new-tab').checked = secondary.newTab || false;
            
            if (secondary.styling) {
                const styling = secondary.styling;
                document.getElementById('hero-btn-secondary-bg').value = styling.bgColor || 'transparent';
                document.getElementById('hero-btn-secondary-text-color').value = styling.textColor || '#6a5acd';
                document.getElementById('hero-btn-secondary-border').value = styling.borderColor || '#6a5acd';
                document.getElementById('hero-btn-secondary-border-width').value = styling.borderWidth || 2;
                document.getElementById('hero-btn-secondary-radius').value = styling.borderRadius || 8;
                document.getElementById('hero-btn-secondary-padding').value = styling.padding || 16;
                document.getElementById('hero-btn-secondary-font-size').value = styling.fontSize || 16;
            }
        }
    }
    

    
    populateNavigationLinks(links) {
        const navLinksList = document.getElementById('nav-links-list');
        if (!navLinksList) return;
        
        navLinksList.innerHTML = '';
        links.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'nav-link-item';
            linkItem.innerHTML = `
                <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLink(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Navigation Link ${index + 1}</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Text</label>
                        <input type="text" class="nav-link-text" value="${link.text || 'Link'}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Link Type</label>
                        <select class="nav-link-type" data-index="${index}">
                            <option value="anchor" ${link.type === 'anchor' ? 'selected' : ''}>Page Anchor</option>
                            <option value="external" ${link.type === 'external' ? 'selected' : ''}>External URL</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Target</label>
                        <input type="text" class="nav-link-target" value="${link.target || '#section'}" placeholder="#section or https://example.com" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Open in New Tab</label>
                        <input type="checkbox" class="nav-link-new-tab" data-index="${index}" ${link.newTab ? 'checked' : ''}>
                    </div>
                </div>
            `;
            
            navLinksList.appendChild(linkItem);
            
            // Add event listeners
            linkItem.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', () => this.updatePreview());
                input.addEventListener('change', () => this.updatePreview());
            });
        });
    }
    
    populateNavigationData(navigationData) {
        if (!navigationData) return;
        
        // Dark theme colors
        document.getElementById('nav-bg-color').value = navigationData.bgColor || '#1a1a1a';
        document.getElementById('nav-text-color').value = navigationData.textColor || '#ffffff';
        document.getElementById('nav-hover-color').value = navigationData.hoverColor || '#ffd700';
        document.getElementById('nav-active-color').value = navigationData.activeColor || '#ffd700';
        
        // Light theme colors
        document.getElementById('nav-bg-color-light').value = navigationData.bgColorLight || '#ffffff';
        document.getElementById('nav-text-color-light').value = navigationData.textColorLight || '#333333';
        document.getElementById('nav-hover-color-light').value = navigationData.hoverColorLight || '#6a5acd';
        document.getElementById('nav-active-color-light').value = navigationData.activeColorLight || '#6a5acd';
        
        // Other settings
        document.getElementById('nav-bg-opacity').value = navigationData.bgOpacity || 100;
        document.getElementById('nav-font-size').value = navigationData.fontSize || 16;
        document.getElementById('nav-padding').value = navigationData.padding || 20;
        document.getElementById('nav-sticky').checked = navigationData.sticky !== false;
        document.getElementById('nav-show-logo').checked = navigationData.showLogo !== false;
        
        // Logo settings
        document.getElementById('logo-type').value = navigationData.logoType || 'single';
        document.getElementById('logo-size').value = navigationData.logoSize || 40;
        document.getElementById('logo-size-value').textContent = (navigationData.logoSize || 40) + 'px';
        
        // Show/hide logo config based on show logo setting
        const logoConfig = document.getElementById('logo-config');
        if (logoConfig) {
            logoConfig.style.display = navigationData.showLogo !== false ? 'block' : 'none';
        }
        
        // Populate logo previews if logos exist
        if (navigationData.logo) {
            this.updateLogoPreview('logo-preview', 'logo-preview-img', navigationData.logo);
            if (!this.websiteData.navigation) this.websiteData.navigation = {};
            this.websiteData.navigation.logo = navigationData.logo;
        }
        if (navigationData.logoDark) {
            this.updateLogoPreview('logo-dark-preview', 'logo-dark-preview-img', navigationData.logoDark);
            if (!this.websiteData.navigation) this.websiteData.navigation = {};
            this.websiteData.navigation.logoDark = navigationData.logoDark;
        }
        if (navigationData.logoLight) {
            this.updateLogoPreview('logo-light-preview', 'logo-light-preview-img', navigationData.logoLight);
            if (!this.websiteData.navigation) this.websiteData.navigation = {};
            this.websiteData.navigation.logoLight = navigationData.logoLight;
        }
        
        // Update opacity display
        const opacityValue = document.getElementById('nav-opacity-value');
        if (opacityValue) {
            opacityValue.textContent = (navigationData.bgOpacity || 100) + '%';
        }
        
        // Populate navigation links
        if (navigationData.links && navigationData.links.length > 0) {
            this.populateNavigationLinksAdmin(navigationData.links);
        }
    }
    
    populateNavigationLinksAdmin(links) {
        const navLinksList = document.getElementById('nav-links-admin-list');
        if (!navLinksList) return;
        
        navLinksList.innerHTML = '';
        links.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'nav-link-item';
            linkItem.innerHTML = `
                <button type="button" class="remove-nav-link" onclick="adminPanel.removeNavigationLinkAdmin(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Navigation Link ${index + 1}</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Text</label>
                        <input type="text" class="nav-link-text-admin" value="${link.text || 'Link'}" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Link Type</label>
                        <select class="nav-link-type-admin" data-index="${index}">
                            <option value="anchor" ${link.type === 'anchor' ? 'selected' : ''}>Page Anchor</option>
                            <option value="external" ${link.type === 'external' ? 'selected' : ''}>External URL</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Target</label>
                        <input type="text" class="nav-link-target-admin" value="${link.target || '#section'}" placeholder="#section or https://example.com" data-index="${index}">
                    </div>
                    <div class="form-group">
                        <label>Open in New Tab</label>
                        <input type="checkbox" class="nav-link-new-tab-admin" data-index="${index}" ${link.newTab ? 'checked' : ''}>
                    </div>
                </div>
            `;
            
            navLinksList.appendChild(linkItem);
            
            // Add event listeners
            linkItem.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', () => this.updatePreview());
                input.addEventListener('change', () => this.updatePreview());
            });
        });
    }
    
    // Script Manager Methods
    initializeScriptManager() {
        this.scripts = [];
        this.initializeScriptModal();
        this.loadScripts();
        this.updateScriptCount();
    }
    
    initializeScriptModal() {
        const addScriptBtn = document.getElementById('add-script-btn');
        const modal = document.getElementById('add-script-modal');
        const closeBtn = document.getElementById('close-script-modal');
        const cancelBtn = document.getElementById('cancel-script');
        const saveBtn = document.getElementById('save-script');
        
        if (addScriptBtn) {
            addScriptBtn.addEventListener('click', () => this.openScriptModal());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeScriptModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeScriptModal());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveScript());
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeScriptModal();
                }
            });
        }
        
        // Conflict detection on input change
        const scriptInputs = ['script-name', 'script-type', 'script-location', 'script-order', 'script-content'];
        scriptInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.checkScriptConflicts());
                input.addEventListener('change', () => this.checkScriptConflicts());
            }
        });
    }
    
    openScriptModal() {
        if (this.scripts.length >= 5) {
            this.showMessage('Maximum 5 scripts allowed', 'warning');
            return;
        }
        
        const modal = document.getElementById('add-script-modal');
        if (modal) {
            modal.style.display = 'block';
            this.resetScriptForm();
            this.checkScriptConflicts();
        }
    }
    
    closeScriptModal() {
        const modal = document.getElementById('add-script-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    resetScriptForm() {
        document.getElementById('script-name').value = '';
        document.getElementById('script-type').value = 'js';
        document.getElementById('script-location').value = 'head';
        document.getElementById('script-order').value = '1';
        document.getElementById('script-content').value = '';
        document.getElementById('script-enabled').checked = true;
        
        const warning = document.getElementById('script-conflict-warning');
        if (warning) {
            warning.style.display = 'none';
        }
    }
    
    checkScriptConflicts() {
        const name = document.getElementById('script-name').value.trim();
        const location = document.getElementById('script-location').value;
        const order = parseInt(document.getElementById('script-order').value);
        const content = document.getElementById('script-content').value.trim();
        
        const conflicts = [];
        
        // Check for duplicate names
        if (this.scripts.some(script => script.name === name && name !== '')) {
            conflicts.push('Script name already exists');
        }
        
        // Check for too many scripts in same location
        const locationCount = this.scripts.filter(script => script.location === location).length;
        if (locationCount >= 3) {
            conflicts.push(`Too many scripts in ${location} (max 3)`);
        }
        
        // Check for duplicate order in same location
        const orderConflict = this.scripts.some(script => 
            script.location === location && script.order === order
        );
        if (orderConflict) {
            conflicts.push(`Load order ${order} already used in ${location}`);
        }
        
        // Check for common conflict patterns in content
        if (content.includes('document.addEventListener') && content.includes('click')) {
            conflicts.push('Potential event listener conflicts detected');
        }
        
        if (content.includes('window.') && content.includes('=')) {
            conflicts.push('Potential global variable conflicts detected');
        }
        
        this.showConflictWarning(conflicts);
    }
    
    showConflictWarning(conflicts) {
        const warning = document.getElementById('script-conflict-warning');
        const message = document.getElementById('conflict-message');
        
        if (warning && message) {
            if (conflicts.length > 0) {
                warning.style.display = 'flex';
                message.textContent = conflicts.join(', ');
            } else {
                warning.style.display = 'none';
            }
        }
    }
    
    saveScript() {
        const name = document.getElementById('script-name').value.trim();
        const type = document.getElementById('script-type').value;
        const location = document.getElementById('script-location').value;
        const order = parseInt(document.getElementById('script-order').value);
        const content = document.getElementById('script-content').value.trim();
        const enabled = document.getElementById('script-enabled').checked;
        
        if (!name || !content) {
            this.showMessage('Script name and content are required', 'error');
            return;
        }
        
        if (this.scripts.length >= 5) {
            this.showMessage('Maximum 5 scripts allowed', 'error');
            return;
        }
        
        const script = {
            id: Date.now(),
            name,
            type,
            location,
            order,
            content,
            enabled
        };
        
        this.scripts.push(script);
        this.renderScripts();
        this.updateScriptCount();
        this.closeScriptModal();
        this.showMessage('Script added successfully', 'success');
    }
    
    removeScript(scriptId) {
        this.scripts = this.scripts.filter(script => script.id !== scriptId);
        this.renderScripts();
        this.updateScriptCount();
        this.showMessage('Script removed successfully', 'success');
    }
    
    toggleScript(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (script) {
            script.enabled = !script.enabled;
            this.renderScripts();
            this.showMessage(`Script ${script.enabled ? 'enabled' : 'disabled'}`, 'success');
        }
    }
    
    renderScripts() {
        const scriptsList = document.getElementById('scripts-list');
        if (!scriptsList) return;
        
        scriptsList.innerHTML = '';
        
        this.scripts.forEach(script => {
            const scriptItem = document.createElement('div');
            scriptItem.className = 'script-item';
            scriptItem.innerHTML = `
                <div class="script-item-header">
                    <div>
                        <h4 class="script-item-title">${script.name}</h4>
                        <div class="script-item-meta">
                            <span class="script-item-location">${script.location}</span>
                            <span class="script-item-order">Order: ${script.order}</span>
                            <span class="script-item-type">${script.type.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="script-item-actions">
                        <div class="script-toggle ${script.enabled ? 'active' : ''}" 
                             onclick="adminPanel.toggleScript(${script.id})"></div>
                        <button type="button" class="btn-remove" onclick="adminPanel.removeScript(${script.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="script-item-content">
                    ${this.escapeHtml(script.content.substring(0, 100))}${script.content.length > 100 ? '...' : ''}
                </div>
                ${script.content.length > 100 ? '<button class="script-expand-btn" onclick="this.previousElementSibling.classList.toggle(\'expanded\'); this.textContent = this.previousElementSibling.classList.contains(\'expanded\') ? \'Show Less\' : \'Show More\'">Show More</button>' : ''}
            `;
            
            scriptsList.appendChild(scriptItem);
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateScriptCount() {
        const countElement = document.getElementById('script-count');
        if (countElement) {
            countElement.textContent = this.scripts.length;
        }
    }
    
    loadScripts() {
        // Load from localStorage or database
        const savedScripts = localStorage.getItem('website_scripts');
        if (savedScripts) {
            try {
                this.scripts = JSON.parse(savedScripts);
                this.renderScripts();
                this.updateScriptCount();
            } catch (error) {
                console.error('Error loading scripts:', error);
            }
        }
    }
    
    collectScriptsData() {
        // Save to localStorage
        localStorage.setItem('website_scripts', JSON.stringify(this.scripts));
        return this.scripts;
    }
    
    populateScriptsData(scripts) {
        if (!scripts || !Array.isArray(scripts)) return;
        
        this.scripts = scripts;
        this.renderScripts();
        this.updateScriptCount();
    }
    
    // Dark Mode Functionality
    initializeDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
        
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('admin_dark_mode');
        if (savedDarkMode === 'true') {
            this.enableDarkMode();
        }
    }
    
    toggleDarkMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('admin_dark_mode', 'true');
        
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }
    
    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('admin_dark_mode', 'false');
        
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
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
        
        // Initialize advanced editor for the description textarea
        setTimeout(() => {
            const textarea = div.querySelector('.exp-description');
            if (textarea) {
                const uniqueId = `exp-description-${index}-${Date.now()}`;
                textarea.id = uniqueId;
                try {
                    this.advancedEditors[uniqueId] = new AdvancedEditor(uniqueId, {
                        enableRichText: true,
                        enableHtml: true,
                        enableGoogleFonts: true,
                        defaultMode: 'text'
                    });
                    
                    // Add event listener for content changes
                    textarea.addEventListener('input', (e) => {
                        this.updatePreview(e.target);
                    });
                } catch (error) {
                    console.error(`Failed to initialize advanced editor for experience ${index}:`, error);
                }
            }
        }, 100);
        
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
        
        // Initialize advanced editor for the quote textarea
        setTimeout(() => {
            const textarea = div.querySelector('.testimonial-quote');
            if (textarea) {
                const uniqueId = `testimonial-quote-${index}-${Date.now()}`;
                textarea.id = uniqueId;
                try {
                    this.advancedEditors[uniqueId] = new AdvancedEditor(uniqueId, {
                        enableRichText: true,
                        enableHtml: true,
                        enableGoogleFonts: true,
                        defaultMode: 'text'
                    });
                    
                    // Add event listener for content changes
                    textarea.addEventListener('input', (e) => {
                        this.updatePreview(e.target);
                    });
                } catch (error) {
                    console.error(`Failed to initialize advanced editor for testimonial ${index}:`, error);
                }
            }
        }, 100);
        
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
        
        // Initialize advanced editor for the description textarea
        setTimeout(() => {
            const textarea = div.querySelector('.linkedin-post-description');
            if (textarea) {
                const uniqueId = `linkedin-post-description-${index}-${Date.now()}`;
                textarea.id = uniqueId;
                try {
                    this.advancedEditors[uniqueId] = new AdvancedEditor(uniqueId, {
                        enableRichText: true,
                        enableHtml: true,
                        enableGoogleFonts: true,
                        defaultMode: 'text'
                    });
                    
                    // Add event listener for content changes
                    textarea.addEventListener('input', (e) => {
                        this.updatePreview(e.target);
                    });
                } catch (error) {
                    console.error(`Failed to initialize advanced editor for LinkedIn post ${index}:`, error);
                }
            }
        }, 100);
        
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
        // Clean up advanced editor if it exists
        const editorId = `exp-description-${index}`;
        if (this.advancedEditors && this.advancedEditors[editorId]) {
            this.advancedEditors[editorId].destroy();
            delete this.advancedEditors[editorId];
        }
        
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
        // Clean up advanced editor if it exists
        const editorId = `testimonial-quote-${index}`;
        if (this.advancedEditors && this.advancedEditors[editorId]) {
            this.advancedEditors[editorId].destroy();
            delete this.advancedEditors[editorId];
        }
        
        this.websiteData.testimonials.splice(index, 1);
        this.populateTestimonials();
        this.showMessage('Testimonial removed!', 'success');
    }

    removeLinkedInPost(index) {
        // Clean up advanced editor if it exists
        const editorId = `linkedin-post-description-${index}`;
        if (this.advancedEditors && this.advancedEditors[editorId]) {
            this.advancedEditors[editorId].destroy();
            delete this.advancedEditors[editorId];
        }
        
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
        
        // Update deployment preview as well
        this.updateDeploymentPreview();
    }

    updatePreviewIframe() {
        const iframe = document.getElementById('preview-iframe');
        if (iframe && iframe.contentWindow) {
            try {
                // Send data to iframe
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_WEBSITE',
                    data: this.websiteData
                }, '*');
                
                console.log('Data sent to iframe:', this.websiteData);
                
            } catch (error) {
                console.error('Error sending data to iframe:', error);
            }
        }
        
        // Always reload iframe to ensure updates are shown
        if (iframe) {
            const currentUrl = new URL(iframe.src);
            currentUrl.searchParams.set('timestamp', Date.now());
            iframe.src = currentUrl.toString();
            console.log('Iframe reloaded with timestamp');
        }
    }

    // Update deployment preview
    updateDeploymentPreview() {
        const deployPreview = document.getElementById('deploy-preview');
        const mainPreview = document.getElementById('preview-frame');
        
        if (deployPreview && mainPreview && mainPreview.contentDocument) {
            try {
                // Copy the main preview content to deployment preview
                const mainContent = mainPreview.contentDocument.documentElement.outerHTML;
                deployPreview.innerHTML = mainContent;
                console.log('Deployment preview updated');
            } catch (error) {
                console.error('Error updating deployment preview:', error);
            }
        }
    }

    // Save Changes
    async saveChanges(suppressMessage = false) {
        try {
            console.log('Starting save process...');
            this.logToDebug('Starting save process...', 'info');
            
            // Collect all form data
            await this.collectFormData();
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
            
            if (!suppressMessage) {
                this.showMessage('Changes saved successfully to database!', 'success');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            if (!suppressMessage) {
                this.showMessage('Error saving data to database: ' + error.message, 'error');
            }
        }
    }

    async collectFormData() {
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
            
            // Get description value from advanced editor if available
            let heroDescriptionValue = heroDescription ? heroDescription.value : '';
            if (heroDescription && heroDescription.id && this.advancedEditors && this.advancedEditors[heroDescription.id]) {
                heroDescriptionValue = this.advancedEditors[heroDescription.id].getValue();
            }
            
            // Get typewriter titles value from advanced editor if available
            let typewriterTitlesValue = document.getElementById('typewriter-titles') ? document.getElementById('typewriter-titles').value : '';
            const typewriterTitlesElement = document.getElementById('typewriter-titles');
            if (typewriterTitlesElement && typewriterTitlesElement.id && this.advancedEditors && this.advancedEditors[typewriterTitlesElement.id]) {
                typewriterTitlesValue = this.advancedEditors[typewriterTitlesElement.id].getValue();
            }
            
            // Collect button data
            const buttonData = this.collectButtonData();
            
            this.websiteData.hero = {
                greeting: heroGreeting ? heroGreeting.value : '',
                name: heroName ? heroName.value : '',
                subtitle: heroSubtitle ? heroSubtitle.value : '',
                description: heroDescriptionValue,
                image: heroImage ? heroImage.value : '',
                typewriterTitles: typewriterTitlesValue.split(',').map(t => t.trim()),
                buttons: buttonData
            };

            // About section
            const aboutTitle = document.getElementById('about-title');
            const aboutDescription = document.getElementById('about-description');
            const aboutText = document.getElementById('about-text');
            
            if (!aboutTitle || !aboutDescription || !aboutText) {
                throw new Error('About section fields not found');
            }
            
            // Get values from advanced editors if available
            let aboutDescriptionValue = aboutDescription.value;
            let aboutTextValue = aboutText.value;
            
            if (aboutDescription.id && this.advancedEditors && this.advancedEditors[aboutDescription.id]) {
                aboutDescriptionValue = this.advancedEditors[aboutDescription.id].getValue();
            }
            
            if (aboutText.id && this.advancedEditors && this.advancedEditors[aboutText.id]) {
                aboutTextValue = this.advancedEditors[aboutText.id].getValue();
            }
            
            this.websiteData.about = {
                title: aboutTitle.value,
                description: aboutDescriptionValue,
                text: aboutTextValue
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
        this.collectHighlightsData();
        this.collectStatisticsData();
        this.collectFormConfiguration();
        
        // Collect navigation data
        this.websiteData.navigation = this.collectNavigationData();
        
        // Collect scripts data
        this.websiteData.scripts = this.collectScriptsData();
        
        // Collect footer data
        const footerData = this.collectFooterData();
        this.websiteData.footer = footerData;
        console.log('Footer data saved to websiteData:', footerData);
        
        // Collect contact data
        this.websiteData.contact = this.collectContactData();
        console.log('Contact data saved to websiteData:', this.websiteData.contact);
        
        // Test if social media is in websiteData
        if (this.websiteData.footer && (this.websiteData.footer.linkedin || this.websiteData.footer.facebook || this.websiteData.footer.twitter || this.websiteData.footer.instagram)) {
            console.log('Social media data in websiteData:', {
                linkedin: this.websiteData.footer.linkedin,
                facebook: this.websiteData.footer.facebook,
                twitter: this.websiteData.footer.twitter,
                instagram: this.websiteData.footer.instagram
            });
        } else {
            console.log('No social media data in websiteData');
        }
        
        // Force save footer data to database
        if (this.websiteData.footer) {
            console.log('Saving footer data to database...');
            try {
                const { data, error } = await this.supabase
                    .from('website_content')
                    .upsert({
                        section_name: 'footer',
                        content: this.websiteData.footer
                    }, {
                        onConflict: 'section_name'
                    });
                
                if (error) {
                    console.error('Error saving footer data:', error);
                } else {
                    console.log('Footer data saved to database successfully');
                }
            } catch (error) {
                console.error('Error saving footer data:', error);
            }
        }
            
        } catch (error) {
            console.error('Error in collectFormData:', error);
            throw error;
        }
    }

    collectExperienceData() {
        const experiences = [];
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            const textarea = item.querySelector('.exp-description');
            let description = textarea.value;
            
            // Check if there's an advanced editor for this textarea
            if (textarea.id && this.advancedEditors && this.advancedEditors[textarea.id]) {
                description = this.advancedEditors[textarea.id].getValue();
            }
            
            experiences.push({
                title: item.querySelector('.exp-title').value,
                company: item.querySelector('.exp-company').value,
                date: item.querySelector('.exp-date').value,
                description: description
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
            const textarea = item.querySelector('.testimonial-quote');
            let quote = textarea.value;
            
            // Check if there's an advanced editor for this textarea
            if (textarea.id && this.advancedEditors && this.advancedEditors[textarea.id]) {
                quote = this.advancedEditors[textarea.id].getValue();
            }
            
            testimonials.push({
                name: item.querySelector('.testimonial-name').value,
                title: item.querySelector('.testimonial-title').value,
                quote: quote,
                rating: parseInt(item.querySelector('.testimonial-rating').value) || 5,
                image: item.querySelector('.testimonial-image').value
            });
        });
        this.websiteData.testimonials = testimonials;
    }

    collectLinkedInData() {
        const linkedinPosts = [];
        document.querySelectorAll('.linkedin-post-item').forEach((item, index) => {
            const textarea = item.querySelector('.linkedin-post-description');
            let description = textarea.value;
            
            // Check if there's an advanced editor for this textarea
            if (textarea.id && this.advancedEditors && this.advancedEditors[textarea.id]) {
                description = this.advancedEditors[textarea.id].getValue();
            }
            
            linkedinPosts.push({
                url: item.querySelector('.linkedin-post-url').value,
                title: item.querySelector('.linkedin-post-title').value,
                description: description,
                date: item.querySelector('.linkedin-post-date').value,
                image: item.querySelector('.linkedin-post-image').value
            });
        });
        this.websiteData.linkedin = linkedinPosts;
    }
    
    collectButtonData() {
        return {
            primary: {
                text: document.getElementById('hero-btn-primary-text')?.value || 'Book a Consultation',
                link: document.getElementById('hero-btn-primary-link')?.value || '#contact',
                linkType: document.getElementById('hero-btn-primary-link-type')?.value || 'anchor',
                newTab: document.getElementById('hero-btn-primary-new-tab')?.checked || false,
                styling: {
                    bgStart: document.getElementById('hero-btn-primary-bg-start')?.value || '#6a5acd',
                    bgEnd: document.getElementById('hero-btn-primary-bg-end')?.value || '#9370db',
                    textColor: document.getElementById('hero-btn-primary-text-color')?.value || '#ffffff',
                    borderColor: document.getElementById('hero-btn-primary-border')?.value || 'transparent',
                    borderWidth: parseInt(document.getElementById('hero-btn-primary-border-width')?.value || '0'),
                    borderRadius: parseInt(document.getElementById('hero-btn-primary-radius')?.value || '8'),
                    padding: parseInt(document.getElementById('hero-btn-primary-padding')?.value || '16'),
                    fontSize: parseInt(document.getElementById('hero-btn-primary-font-size')?.value || '16')
                }
            },
            secondary: {
                text: document.getElementById('hero-btn-secondary-text')?.value || 'View Experience',
                link: document.getElementById('hero-btn-secondary-link')?.value || '#experience',
                linkType: document.getElementById('hero-btn-secondary-link-type')?.value || 'anchor',
                newTab: document.getElementById('hero-btn-secondary-new-tab')?.checked || false,
                styling: {
                    bgColor: document.getElementById('hero-btn-secondary-bg')?.value || 'transparent',
                    textColor: document.getElementById('hero-btn-secondary-text-color')?.value || '#6a5acd',
                    borderColor: document.getElementById('hero-btn-secondary-border')?.value || '#6a5acd',
                    borderWidth: parseInt(document.getElementById('hero-btn-secondary-border-width')?.value || '2'),
                    borderRadius: parseInt(document.getElementById('hero-btn-secondary-radius')?.value || '8'),
                    padding: parseInt(document.getElementById('hero-btn-secondary-padding')?.value || '16'),
                    fontSize: parseInt(document.getElementById('hero-btn-secondary-font-size')?.value || '16')
                }
            }
        };
    }
    

    
    collectNavigationData() {
        const navLinks = [];
        document.querySelectorAll('#nav-links-admin-list .nav-link-item').forEach((item, index) => {
            navLinks.push({
                text: item.querySelector('.nav-link-text-admin')?.value || 'Link',
                target: item.querySelector('.nav-link-target-admin')?.value || '#section',
                type: item.querySelector('.nav-link-type-admin')?.value || 'anchor',
                newTab: item.querySelector('.nav-link-new-tab-admin')?.checked || false
            });
        });
        
        // For theme users, only collect link data
        // Colors and styling are controlled by the theme
        const navigationData = {
            links: navLinks
        };
        
        // Save to website data
        this.websiteData.navigation = navigationData;
        
        return navigationData;
    }
    
    collectFormConfiguration() {
        const formType = document.getElementById('form-type')?.value || 'email';
        
        // Get autoresponder code value from advanced editor if available
        let autoresponderCodeValue = document.getElementById('autoresponder-code')?.value || '';
        const autoresponderCodeElement = document.getElementById('autoresponder-code');
        if (autoresponderCodeElement && autoresponderCodeElement.id && this.advancedEditors && this.advancedEditors[autoresponderCodeElement.id]) {
            autoresponderCodeValue = this.advancedEditors[autoresponderCodeElement.id].getValue();
        }
        
        const formConfig = {
            type: formType,
            email: {
                recipient: document.getElementById('recipient-email')?.value || '',
                subject: document.getElementById('email-subject')?.value || ''
            },
            autoresponder: {
                code: autoresponderCodeValue,
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
        
        // Save to localStorage so the main website can access it
        localStorage.setItem('websiteData', JSON.stringify(this.websiteData));
        
        // If we're in a preview iframe, send the data to the parent
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'UPDATE_WEBSITE',
                data: this.websiteData
            }, '*');
        }
    }

    // Preview Functions
    showPreview() {
        // Use the exact same approach as theme preview but with current settings
        const modal = document.getElementById('theme-preview-modal');
        const iframe = document.getElementById('theme-preview-iframe');
        
        if (modal && iframe) {
            // Collect current form data first
            this.collectFormData();
            
            // Show modal
            modal.classList.add('active');
            
            // Reload iframe to ensure latest data is shown
            iframe.src = 'index.html?preview=true&timestamp=' + Date.now();
            
            // Send data to iframe after a short delay to ensure it's loaded
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_WEBSITE',
                        data: this.websiteData
                    }, '*');
                    console.log('Preview data sent:', this.websiteData);
                }
            }, 1000);
        }
    }

    closePreview() {
        document.getElementById('theme-preview-modal').classList.remove('active');
    }
    
    toggleScreenSize(size) {
        // Remove active class from all buttons
        document.querySelectorAll('.screen-size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`[data-size="${size}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update preview containers
        const previewContainers = document.querySelectorAll('.preview-container');
        previewContainers.forEach(container => {
            container.className = `preview-container ${size}`;
        });
    }

    showCurrentThemePreview() {
        // Show preview with current settings
        const modal = document.getElementById('preview-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updatePreviewIframe();
        }
    }

    showThemePreviewLightbox() {
        // Show theme preview in lightbox modal
        const modal = document.getElementById('theme-preview-modal');
        if (modal) {
            modal.classList.add('active');
            const iframe = document.getElementById('theme-preview-iframe');
            if (iframe) {
                iframe.src = 'index.html';
                // Send current data to iframe after load
                setTimeout(() => {
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'UPDATE_WEBSITE',
                            data: this.websiteData
                        }, '*');
                    }
                }, 500);
            }
        }
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
    
    // Cleanup advanced editors
    cleanupAdvancedEditors() {
        if (this.advancedEditors) {
            Object.values(this.advancedEditors).forEach(editor => {
                if (editor && typeof editor.destroy === 'function') {
                    editor.destroy();
                }
            });
            this.advancedEditors = {};
        }
    }
    
    // Enhanced Color Preview Handlers
    bindColorPreviewHandlers() {
        const colorInputs = [
            'primary-color', 'secondary-color', 'accent-color',
            'nav-bg-color', 'nav-text-color', 'nav-hover-color', 'nav-active-color'
        ];
        
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(`${inputId}-preview`);
            const valueSpan = document.getElementById(`${inputId}-value`);
            const colorNameSpan = document.querySelector(`#${inputId}-preview`).parentNode.querySelector('.color-name');
            const colorHexSpan = document.querySelector(`#${inputId}-preview`).parentNode.querySelector('.color-hex');
            
            if (input && preview && valueSpan) {
                // Set initial color
                const initialColor = input.value;
                preview.style.backgroundColor = initialColor;
                valueSpan.textContent = initialColor;
                
                // Update color info
                if (colorNameSpan) {
                    colorNameSpan.textContent = this.getColorName(initialColor);
                }
                if (colorHexSpan) {
                    colorHexSpan.textContent = initialColor;
                }
                
                // Update on change
                input.addEventListener('input', (e) => {
                    const color = e.target.value;
                    preview.style.backgroundColor = color;
                    valueSpan.textContent = color;
                    
                    // Update color info
                    if (colorNameSpan) {
                        colorNameSpan.textContent = this.getColorName(color);
                    }
                    if (colorHexSpan) {
                        colorHexSpan.textContent = color;
                    }
                });
            }
        });
    }

    getColorName(hexColor) {
        const colorMap = {
            '#1e40af': 'Dark Blue',
            '#ea580c': 'Orange',
            '#3b82f6': 'Blue',
            '#1a1a1a': 'Dark Gray',
            '#ffffff': 'White',
            '#ffd700': 'Gold',
            '#6a5acd': 'Purple',
            '#8e6ee6': 'Light Purple',
            '#ffa726': 'Orange',
            '#4caf50': 'Green',
            '#f44336': 'Red',
            '#ff9800': 'Orange'
        };
        
        return colorMap[hexColor.toLowerCase()] || 'Custom';
    }
    
    // Theme Preview Handlers
    bindThemePreviewHandlers() {
        const themePreviewModal = document.getElementById('theme-preview-modal');
        const themePreviewClose = document.getElementById('theme-preview-close');
        const themePreviewIframe = document.getElementById('theme-preview-iframe');
        
        // Handle individual theme preview buttons
        const themePreviewBtns = document.querySelectorAll('.theme-preview-btn');
        themePreviewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = btn.getAttribute('data-theme');
                this.showThemePreview(theme);
            });
        });
        
        if (themePreviewClose) {
            themePreviewClose.addEventListener('click', () => {
                this.closeThemePreview();
            });
        }
        
        // Also handle escape key for theme preview
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const themeModal = document.getElementById('theme-preview-modal');
                if (themeModal && themeModal.classList.contains('active')) {
                    this.closeThemePreview();
                }
            }
        });
        
        // Close modal on outside click
        if (themePreviewModal) {
            themePreviewModal.addEventListener('click', (e) => {
                if (e.target === themePreviewModal) {
                    this.closeThemePreview();
                }
            });
        }
    }
    
    showThemePreview(theme = null) {
        const modal = document.getElementById('theme-preview-modal');
        const iframe = document.getElementById('theme-preview-iframe');
        
        if (modal && iframe) {
            // Collect current form data first
            this.collectFormData();
            
            // Create a copy of website data with the specific theme
            const previewData = JSON.parse(JSON.stringify(this.websiteData));
            
            // Set the specific theme
            if (!previewData.settings) previewData.settings = {};
            previewData.settings.theme = theme || 'modern';
            
            // Update colors based on theme
            const themeColors = this.getThemeColors(theme || 'modern');
            if (previewData.settings) {
                previewData.settings.primaryColor = themeColors.primary;
                previewData.settings.secondaryColor = themeColors.secondary;
                previewData.settings.accentColor = themeColors.accent;
            }
            
            // Show modal
            modal.classList.add('active');
            
            // Send data to iframe after a short delay to ensure it's loaded
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_WEBSITE',
                        data: previewData
                    }, '*');
                    console.log('Theme preview data sent:', previewData);
                }
            }, 500);
        }
    }
    
    getThemeColors(theme) {
        const themes = {
            'modern': {
                primary: '#6a5acd',
                secondary: '#8e6ee6',
                accent: '#ffa726'
            },
            'elegant': {
                primary: '#2c3e50',
                secondary: '#34495e',
                accent: '#e74c3c'
            },
            'creative': {
                primary: '#e91e63',
                secondary: '#9c27b0',
                accent: '#ff9800'
            },
            'minimal': {
                primary: '#333333',
                secondary: '#666666',
                accent: '#999999'
            },
            'corporate': {
                primary: '#1976d2',
                secondary: '#424242',
                accent: '#ff5722'
            }
        };
        
        return themes[theme] || themes.modern;
    }
    
    closeThemePreview() {
        const modal = document.getElementById('theme-preview-modal');
        if (modal) {
            modal.classList.remove('active');
            console.log('Theme preview modal closed');
        }
    }
    
    // Global Font Set Handlers
    bindGlobalFontSetHandlers() {
        const fontSetSelect = document.getElementById('global-font-set');
        
        if (fontSetSelect) {
            fontSetSelect.addEventListener('change', (e) => {
                this.updateGlobalFontSet(e.target.value);
            });
            
            // Set initial value
            if (this.websiteData.settings?.globalFontSet) {
                fontSetSelect.value = this.websiteData.settings.globalFontSet;
            }
        }
    }
    
    updateGlobalFontSet(fontSet) {
        // Update the settings
        if (!this.websiteData.settings) this.websiteData.settings = {};
        this.websiteData.settings.globalFontSet = fontSet;
        
        // Load appropriate fonts based on selection
        this.loadFontSet(fontSet);
        
        // Show preview of the font set
        this.showFontSetPreview(fontSet);
    }
    
    loadFontSet(fontSet) {
        const fontLinks = {
            'professional': [
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap'
            ],
            'futuristic': [
                'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@400;500;600&display=swap'
            ],
            'minimalist': [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Source+Sans+Pro:wght@300;400;600&display=swap'
            ],
            'scrapbook': [
                'https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat:wght@400;500;600;700&display=swap'
            ],
            'impactful': [
                'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Impact&display=swap'
            ]
        };
        
        if (fontLinks[fontSet]) {
            fontLinks[fontSet].forEach(link => {
                this.loadGoogleFont(link);
            });
        }
    }
    
    loadGoogleFont(link) {
        // Check if font is already loaded
        if (!document.querySelector(`link[href="${link}"]`)) {
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = link;
            document.head.appendChild(linkElement);
        }
    }
    
    showFontSetPreview(fontSet) {
        const descriptions = {
            'anwesh-default': 'Current default font selection',
            'professional': 'Clean, modern fonts perfect for business and professional websites',
            'futuristic': 'Bold, tech-inspired fonts for cutting-edge designs',
            'minimalist': 'Lightweight, clean fonts for minimal and elegant designs',
            'scrapbook': 'Handwritten, creative fonts for personal and artistic websites',
            'impactful': 'Strong, bold fonts that make a powerful statement'
        };
        
        // You can add a preview element to show the font set
        console.log(`Font set changed to: ${fontSet} - ${descriptions[fontSet]}`);
    }
    
    // Navigation Color Settings
    bindNavigationColorHandlers() {
        const navColorMode = document.getElementById('nav-color-mode');
        const navCustomColors = document.getElementById('nav-custom-colors');
        const navLightColors = document.getElementById('nav-light-colors');
        const navInvertColors = document.getElementById('nav-invert-colors');
        
        if (navColorMode) {
            navColorMode.addEventListener('change', (e) => {
                this.updateNavigationColorMode(e.target.value);
            });
            
            // Set initial value
            if (this.websiteData.settings?.navColorMode) {
                navColorMode.value = this.websiteData.settings.navColorMode;
                this.updateNavigationColorMode(this.websiteData.settings.navColorMode);
            }
        }
        
        if (navCustomColors && navLightColors) {
            // Show/hide color sections based on mode
            navColorMode?.addEventListener('change', (e) => {
                const mode = e.target.value;
                navCustomColors.style.display = 'none';
                navLightColors.style.display = 'none';
                
                if (mode === 'custom') {
                    navCustomColors.style.display = 'block';
                    navLightColors.style.display = 'block';
                }
            });
            
            // Initialize custom color inputs
            this.bindCustomColorHandlers();
            this.bindLightColorHandlers();
        }
        
        if (navInvertColors) {
            navInvertColors.addEventListener('change', (e) => {
                this.updateNavigationInvert(e.target.checked);
            });
            
            // Set initial value
            if (this.websiteData.settings?.navInvertColors !== undefined) {
                navInvertColors.checked = this.websiteData.settings.navInvertColors;
            }
        }
    }
    
    bindCustomColorHandlers() {
        const colorInputs = ['nav-bg-color', 'nav-text-color', 'nav-hover-color', 'nav-active-color'];
        
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(`${inputId}-preview`);
            const valueSpan = document.getElementById(`${inputId}-value`);
            
            if (input && preview && valueSpan) {
                // Set initial color
                preview.style.backgroundColor = input.value;
                valueSpan.textContent = input.value;
                
                // Update on change
                input.addEventListener('input', (e) => {
                    const color = e.target.value;
                    preview.style.backgroundColor = color;
                    valueSpan.textContent = color;
                    this.updateNavigationCustomColors();
                });
            }
        });
    }
    
    bindLightColorHandlers() {
        const colorInputs = ['nav-bg-color-light', 'nav-text-color-light', 'nav-hover-color-light', 'nav-active-color-light'];
        
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(`${inputId}-preview`);
            const valueSpan = document.getElementById(`${inputId}-value`);
            
            if (input && preview && valueSpan) {
                // Set initial color
                preview.style.backgroundColor = input.value;
                valueSpan.textContent = input.value;
                
                // Update on change
                input.addEventListener('input', (e) => {
                    const color = e.target.value;
                    preview.style.backgroundColor = color;
                    valueSpan.textContent = color;
                    this.updateNavigationCustomColors();
                });
            }
        });
    }
    
    updateNavigationColorMode(mode) {
        // Update the settings
        if (!this.websiteData.settings) this.websiteData.settings = {};
        this.websiteData.settings.navColorMode = mode;
        
        // Apply the color mode
        this.applyNavigationColorMode(mode);
        
        console.log(`Navigation color mode changed to: ${mode}`);
    }
    
    applyNavigationColorMode(mode) {
        const sidebar = document.querySelector('.admin-sidebar');
        if (!sidebar) return;
        
        // Remove existing color classes
        sidebar.classList.remove('nav-invert-dark', 'nav-invert-light');
        
        switch (mode) {
            case 'auto':
                // Auto follows the current theme
                if (document.body.classList.contains('dark-mode')) {
                    sidebar.classList.add('nav-invert-dark');
                } else {
                    sidebar.classList.add('nav-invert-light');
                }
                break;
            case 'dark':
                sidebar.classList.add('nav-invert-dark');
                break;
            case 'light':
                sidebar.classList.add('nav-invert-light');
                break;
            case 'custom':
                this.applyNavigationCustomColors();
                break;
        }
    }
    
    updateNavigationCustomColors() {
        const bgColor = document.getElementById('nav-bg-color')?.value || '#1a1a1a';
        const textColor = document.getElementById('nav-text-color')?.value || '#ffffff';
        const hoverColor = document.getElementById('nav-hover-color')?.value || '#ffd700';
        const activeColor = document.getElementById('nav-active-color')?.value || '#ffd700';
        
        // Apply custom colors via CSS variables
        document.documentElement.style.setProperty('--nav-bg-color', bgColor);
        document.documentElement.style.setProperty('--nav-text-color', textColor);
        document.documentElement.style.setProperty('--nav-hover-color', hoverColor);
        document.documentElement.style.setProperty('--nav-active-color', activeColor);
        
        // Update settings
        if (!this.websiteData.settings) this.websiteData.settings = {};
        this.websiteData.settings.navCustomColors = {
            bg: bgColor,
            text: textColor,
            hover: hoverColor,
            active: activeColor
        };
    }
    
    applyNavigationCustomColors() {
        const sidebar = document.querySelector('.admin-sidebar');
        if (!sidebar) return;
        
        // Remove existing color classes
        sidebar.classList.remove('nav-invert-dark', 'nav-invert-light');
        
        // Apply custom colors
        this.updateNavigationCustomColors();
    }
    
    updateNavigationInvert(invert) {
        // Update the settings
        if (!this.websiteData.settings) this.websiteData.settings = {};
        this.websiteData.settings.navInvertColors = invert;
        
        // Apply inversion
        this.applyNavigationInvert(invert);
        
        console.log(`Navigation color inversion: ${invert}`);
    }
    
    applyNavigationInvert(invert) {
        const sidebar = document.querySelector('.admin-sidebar');
        if (!sidebar) return;
        
        if (invert) {
            // Invert the current colors
            if (document.body.classList.contains('dark-mode')) {
                sidebar.classList.remove('nav-invert-dark');
                sidebar.classList.add('nav-invert-light');
            } else {
                sidebar.classList.remove('nav-invert-light');
                sidebar.classList.add('nav-invert-dark');
            }
        } else {
            // Reset to normal
            this.applyNavigationColorMode(this.websiteData.settings?.navColorMode || 'auto');
        }
    }
    
    // Utility function to scroll to top
    scrollToTop() {
        // Scroll admin panel to top
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) {
            adminPanel.scrollTop = 0;
        }
        
        // Scroll active section to top
        const activeSection = document.querySelector('.editor-section.active');
        if (activeSection) {
            activeSection.scrollTop = 0;
        }
        
        // Scroll window to top
        window.scrollTo(0, 0);
    }

    // Contact Form Handlers
    bindContactFormHandlers() {
        const formType = document.getElementById('form-type');
        if (formType) {
            formType.addEventListener('change', () => {
                this.updateContactForm();
            });
        }

        const formInputs = [
            'form-title', 'form-description', 'form-button-text', 
            'form-success-message', 'form-notification-email', 'form-recaptcha'
        ];

        formInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateContactForm();
                });
            }
        });
    }

    updateContactForm() {
        const formData = {
            type: document.getElementById('form-type')?.value || 'simple',
            title: document.getElementById('form-title')?.value || 'Get In Touch',
            description: document.getElementById('form-description')?.value || '',
            buttonText: document.getElementById('form-button-text')?.value || 'Send Message',
            successMessage: document.getElementById('form-success-message')?.value || '',
            notificationEmail: document.getElementById('form-notification-email')?.value || '',
            recaptcha: document.getElementById('form-recaptcha')?.checked || false
        };

        // Update website data
        this.websiteData.form = formData;
        
        // Update preview
        this.updatePreview();
        
        // Save to database
        this.saveChanges();
    }

    // Legal Compliance Handlers
    bindLegalComplianceHandlers() {
        const generateBtn = document.getElementById('generate-legal-pages');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateLegalPages();
            });
        }

        const legalInputs = [
            'company-name', 'entity-type', 'country-operation', 'business-address',
            'legal-email', 'legal-phone', 'collect-name', 'collect-email', 'collect-phone',
            'collect-address', 'collect-cookies', 'collect-usage', 'purpose-contact',
            'purpose-services', 'purpose-marketing'
        ];

        legalInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', async () => {
                    await this.updateLegalCompliance();
                });
            }
        });
        
        // Initialize footer
        this.initializeFooter();
    }

    async updateLegalCompliance() {
        const legalData = {
            company: {
                name: document.getElementById('company-name')?.value || '',
                entityType: document.getElementById('entity-type')?.value || 'individual',
                country: document.getElementById('country-operation')?.value || 'australia',
                address: document.getElementById('business-address')?.value || '',
                email: document.getElementById('legal-email')?.value || '',
                phone: document.getElementById('legal-phone')?.value || ''
            },
            dataCollection: {
                name: document.getElementById('collect-name')?.checked || false,
                email: document.getElementById('collect-email')?.checked || false,
                phone: document.getElementById('collect-phone')?.checked || false,
                address: document.getElementById('collect-address')?.checked || false,
                cookies: document.getElementById('collect-cookies')?.checked || false,
                usage: document.getElementById('collect-usage')?.checked || false
            },
            dataUsage: {
                contact: document.getElementById('purpose-contact')?.checked || false,
                services: document.getElementById('purpose-services')?.checked || false,
                marketing: document.getElementById('purpose-marketing')?.checked || false
            }
        };

        // Update website data
        this.websiteData.legal = legalData;
        
        // Update preview
        this.updatePreview();
        
        // Save to database
        this.saveChanges();
        
        // Save to localStorage so legal pages can access it
        this.updateMainWebsite();
        
        // Save to Supabase
        await this.saveLegalDataToSupabase();
        
        // Auto-generate compliance pages when settings change
        this.generateLegalPages();
    }

    async saveLegalCompliance() {
        try {
            console.log('Saving legal compliance data...');
            
            // Update legal compliance data
            await this.updateLegalCompliance();
            
            // Show success message
            this.showMessage('Legal compliance data saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving legal compliance:', error);
            this.showMessage('Error saving legal compliance data!', 'error');
        }
    }

    async saveLegalDataToSupabase() {
        try {
            const supabaseUrl = 'https://wwpjacyzmteiexchtnfj.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q';
            
            const legalData = {
                company_name: document.getElementById('company-name')?.value || '',
                entity_type: document.getElementById('entity-type')?.value || 'individual',
                country_operation: document.getElementById('country-operation')?.value || 'australia',
                business_address: document.getElementById('business-address')?.value || '',
                legal_email: document.getElementById('legal-email')?.value || '',
                legal_phone: document.getElementById('legal-phone')?.value || ''
            };

            console.log('Attempting to save legal data to Supabase:', legalData);

            // First check if record exists
            const checkResponse = await fetch(`${supabaseUrl}/rest/v1/legal_pages?select=id&limit=1`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });

            console.log('Check response status:', checkResponse.status);

            let response;
            if (checkResponse.ok) {
                const existingData = await checkResponse.json();
                console.log('Existing data:', existingData);
                
                if (existingData && existingData.length > 0) {
                    // Update existing record
                    console.log('Updating existing record...');
                    response = await fetch(`${supabaseUrl}/rest/v1/legal_pages?id=eq.1`, {
                        method: 'PATCH',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(legalData)
                    });
                } else {
                    // Insert new record
                    console.log('Inserting new record...');
                    response = await fetch(`${supabaseUrl}/rest/v1/legal_pages`, {
                        method: 'POST',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(legalData)
                    });
                }
            } else {
                // Insert new record if check fails
                console.log('Check failed, inserting new record...');
                response = await fetch(`${supabaseUrl}/rest/v1/legal_pages`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(legalData)
                });
            }

            console.log('Save response status:', response.status);
            console.log('Save response text:', response.statusText);

            if (response.ok) {
                console.log('Legal data saved to Supabase successfully');
                this.showMessage('Legal data saved to database successfully!', 'success');
            } else {
                const errorText = await response.text();
                console.error('Failed to save legal data to Supabase:', response.statusText, errorText);
                this.showMessage('Failed to save legal data to database!', 'error');
            }
        } catch (error) {
            console.error('Error saving legal data to Supabase:', error);
            this.showMessage('Error saving legal data to database!', 'error');
        }
    }

    generateLegalPages() {
        try {
            // Collect legal data from the form
            const legalData = {
                companyName: document.getElementById('company-name')?.value || 'Your Company',
                entityType: document.getElementById('entity-type')?.value || 'individual',
                countryOperation: document.getElementById('country-operation')?.value || 'australia',
                businessAddress: document.getElementById('business-address')?.value || '',
                legalEmail: document.getElementById('legal-email')?.value || '',
                legalPhone: document.getElementById('legal-phone')?.value || '',
                
                // Data collection
                collectName: document.getElementById('collect-name')?.checked || false,
                collectEmail: document.getElementById('collect-email')?.checked || false,
                collectPhone: document.getElementById('collect-phone')?.checked || false,
                collectAddress: document.getElementById('collect-address')?.checked || false,
                collectCookies: document.getElementById('collect-cookies')?.checked || false,
                collectUsage: document.getElementById('collect-usage')?.checked || false,
                
                // Data usage purposes
                purposeContact: document.getElementById('purpose-contact')?.checked || false,
                purposeServices: document.getElementById('purpose-services')?.checked || false,
                purposeMarketing: document.getElementById('purpose-marketing')?.checked || false
            };

            // Generate individual legal pages
            const generatedPages = [];
            
            generatedPages.push({
                name: 'Privacy Policy',
                url: '/privacy-policy',
                status: 'generated',
                content: this.generatePrivacyPolicy(legalData)
            });
            
            generatedPages.push({
                name: 'Terms of Service',
                url: '/terms-of-service',
                status: 'generated',
                content: this.generateTermsOfService(legalData)
            });
            
            generatedPages.push({
                name: 'Disclaimer',
                url: '/disclaimer',
                status: 'generated',
                content: this.generateDisclaimer(legalData)
            });
            
            generatedPages.push({
                name: 'Cookie Policy',
                url: '/cookie-policy',
                status: 'generated',
                content: this.generateCookiePolicy(legalData)
            });

            // Generate the main compliance page that contains all documents
            const compliancePage = this.generateCompliancePage(legalData, generatedPages);

            // Update the preview
            this.updateLegalPagesPreview(generatedPages, compliancePage);
            
            // Save to website data
            if (!this.websiteData.legal) this.websiteData.legal = {};
            this.websiteData.legal.generatedPages = generatedPages;
            this.websiteData.legal.compliancePage = compliancePage;
            this.websiteData.legal.companyData = legalData;
            
            // Save to database
            this.saveChanges();
            

            
            // Show success message
            this.showMessage('Legal pages and compliance page generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating legal pages:', error);
            this.showMessage('Failed to generate legal pages!', 'error');
        }
    }



    generateCompliancePage(legalData, generatedPages) {
        const currentDate = new Date().toLocaleDateString();
        
        let complianceContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Legal Compliance - ${legalData.companyName}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    
                    .header {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 15px;
                        padding: 30px;
                        margin-bottom: 30px;
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }
                    
                    .header h1 {
                        color: #2c3e50;
                        font-size: 2.5em;
                        margin-bottom: 10px;
                        font-weight: 700;
                    }
                    
                    .header p {
                        color: #7f8c8d;
                        font-size: 1.1em;
                    }
                    
                    .nav-tabs {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 30px;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 15px;
                        padding: 10px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        flex-wrap: wrap;
                    }
                    
                    .nav-tab {
                        background: transparent;
                        border: none;
                        padding: 12px 24px;
                        margin: 5px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                        color: #7f8c8d;
                        transition: all 0.3s ease;
                        font-size: 0.9em;
                    }
                    
                    .nav-tab:hover {
                        background: rgba(102, 126, 234, 0.1);
                        color: #667eea;
                        transform: translateY(-2px);
                    }
                    
                    .nav-tab.active {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    }
                    
                    .content-section {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 15px;
                        padding: 40px;
                        margin-bottom: 30px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        display: none;
                    }
                    
                    .content-section.active {
                        display: block;
                        animation: fadeInUp 0.5s ease;
                    }
                    
                    .content-section h2 {
                        color: #2c3e50;
                        font-size: 2em;
                        margin-bottom: 20px;
                        border-bottom: 3px solid #667eea;
                        padding-bottom: 10px;
                    }
                    
                    .content-section h3 {
                        color: #34495e;
                        font-size: 1.5em;
                        margin: 25px 0 15px 0;
                    }
                    
                    .content-section p {
                        margin-bottom: 15px;
                        color: #555;
                    }
                    
                    .content-section ul {
                        margin: 15px 0;
                        padding-left: 20px;
                    }
                    
                    .content-section li {
                        margin-bottom: 8px;
                        color: #555;
                    }
                    
                    .footer {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                        color: #7f8c8d;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .nav-tabs {
                            flex-direction: column;
                        }
                        
                        .nav-tab {
                            margin: 2px;
                        }
                        
                        .header h1 {
                            font-size: 2em;
                        }
                        
                        .content-section {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Legal Compliance</h1>
                        <p>${legalData.companyName} - Last Updated: ${currentDate}</p>
                    </div>
                    
                    <div class="nav-tabs">
                        <button class="nav-tab active" onclick="showSection('privacy')">Privacy Policy</button>
                        <button class="nav-tab" onclick="showSection('terms')">Terms of Service</button>
                        <button class="nav-tab" onclick="showSection('disclaimer')">Disclaimer</button>
                        <button class="nav-tab" onclick="showSection('cookies')">Cookie Policy</button>
                    </div>
                    
                    <div id="privacy" class="content-section active">
                        <h2>Privacy Policy</h2>
                        ${this.generatePrivacyPolicy(legalData)}
                    </div>
                    
                    <div id="terms" class="content-section">
                        <h2>Terms of Service</h2>
                        ${this.generateTermsOfService(legalData)}
                    </div>
                    
                    <div id="disclaimer" class="content-section">
                        <h2>Disclaimer</h2>
                        ${this.generateDisclaimer(legalData)}
                    </div>
                    
                    <div id="cookies" class="content-section">
                        <h2>Cookie Policy</h2>
                        ${this.generateCookiePolicy(legalData)}
                    </div>
                    
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${legalData.companyName}. All rights reserved.</p>
                        <p>For questions about this compliance page, contact: ${legalData.legalEmail || 'legal@company.com'}</p>
                    </div>
                </div>
                
                <script>
                    function showSection(sectionId) {
                        // Hide all sections
                        document.querySelectorAll('.content-section').forEach(section => {
                            section.classList.remove('active');
                        });
                        
                        // Remove active class from all tabs
                        document.querySelectorAll('.nav-tab').forEach(tab => {
                            tab.classList.remove('active');
                        });
                        
                        // Show selected section
                        document.getElementById(sectionId).classList.add('active');
                        
                        // Add active class to clicked tab
                        event.target.classList.add('active');
                    }
                </script>
            </body>
            </html>
        `;
        
        return {
            name: 'Legal Compliance',
            url: '/compliance',
            status: 'generated',
            content: complianceContent
        };
    }

    updateLegalPagesPreview(pages, compliancePage) {
        const previewContainer = document.getElementById('legal-preview-content');
        if (!previewContainer) return;
        
        let previewHTML = '<div class="legal-pages-preview">';
        previewHTML += '<h3>Generated Legal Pages</h3>';
        
        // Show the main compliance page first
        if (compliancePage) {
            previewHTML += `
                <div class="legal-page-preview-item compliance-page-highlight">
                    <h4><i class="fas fa-gavel"></i> ${compliancePage.name} (Main Page)</h4>
                    <div class="page-content-preview">
                        <strong>Complete compliance page with all legal documents in one place.</strong><br>
                        Features: Tabbed navigation, responsive design, professional styling.
                    </div>
                    <div class="page-actions">
                        <button class="btn-primary" onclick="window.adminPanel.viewFullPage('${compliancePage.name}')">
                            <i class="fas fa-eye"></i> View Compliance Page
                        </button>
                        <button class="btn-secondary" onclick="window.adminPanel.downloadPage('${compliancePage.name}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-secondary" onclick="window.adminPanel.addFooterLink()">
                            <i class="fas fa-link"></i> Add to Footer
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Show individual pages
        pages.forEach(page => {
            previewHTML += `
                <div class="legal-page-preview-item">
                    <h4>${page.name}</h4>
                    <div class="page-content-preview">
                        ${page.content.substring(0, 300)}...
                    </div>
                    <div class="page-actions">
                        <button class="btn-secondary" onclick="window.adminPanel.viewFullPage('${page.name}')">
                            <i class="fas fa-eye"></i> View Full
                        </button>
                        <button class="btn-secondary" onclick="window.adminPanel.downloadPage('${page.name}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
            `;
        });
        
        previewHTML += '</div>';
        previewContainer.innerHTML = previewHTML;
    }

    viewFullPage(pageName) {
        const legalData = this.websiteData.legal?.companyData;
        const compliancePage = this.websiteData.legal?.compliancePage;
        
        if (!legalData) return;
        
        let content = '';
        let title = pageName;
        
        if (pageName === 'Legal Compliance') {
            content = compliancePage?.content || '';
            title = 'Legal Compliance';
        } else {
            switch(pageName) {
                case 'Privacy Policy':
                    content = this.generatePrivacyPolicy(legalData);
                    break;
                case 'Terms of Service':
                    content = this.generateTermsOfService(legalData);
                    break;
                case 'Disclaimer':
                    content = this.generateDisclaimer(legalData);
                    break;
                case 'Cookie Policy':
                    content = this.generateCookiePolicy(legalData);
                    break;
            }
        }
        
        // Open in new window
        const newWindow = window.open('', '_blank');
        newWindow.document.write(content);
        newWindow.document.close();
    }

    downloadPage(pageName) {
        const legalData = this.websiteData.legal?.companyData;
        const compliancePage = this.websiteData.legal?.compliancePage;
        
        if (!legalData) return;
        
        let content = '';
        let filename = '';
        
        if (pageName === 'Legal Compliance') {
            content = compliancePage?.content || '';
            filename = 'legal-compliance.html';
        } else {
            switch(pageName) {
                case 'Privacy Policy':
                    content = this.generatePrivacyPolicy(legalData);
                    filename = 'privacy-policy.html';
                    break;
                case 'Terms of Service':
                    content = this.generateTermsOfService(legalData);
                    filename = 'terms-of-service.html';
                    break;
                case 'Disclaimer':
                    content = this.generateDisclaimer(legalData);
                    filename = 'disclaimer.html';
                    break;
                case 'Cookie Policy':
                    content = this.generateCookiePolicy(legalData);
                    filename = 'cookie-policy.html';
                    break;
            }
        }
        
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addFooterLink(pageName, pageUrl) {
        try {
            console.log('Adding footer link:', pageName, pageUrl);
            
            // Check if footer links exist in website data
            if (!this.websiteData.footer) {
                this.websiteData.footer = {};
            }
            if (!this.websiteData.footer.links) {
                this.websiteData.footer.links = [];
            }
            
            // Check if this page link already exists
            const existingLink = this.websiteData.footer.links.find(link => 
                link.text === pageName || link.url === pageUrl
            );
            
            if (existingLink) {
                // Show confirmation dialog
                const confirmOverwrite = confirm(`${pageName} link already exists in footer. Do you want to overwrite it?`);
                if (confirmOverwrite) {
                    // Remove existing link
                    this.websiteData.footer.links = this.websiteData.footer.links.filter(link => 
                        link.text !== pageName && link.url !== pageUrl
                    );
                } else {
                    this.showMessage(`${pageName} link already exists in footer!`, 'warning');
                    return;
                }
            }
            
            // Add page link to footer
            this.websiteData.footer.links.push({
                text: pageName,
                url: pageUrl,
                type: 'page',
                newTab: false
            });
            
            // Reload footer links in admin panel
            this.loadFooterLinks();
            
            // Save to database
            this.saveChanges();
            
            // Update preview
            this.updateFooterPreview();
            
            this.showMessage(`${pageName} link added to footer successfully!`, 'success');
            
        } catch (error) {
            console.error('Error adding footer link:', error);
            this.showMessage('Failed to add footer link!', 'error');
        }
    }
    
    initializeFooterLinks() {
        const addFooterLinkBtn = document.getElementById('add-footer-link');
        if (addFooterLinkBtn) {
            addFooterLinkBtn.addEventListener('click', () => this.addCustomFooterLink());
        }
        
        // Load existing footer links
        this.loadFooterLinks();
    }
    
    addCustomFooterLink() {
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) return;
        
        const linkIndex = footerLinksList.children.length;
        const linkItem = document.createElement('div');
        linkItem.className = 'footer-link-item';
        linkItem.innerHTML = `
            <button type="button" class="remove-footer-link" onclick="adminPanel.removeFooterLink(${linkIndex})">
                <i class="fas fa-trash"></i>
            </button>
            <h5>Footer Link ${linkIndex + 1}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Text</label>
                    <input type="text" class="footer-link-text" value="New Link" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Link Type</label>
                    <select class="footer-link-type" data-index="${linkIndex}">
                        <option value="page">Page</option>
                        <option value="external">External URL</option>
                        <option value="anchor">Page Anchor</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Link Target</label>
                    <input type="text" class="footer-link-target" value="#" placeholder="#section or https://example.com" data-index="${linkIndex}">
                </div>
                <div class="form-group">
                    <label>Open in New Tab</label>
                    <input type="checkbox" class="footer-link-new-tab" data-index="${linkIndex}">
                </div>
            </div>
        `;
        
        footerLinksList.appendChild(linkItem);
        
        // Add event listeners
        linkItem.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                this.collectFooterData();
                this.updateFooterPreview();
            });
            input.addEventListener('change', () => {
                this.collectFooterData();
                this.updateFooterPreview();
            });
        });
    }
    
    removeFooterLink(index) {
        const footerLinksList = document.getElementById('footer-links-list');
        if (footerLinksList && footerLinksList.children[index]) {
            footerLinksList.children[index].remove();
            this.collectFooterData();
            this.updateFooterPreview();
        }
    }
    
    loadFooterLinks() {
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) return;
        
        console.log('Loading footer links...');
        
        // Clear existing links
        footerLinksList.innerHTML = '';
        
        // Load from website data if available
        if (this.websiteData.footer && this.websiteData.footer.links && this.websiteData.footer.links.length > 0) {
            console.log('Found footer links:', this.websiteData.footer.links);
            this.websiteData.footer.links.forEach((link, index) => {
                this.addCustomFooterLink();
                const linkItem = footerLinksList.children[index];
                if (linkItem) {
                    linkItem.querySelector('.footer-link-text').value = link.text || 'Link';
                    linkItem.querySelector('.footer-link-type').value = link.type || 'page';
                    linkItem.querySelector('.footer-link-target').value = link.url || '#';
                    linkItem.querySelector('.footer-link-new-tab').checked = link.newTab || false;
                }
            });
        } else {
            console.log('No footer links found in website data');
        }
    }
    
    loadDefaultFooterLinks() {
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) return;
        
        console.log('Loading default footer links...');
        
        // Clear existing links
        footerLinksList.innerHTML = '';
        
        // Add default links (original footer links)
        const defaultLinks = [
            { text: 'Disclaimer', url: '/disclaimer.html', type: 'page', newTab: false },
            { text: 'Terms', url: '/terms.html', type: 'page', newTab: false }
        ];
        
        defaultLinks.forEach((link, index) => {
            this.addCustomFooterLink();
            const linkItem = footerLinksList.children[index];
            if (linkItem) {
                linkItem.querySelector('.footer-link-text').value = link.text;
                linkItem.querySelector('.footer-link-type').value = link.type;
                linkItem.querySelector('.footer-link-target').value = link.url;
                linkItem.querySelector('.footer-link-new-tab').checked = link.newTab;
            }
        });
        
        console.log('Default footer links loaded');
    }
    
    loadAllFooterLinks(customLinks) {
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) return;
        
        console.log('Loading all footer links. Custom links:', customLinks);
        
        // Clear existing links
        footerLinksList.innerHTML = '';
        
        // Default links that should always be present
        const defaultLinks = [
            { text: 'Disclaimer', url: '/disclaimer.html', type: 'page', newTab: false },
            { text: 'Terms', url: '/terms.html', type: 'page', newTab: false }
        ];
        
        // Combine default and custom links, avoiding duplicates
        const allLinks = [...defaultLinks];
        
        // Add custom links that aren't duplicates
        if (customLinks && customLinks.length > 0) {
            customLinks.forEach(customLink => {
                const isDuplicate = defaultLinks.some(defaultLink => 
                    defaultLink.text === customLink.text || defaultLink.url === customLink.url
                );
                if (!isDuplicate) {
                    allLinks.push(customLink);
                }
            });
        }
        
        console.log('All links to load:', allLinks);
        
        // Create all link items first
        allLinks.forEach((link, index) => {
            this.addCustomFooterLink();
        });
        
        // Then populate the values
        allLinks.forEach((link, index) => {
            const linkItem = footerLinksList.children[index];
            if (linkItem) {
                const textInput = linkItem.querySelector('.footer-link-text');
                const typeInput = linkItem.querySelector('.footer-link-type');
                const targetInput = linkItem.querySelector('.footer-link-target');
                const newTabInput = linkItem.querySelector('.footer-link-new-tab');
                
                if (textInput) textInput.value = link.text;
                if (typeInput) typeInput.value = link.type || 'page';
                if (targetInput) targetInput.value = link.url;
                if (newTabInput) newTabInput.checked = link.newTab || false;
            }
        });
        
        console.log('All footer links loaded');
    }
    
    initializeFooterLogo() {
        console.log('Initializing footer logo...');
        
        // Logo source selector
        const logoSource = document.getElementById('footer-logo-source');
        if (logoSource) {
            console.log('Logo source selector found');
            logoSource.addEventListener('change', (e) => this.handleFooterLogoSourceChange(e));
        } else {
            console.log('Logo source selector NOT found');
        }
        
        // Logo upload
        const logoUpload = document.getElementById('footer-logo-upload');
        if (logoUpload) {
            console.log('Logo upload found');
            logoUpload.addEventListener('change', (e) => this.handleFooterLogoUpload(e));
        } else {
            console.log('Logo upload NOT found');
        }
        
        // Logo URL input
        const logoUrl = document.getElementById('footer-logo-url');
        if (logoUrl) {
            console.log('Logo URL input found');
            logoUrl.addEventListener('input', (e) => this.handleFooterLogoUrlChange(e));
        } else {
            console.log('Logo URL input NOT found');
        }
        
        // Remove logo button
        const removeLogoBtn = document.getElementById('remove-footer-logo');
        if (removeLogoBtn) {
            console.log('Remove logo button found');
            removeLogoBtn.addEventListener('click', () => this.removeFooterLogo());
        } else {
            console.log('Remove logo button NOT found');
        }
        
        // Test URL toggle button
        const testUrlToggle = document.getElementById('test-url-toggle');
        if (testUrlToggle) {
            console.log('Test URL toggle button found');
            testUrlToggle.addEventListener('click', () => {
                console.log('Test URL toggle clicked');
                const logoSource = document.getElementById('footer-logo-source');
                const uploadSection = document.getElementById('footer-logo-upload-section');
                const urlSection = document.getElementById('footer-logo-url-section');
                
                console.log('Current source value:', logoSource.value);
                console.log('Upload section display:', uploadSection.style.display);
                console.log('URL section display:', urlSection.style.display);
                
                // Force toggle to URL
                logoSource.value = 'url';
                uploadSection.style.display = 'none';
                urlSection.style.display = 'block';
                
                console.log('After toggle - Upload section display:', uploadSection.style.display);
                console.log('After toggle - URL section display:', urlSection.style.display);
            });
        } else {
            console.log('Test URL toggle button NOT found');
        }
        
        // Test social media button
        const testSocialMedia = document.getElementById('test-social-media');
        if (testSocialMedia) {
            console.log('Test social media button found');
            testSocialMedia.addEventListener('click', async () => {
                console.log('Test social media clicked');
                
                // Set test social media values
                const linkedinInput = document.getElementById('footer-linkedin');
                const facebookInput = document.getElementById('footer-facebook');
                const twitterInput = document.getElementById('footer-twitter');
                const instagramInput = document.getElementById('footer-instagram');
                
                if (linkedinInput) linkedinInput.value = 'https://linkedin.com/in/test';
                if (facebookInput) facebookInput.value = 'https://facebook.com/test';
                if (twitterInput) twitterInput.value = 'https://twitter.com/test';
                if (instagramInput) instagramInput.value = 'https://instagram.com/test';
                
                console.log('Set test social media values');
                
                // Trigger change events to update the data
                if (linkedinInput) linkedinInput.dispatchEvent(new Event('input', { bubbles: true }));
                if (facebookInput) facebookInput.dispatchEvent(new Event('input', { bubbles: true }));
                if (twitterInput) twitterInput.dispatchEvent(new Event('input', { bubbles: true }));
                if (instagramInput) instagramInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Collect footer data
                const footerData = this.collectFooterData();
                console.log('Collected footer data:', footerData);
                
                // Save to database directly
                try {
                    const { data, error } = await this.supabase
                        .from('website_content')
                        .upsert({
                            section_name: 'footer',
                            content: footerData
                        }, {
                            onConflict: 'section_name'
                        });
                    
                    if (error) {
                        console.error('Error saving footer data:', error);
                    } else {
                        console.log('Footer data saved to database successfully');
                    }
                } catch (error) {
                    console.error('Error saving footer data:', error);
                }
                
                // Update main website
                this.updateMainWebsite();
                
                // Force refresh the website
                setTimeout(() => {
                    if (window.refreshWebsiteContent) {
                        window.refreshWebsiteContent();
                        console.log('Website refreshed after social media test');
                    }
                }, 1000);
                
                console.log('Test social media data saved and website updated');
            });
        } else {
            console.log('Test social media button NOT found');
        }
        
        // Debug footer database button
        const debugFooterDb = document.getElementById('debug-footer-db');
        if (debugFooterDb) {
            console.log('Debug footer DB button found');
            debugFooterDb.addEventListener('click', async () => {
                console.log('Debug footer DB clicked');
                
                try {
                    const { data, error } = await this.supabase
                        .from('website_content')
                        .select('*')
                        .eq('section_name', 'footer');
                    
                    if (error) {
                        console.error('Error fetching footer data:', error);
                    } else {
                        console.log('Footer data from database:', data);
                        if (data && data.length > 0) {
                            console.log('Footer content:', data[0].content);
                        } else {
                            console.log('No footer data found in database');
                        }
                    }
                } catch (error) {
                    console.error('Error in debug footer DB:', error);
                }
            });
        } else {
            console.log('Debug footer DB button NOT found');
        }
    }
    
    initializeFooterDragAndDrop() {
        console.log('Initializing footer drag and drop...');
        
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) {
            console.log('Footer links list not found');
            return;
        }
        
        let draggedItem = null;
        let draggedIndex = null;
        
        // Add drag event listeners to all footer link items
        const addDragListeners = () => {
            const linkItems = footerLinksList.querySelectorAll('.footer-link-item');
            linkItems.forEach((item, index) => {
                item.setAttribute('draggable', true);
                
                item.addEventListener('dragstart', (e) => {
                    draggedItem = item;
                    draggedIndex = index;
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    console.log('Started dragging item:', index);
                });
                
                item.addEventListener('dragend', (e) => {
                    item.classList.remove('dragging');
                    draggedItem = null;
                    draggedIndex = null;
                    console.log('Stopped dragging');
                });
                
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });
                
                item.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    if (item !== draggedItem) {
                        item.classList.add('drag-over');
                    }
                });
                
                item.addEventListener('dragleave', (e) => {
                    if (item !== draggedItem) {
                        item.classList.remove('drag-over');
                    }
                });
                
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    item.classList.remove('drag-over');
                    
                    if (draggedItem && draggedItem !== item) {
                        const dropIndex = index;
                        console.log(`Dropped item ${draggedIndex} at position ${dropIndex}`);
                        
                        // Reorder the items
                        if (draggedIndex < dropIndex) {
                            footerLinksList.insertBefore(draggedItem, item.nextSibling);
                        } else {
                            footerLinksList.insertBefore(draggedItem, item);
                        }
                        
                        // Update the order in the database
                        this.updateFooterLinksOrder();
                    }
                });
            });
        };
        
        // Initial setup
        addDragListeners();
        
        // Re-setup after adding new links
        const originalAddCustomFooterLink = this.addCustomFooterLink.bind(this);
        this.addCustomFooterLink = function() {
            const result = originalAddCustomFooterLink();
            setTimeout(() => {
                addDragListeners();
            }, 100);
            return result;
        };
    }
    
    updateFooterLinksOrder() {
        console.log('Updating footer links order...');
        
        const footerLinksList = document.getElementById('footer-links-list');
        if (!footerLinksList) return;
        
        const linkItems = footerLinksList.querySelectorAll('.footer-link-item');
        const links = [];
        
        linkItems.forEach(item => {
            const textInput = item.querySelector('.footer-link-text');
            const typeInput = item.querySelector('.footer-link-type');
            const targetInput = item.querySelector('.footer-link-target');
            const newTabInput = item.querySelector('.footer-link-new-tab');
            
            if (textInput && targetInput) {
                links.push({
                    text: textInput.value,
                    url: targetInput.value,
                    type: typeInput ? typeInput.value : 'page',
                    newTab: newTabInput ? newTabInput.checked : false
                });
            }
        });
        
        console.log('New footer links order:', links);
        
        // Update the footer data
        if (!this.websiteData.footer) {
            this.websiteData.footer = {};
        }
        this.websiteData.footer.links = links;
        
        // Save to database
        this.saveChanges();
        this.updateFooterPreview();
    }
    
    handleFooterLogoSourceChange(event) {
        const source = event.target.value;
        const uploadSection = document.getElementById('footer-logo-upload-section');
        const urlSection = document.getElementById('footer-logo-url-section');
        
        console.log('Logo source changed to:', source);
        
        if (source === 'upload') {
            uploadSection.style.display = 'block';
            urlSection.style.display = 'none';
        } else if (source === 'url') {
            uploadSection.style.display = 'none';
            urlSection.style.display = 'block';
        }
        
        console.log('Upload section display:', uploadSection.style.display);
        console.log('URL section display:', urlSection.style.display);
    }
    
    handleFooterLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('Processing footer logo upload:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            this.updateFooterLogoPreview(logoData);
            this.collectFooterData();
            this.updateFooterPreview();
        };
        reader.readAsDataURL(file);
    }
    
    handleFooterLogoUrlChange(event) {
        const url = event.target.value;
        if (url) {
            this.updateFooterLogoPreview(url);
            this.collectFooterData();
            this.updateFooterPreview();
        }
    }
    
    updateFooterLogoPreview(logoData) {
        const logoImg = document.getElementById('footer-logo-img');
        const removeBtn = document.getElementById('remove-footer-logo');
        
        if (logoImg) {
            logoImg.src = logoData;
            logoImg.style.display = 'block';
            
            // Handle SVG files properly
            if (logoData.includes('svg') || logoData.includes('data:image/svg')) {
                logoImg.style.filter = 'none';
                logoImg.style.maxHeight = '40px';
                logoImg.style.width = 'auto';
                logoImg.style.objectFit = 'contain';
            } else {
                logoImg.style.maxHeight = '40px';
                logoImg.style.width = 'auto';
                logoImg.style.objectFit = 'contain';
            }
            
            // Auto-resize large images
            logoImg.onload = function() {
                const maxHeight = 40;
                const maxWidth = 120;
                
                if (this.naturalHeight > maxHeight || this.naturalWidth > maxWidth) {
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    
                    if (aspectRatio > 1) {
                        // Wider image
                        this.style.width = maxWidth + 'px';
                        this.style.height = 'auto';
                    } else {
                        // Taller image
                        this.style.height = maxHeight + 'px';
                        this.style.width = 'auto';
                    }
                }
                
                this.style.objectFit = 'contain';
                this.style.maxHeight = maxHeight + 'px';
                this.style.maxWidth = maxWidth + 'px';
            };
            
            if (removeBtn) {
                removeBtn.style.display = 'block';
            }
        }
        
        console.log('Footer logo preview updated with:', logoData);
    }
    
    removeFooterLogo() {
        const logoImg = document.getElementById('footer-logo-img');
        const removeBtn = document.getElementById('remove-footer-logo');
        const logoUrl = document.getElementById('footer-logo-url');
        const logoUpload = document.getElementById('footer-logo-upload');
        
        if (logoImg) {
            logoImg.src = '';
            logoImg.style.display = 'none';
        }
        
        if (removeBtn) {
            removeBtn.style.display = 'none';
        }
        
        if (logoUrl) {
            logoUrl.value = '';
        }
        
        if (logoUpload) {
            logoUpload.value = '';
        }
        
        this.collectFooterData();
        this.updateFooterPreview();
    }
    
    bindFooterHandlers() {
        const footerInputs = [
            'footer-copyright', 'footer-description'
        ];
        
        footerInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.collectFooterData();
                    this.updateFooterPreview();
                });
            }
        });
        
        // Add character count for description
        const descriptionInput = document.getElementById('footer-description');
        const descriptionCount = document.getElementById('footer-description-count');
        if (descriptionInput && descriptionCount) {
            descriptionInput.addEventListener('input', () => {
                descriptionCount.textContent = descriptionInput.value.length;
            });
        }
        

        
        // Initialize drag and drop for footer links
        this.initializeFooterDragAndDrop();
        
        // Initialize contact form functionality
        this.initializeContactForm();
    }
    
    initializeContactForm() {
        console.log('Initializing contact form...');
        
        // Contact form type change handler
        const contactFormType = document.getElementById('contact-form-type');
        if (contactFormType) {
            contactFormType.addEventListener('change', (e) => {
                this.handleContactFormTypeChange(e.target.value);
            });
        }
        
        // Bind all contact form inputs
        const contactInputs = [
            'contact-title', 'contact-subtitle',
            'simple-form-title', 'simple-success-message', 'simple-store-db',
            'autoresponder-code', 'autoresponder-form-title',
            'email-recipient', 'email-subject', 'email-form-title',
            'google-form-url', 'google-form-title',
            'contact-email', 'contact-phone', 'contact-location',
            'contact-linkedin', 'contact-facebook', 'contact-twitter', 'contact-instagram'
        ];
        
        contactInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateContactPreview();
                });
                input.addEventListener('change', () => {
                    this.updateContactPreview();
                });
            }
        });
        
        // Custom contact links
        const addCustomLinkBtn = document.getElementById('add-custom-contact-link');
        if (addCustomLinkBtn) {
            addCustomLinkBtn.addEventListener('click', () => {
                this.addCustomContactLink();
            });
        }
        
        // Load existing contact data
        this.loadContactData();
    }
    
    handleContactFormTypeChange(formType) {
        console.log('Contact form type changed to:', formType);
        
        // Hide all form configs
        const formConfigs = ['simple-form-config', 'autoresponder-form-config', 'email-form-config', 'google-form-config'];
        formConfigs.forEach(configId => {
            const config = document.getElementById(configId);
            if (config) {
                config.style.display = 'none';
            }
        });
        
        // Show selected form config
        const selectedConfig = document.getElementById(`${formType}-form-config`);
        if (selectedConfig) {
            selectedConfig.style.display = 'block';
        }
        
        this.updateContactPreview();
    }
    
    addCustomContactLink() {
        const container = document.getElementById('custom-contact-links');
        if (!container) return;
        
        const linkIndex = container.children.length;
        const linkDiv = document.createElement('div');
        linkDiv.className = 'custom-contact-link-item';
        linkDiv.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Link Text</label>
                    <input type="text" class="custom-link-text" placeholder="Custom Link">
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="url" class="custom-link-url" placeholder="https://...">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Logo (Optional)</label>
                    <input type="file" class="custom-link-logo" accept="image/*">
                </div>
                <div class="form-group">
                    <button type="button" class="btn-danger remove-custom-link">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(linkDiv);
        
        // Add remove functionality
        const removeBtn = linkDiv.querySelector('.remove-custom-link');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                linkDiv.remove();
                this.updateContactPreview();
            });
        }
        
        // Add input change handlers
        const inputs = linkDiv.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateContactPreview();
            });
        });
        
        this.updateContactPreview();
    }
    
    loadContactData() {
        console.log('Loading contact data...');
        
        if (!this.websiteData.contact) {
            console.log('No contact data found, using defaults');
            return;
        }
        
        const contact = this.websiteData.contact;
        
        // Load form type
        const formType = document.getElementById('contact-form-type');
        if (formType && contact.formType) {
            formType.value = contact.formType;
            this.handleContactFormTypeChange(contact.formType);
        }
        
        // Load form configurations
        if (contact.simpleForm) {
            document.getElementById('simple-form-title').value = contact.simpleForm.title || 'Send a Message';
            document.getElementById('simple-success-message').value = contact.simpleForm.successMessage || 'Thank you! Your message has been sent successfully.';
            document.getElementById('simple-store-db').checked = contact.simpleForm.storeInDb !== false;
        }
        
        if (contact.autoresponderForm) {
            document.getElementById('autoresponder-code').value = contact.autoresponderForm.code || '';
            document.getElementById('autoresponder-form-title').value = contact.autoresponderForm.title || 'Contact Us';
        }
        
        if (contact.emailForm) {
            document.getElementById('email-recipient').value = contact.emailForm.recipient || '';
            document.getElementById('email-subject').value = contact.emailForm.subject || 'New Contact Form Submission';
            document.getElementById('email-form-title').value = contact.emailForm.title || 'Send Email';
        }
        
        if (contact.googleForm) {
            document.getElementById('google-form-url').value = contact.googleForm.url || '';
            document.getElementById('google-form-title').value = contact.googleForm.title || 'Contact Form';
        }
        
        // Load contact details
        document.getElementById('contact-title').value = contact.title || 'Let\'s Get In Touch';
        document.getElementById('contact-subtitle').value = contact.subtitle || 'Ready to start a conversation? Drop me a line and I\'ll get back to you as soon as possible.';
        document.getElementById('contact-email').value = contact.email || 'hello@soumita.space';
        document.getElementById('contact-phone').value = contact.phone || '+91 98765 43210';
        document.getElementById('contact-location').value = contact.location || 'Kolkata, India';
        
        // Load social media
        document.getElementById('contact-linkedin').value = contact.linkedin || 'https://www.linkedin.com/in/soumita-chatterjee';
        document.getElementById('contact-facebook').value = contact.facebook || '';
        document.getElementById('contact-twitter').value = contact.twitter || '';
        document.getElementById('contact-instagram').value = contact.instagram || '';
        
        // Load custom links
        if (contact.customLinks && contact.customLinks.length > 0) {
            const container = document.getElementById('custom-contact-links');
            if (container) {
                container.innerHTML = '';
                contact.customLinks.forEach(link => {
                    // Add custom link functionality here
                });
            }
        }
        
        this.updateContactPreview();
    }
    
    updateContactPreview() {
        const previewContainer = document.querySelector('.contact-preview-content');
        if (!previewContainer) return;
        
        const contactData = this.collectContactData();
        
        let formHtml = '';
        let detailsHtml = '';
        
        // Generate form HTML based on type
        switch (contactData.formType) {
            case 'simple':
                formHtml = this.generateSimpleFormHtml(contactData.simpleForm);
                break;
            case 'autoresponder':
                formHtml = this.generateAutoresponderFormHtml(contactData.autoresponderForm);
                break;
            case 'email':
                formHtml = this.generateEmailFormHtml(contactData.emailForm);
                break;
            case 'google':
                formHtml = this.generateGoogleFormHtml(contactData.googleForm);
                break;
        }
        
        // Generate contact details HTML
        detailsHtml = this.generateContactDetailsHtml(contactData);
        
        previewContainer.innerHTML = `
            <div class="contact-preview">
                <div class="contact-header-preview">
                    <h2 class="contact-title">${contactData.title}</h2>
                    <p class="contact-subtitle">${contactData.subtitle}</p>
                </div>
                <div class="contact-form-preview">
                    <h3>${contactData.formTitle || 'Contact Form'}</h3>
                    ${formHtml}
                </div>
                <div class="contact-details-preview">
                    <h3>Contact Details</h3>
                    ${detailsHtml}
                </div>
            </div>
        `;
    }
    
    generateSimpleFormHtml(simpleForm) {
        return `
            <form class="contact-form" id="simple-contact-form">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Your Email" required>
                </div>
                <div class="form-group">
                    <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn-primary">Send Message</button>
            </form>
        `;
    }
    
    generateAutoresponderFormHtml(autoresponderForm) {
        // Extract form from autoresponder code
        const formCode = autoresponderForm.code || '';
        const formMatch = formCode.match(/<form[^>]*>[\s\S]*?<\/form>/i);
        
        if (formMatch) {
            return formMatch[0];
        }
        
        return `
            <form class="contact-form">
                <div class="form-group">
                    <input type="text" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" placeholder="Your Email" required>
                </div>
                <button type="submit" class="btn-primary">Submit</button>
            </form>
        `;
    }
    
    generateEmailFormHtml(emailForm) {
        return `
            <form class="contact-form" id="email-contact-form">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Your Email" required>
                </div>
                <div class="form-group">
                    <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn-primary">Send Email</button>
            </form>
            <script>
                document.getElementById('email-contact-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const name = formData.get('name');
                    const email = formData.get('email');
                    const message = formData.get('message');
                    const recipient = '${emailForm.recipient || ''}';
                    
                    if (!recipient) {
                        alert('Please configure recipient email in admin panel');
                        return;
                    }
                    
                    // Create mailto link with form data
                    const mailtoLink = \`mailto:\${recipient}?subject=Contact Form Submission from \${name}&body=Name: \${name}%0D%0AEmail: \${email}%0D%0A%0D%0AMessage:%0D%0A\${message}\`;
                    
                    // Open email client
                    window.open(mailtoLink, '_blank');
                    
                    // Show success message
                    alert('Email client opened! Please send the email manually.');
                    
                    // Reset form
                    this.reset();
                });
            </script>
        `;
    }
    
    generateGoogleFormHtml(googleForm) {
        const formUrl = googleForm.url || '';
        if (formUrl) {
            return `
                <iframe src="${formUrl}" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0">
                    Loading...
                </iframe>
            `;
        }
        
        return '<p>Please enter a valid Google Form URL</p>';
    }
    
    generateContactDetailsHtml(contactData) {
        let detailsHtml = '';
        
        // Email
        if (contactData.email) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="email">
                    <div class="contact-detail-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Email</span>
                        <a href="mailto:${contactData.email}" class="contact-email">${contactData.email}</a>
                    </div>
                </div>
            `;
        }
        
        // Phone
        if (contactData.phone) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="phone">
                    <div class="contact-detail-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Phone</span>
                        <a href="tel:${contactData.phone}" class="contact-phone">${contactData.phone}</a>
                    </div>
                </div>
            `;
        }
        
        // Location
        if (contactData.location) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="location">
                    <div class="contact-detail-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Location</span>
                        <span class="contact-location">${contactData.location}</span>
                    </div>
                </div>
            `;
        }
        
        // Social media links
        if (contactData.linkedin) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="linkedin">
                    <div class="contact-detail-icon">
                        <i class="fab fa-linkedin"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>LinkedIn</span>
                        <a href="${contactData.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-linkedin">Connect Professionally</a>
                    </div>
                </div>
            `;
        }
        
        if (contactData.facebook) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="facebook">
                    <div class="contact-detail-icon">
                        <i class="fab fa-facebook"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Facebook</span>
                        <a href="${contactData.facebook}" target="_blank" rel="noopener noreferrer" class="contact-facebook">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        if (contactData.twitter) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="twitter">
                    <div class="contact-detail-icon">
                        <i class="fab fa-twitter"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>X (Twitter)</span>
                        <a href="${contactData.twitter}" target="_blank" rel="noopener noreferrer" class="contact-twitter">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        if (contactData.instagram) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="instagram">
                    <div class="contact-detail-icon">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Instagram</span>
                        <a href="${contactData.instagram}" target="_blank" rel="noopener noreferrer" class="contact-instagram">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        return detailsHtml;
    }
    
    collectContactData() {
        const contactData = {
            title: document.getElementById('contact-title')?.value || 'Let\'s Get In Touch',
            subtitle: document.getElementById('contact-subtitle')?.value || 'Ready to start a conversation? Drop me a line and I\'ll get back to you as soon as possible.',
            formType: document.getElementById('contact-form-type')?.value || 'simple',
            email: document.getElementById('contact-email')?.value || '',
            phone: document.getElementById('contact-phone')?.value || '',
            location: document.getElementById('contact-location')?.value || '',
            linkedin: document.getElementById('contact-linkedin')?.value || '',
            facebook: document.getElementById('contact-facebook')?.value || '',
            twitter: document.getElementById('contact-twitter')?.value || '',
            instagram: document.getElementById('contact-instagram')?.value || '',
            customLinks: []
        };
        
        // Collect form-specific data
        switch (contactData.formType) {
            case 'simple':
                contactData.simpleForm = {
                    title: document.getElementById('simple-form-title')?.value || 'Send a Message',
                    successMessage: document.getElementById('simple-success-message')?.value || 'Thank you! Your message has been sent successfully.',
                    storeInDb: document.getElementById('simple-store-db')?.checked || false
                };
                break;
            case 'autoresponder':
                contactData.autoresponderForm = {
                    code: document.getElementById('autoresponder-code')?.value || '',
                    title: document.getElementById('autoresponder-form-title')?.value || 'Contact Us'
                };
                break;
            case 'email':
                contactData.emailForm = {
                    recipient: document.getElementById('email-recipient')?.value || '',
                    subject: document.getElementById('email-subject')?.value || 'New Contact Form Submission',
                    title: document.getElementById('email-form-title')?.value || 'Send Email'
                };
                break;
            case 'google':
                contactData.googleForm = {
                    url: document.getElementById('google-form-url')?.value || '',
                    title: document.getElementById('google-form-title')?.value || 'Contact Form'
                };
                break;
        }
        
        // Collect custom links
        const customLinksContainer = document.getElementById('custom-contact-links');
        if (customLinksContainer) {
            const customLinkItems = customLinksContainer.querySelectorAll('.custom-contact-link-item');
            customLinkItems.forEach(item => {
                const text = item.querySelector('.custom-link-text')?.value || '';
                const url = item.querySelector('.custom-link-url')?.value || '';
                const logo = item.querySelector('.custom-link-logo')?.files[0];
                
                if (text && url) {
                    contactData.customLinks.push({
                        text,
                        url,
                        logo: logo ? URL.createObjectURL(logo) : null
                    });
                }
            });
        }
        
        return contactData;
    }
    
    loadFooterData() {
        console.log('Loading footer data...');
        console.log('Website data footer:', this.websiteData.footer);
        
        // Set default values based on original footer
        const defaultCopyright = '© 2025 Soumita Chatterjee. All Rights Reserved.';
        const defaultDescription = 'Soumita.Space';
        const defaultLogo = 'https://anwe.sh/work/sclogo1.png';
        
        if (!this.websiteData.footer) {
            console.log('No footer data found, using defaults');
            // Set default values
            document.getElementById('footer-copyright').value = defaultCopyright;
            document.getElementById('footer-description').value = defaultDescription;
            document.getElementById('footer-linkedin').value = '';
            document.getElementById('footer-facebook').value = '';
            document.getElementById('footer-twitter').value = '';
            document.getElementById('footer-instagram').value = '';
            
            // Load default logo
            this.updateFooterLogoPreview(defaultLogo);
            
            // Load default links only
            this.loadAllFooterLinks([]);
            
            // Update preview
            this.updateFooterPreview();
            return;
        }
        
        const footer = this.websiteData.footer;
        
        // Load footer content
        document.getElementById('footer-copyright').value = footer.copyright || defaultCopyright;
        document.getElementById('footer-description').value = footer.description || defaultDescription;
        

        
        // Load footer logo
        if (footer.logo) {
            console.log('Loading footer logo:', footer.logo);
            this.updateFooterLogoPreview(footer.logo);
        } else {
            // Load default logo if none exists
            this.updateFooterLogoPreview(defaultLogo);
        }
        
        // Load all footer links (default + custom)
        this.loadAllFooterLinks(footer.links || []);
        
        // Update preview
        this.updateFooterPreview();
    }
    
    collectFooterData() {
        console.log('Collecting footer data...');
        
        const footerData = {
            copyright: document.getElementById('footer-copyright')?.value || '',
            description: document.getElementById('footer-description')?.value || '',
            logo: document.getElementById('footer-logo-img')?.src || '',
            links: []
        };
        
        console.log('Collected footer data:', footerData);
        
        // Collect footer links
        document.querySelectorAll('#footer-links-list .footer-link-item').forEach((item, index) => {
            const linkData = {
                text: item.querySelector('.footer-link-text')?.value || 'Link',
                url: item.querySelector('.footer-link-target')?.value || '#',
                type: item.querySelector('.footer-link-type')?.value || 'page',
                newTab: item.querySelector('.footer-link-new-tab')?.checked || false
            };
            footerData.links.push(linkData);
        });
        
        console.log('Collected footer data:', footerData);
        this.websiteData.footer = footerData;
        

        
        return footerData;
    }
    
    updateFooterPreview() {
        const previewContainer = document.querySelector('.footer-preview-content');
        if (!previewContainer) {
            console.log('Footer preview container not found');
            return;
        }
        
        console.log('Updating footer preview...');
        const footerData = this.collectFooterData();
        
        // Get original links and custom links
        const originalLinks = [
            { text: 'Disclaimer', url: '/disclaimer.html' },
            { text: 'Terms', url: '/terms.html' }
        ];
        
        let allLinks = [...originalLinks];
        if (footerData.links && footerData.links.length > 0) {
            allLinks = [...originalLinks, ...footerData.links];
        }
        
        let linksHtml = '';
        if (allLinks.length > 0) {
            linksHtml = allLinks.map(link => 
                `<a href="${link.url}" ${link.newTab ? 'target="_blank" rel="noopener"' : ''}>${link.text}</a>`
            ).join('');
        }
        
        previewContainer.innerHTML = `
            <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
                <defs><linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8e6ee6" /><stop offset="100%" style="stop-color:#ffa726" /></linearGradient></defs>
            </svg>
            <div class="footer-preview">
                <div class="footer-left">
                    ${footerData.logo ? `<a href="#home"><img src="${footerData.logo}" alt="Logo" style="height: 30px; margin-right: 10px; ${footerData.logo.includes('svg') ? 'filter: none;' : ''}"></a>` : ''}
                    <span>${footerData.description}</span>
                </div>
                <div class="footer-center">
                    <p>${footerData.copyright}</p>
                </div>
                <div class="footer-right">
                    <div class="footer-legal">
                        ${linksHtml}
                    </div>
                    <div class="footer-credits">
                        <p>Created with <svg class="gradient-heart" viewBox="0 0 24 24" aria-hidden="true" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><path class="heart-fill" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" style="fill: url(#heart-gradient);"/></svg> by <a href="https://anwe.sh" target="_blank" rel="noopener noreferrer">Anwesh</a></p>
                    </div>
                </div>

            </div>
        `;
        
        console.log('Footer preview updated');
    }

    // Credentials Handlers
    bindCredentialsHandlers() {
        const updateBtn = document.getElementById('update-credentials');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updateCredentials();
            });
        }

        const credentialInputs = [
            'new-username', 'current-password', 'new-password', 'confirm-password',
            'enable-2fa', 'session-timeout', 'login-notifications'
        ];

        credentialInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.validatePasswordStrength();
                });
            }
        });
    }

    validatePasswordStrength() {
        const newPassword = document.getElementById('new-password')?.value || '';
        const confirmPassword = document.getElementById('confirm-password')?.value || '';
        
        const requirements = {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /\d/.test(newPassword),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
            match: newPassword === confirmPassword
        };

        // Update UI to show password strength
        const updateBtn = document.getElementById('update-credentials');
        if (updateBtn) {
            const allValid = Object.values(requirements).every(req => req);
            updateBtn.disabled = !allValid;
            updateBtn.style.opacity = allValid ? '1' : '0.5';
        }
    }

    async updateCredentials() {
        const currentPassword = document.getElementById('current-password')?.value || '';
        const newUsername = document.getElementById('new-username')?.value || '';
        const newPassword = document.getElementById('new-password')?.value || '';
        const confirmPassword = document.getElementById('confirm-password')?.value || '';

        // Validate current password
        if (currentPassword !== 'soumita2024') {
            this.showMessage('Current password is incorrect!', 'error');
            return;
        }

        // Validate new password
        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match!', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showMessage('Password must be at least 8 characters long!', 'error');
            return;
        }

        // Update credentials
        try {
            // In a real app, you'd update the database
            // For now, we'll just show a success message
            this.showMessage('Credentials updated successfully!', 'success');
            
            // Clear form
            document.getElementById('new-username').value = '';
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            
        } catch (error) {
            this.showMessage('Failed to update credentials!', 'error');
        }
    }

    // Function to handle custom theme navigation mode (for future implementation)
    enableCustomNavigationMode() {
        const themeNotice = document.getElementById('theme-notice');
        if (themeNotice) {
            themeNotice.style.display = 'none';
        }
        
        // TODO: Show all navigation customization options when custom theme is selected
        console.log('Custom theme navigation mode enabled');
    }
    
    // Professional Highlights Management
    initializeHighlights() {
        const addHighlightBtn = document.getElementById('add-highlight');
        if (addHighlightBtn) {
            addHighlightBtn.addEventListener('click', () => this.addHighlight());
        }
        
        // Load existing highlights
        this.loadHighlights();
    }
    
    addHighlight() {
        const highlightsList = document.getElementById('highlights-list');
        if (!highlightsList) return;
        
        const highlightIndex = highlightsList.children.length;
        const highlightItem = document.createElement('div');
        highlightItem.className = 'highlight-item';
        highlightItem.innerHTML = `
            <button type="button" class="remove-highlight" onclick="adminPanel.removeHighlight(${highlightIndex})">
                <i class="fas fa-trash"></i>
            </button>
            <h5>Professional Highlight ${highlightIndex + 1}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Number/Value</label>
                    <input type="text" class="highlight-number" value="200" placeholder="e.g., 200, 7, 98">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" class="highlight-description" value="Students Guided" placeholder="e.g., Students Guided, Years Experience">
                </div>
            </div>
        `;
        
        highlightsList.appendChild(highlightItem);
        
        // Add event listeners
        highlightItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.collectHighlightsData();
                this.updatePreview();
            });
        });
    }
    
    removeHighlight(index) {
        const highlightsList = document.getElementById('highlights-list');
        if (highlightsList && highlightsList.children[index]) {
            highlightsList.children[index].remove();
            this.collectHighlightsData();
            this.updatePreview();
        }
    }
    
    loadHighlights() {
        const highlightsList = document.getElementById('highlights-list');
        if (!highlightsList) return;
        
        highlightsList.innerHTML = '';
        
        // Get highlights from website data or use defaults
        const highlights = this.websiteData.about?.highlights || [
            'Australia Immigration Specialist',
            '3+ Years Global Experience',
            '200+ Successful Applications',
            'Bachelor of Science Graduate'
        ];
        
        highlights.forEach((highlight, index) => {
            const highlightItem = document.createElement('div');
            highlightItem.className = 'highlight-item';
            highlightItem.innerHTML = `
                <button type="button" class="remove-highlight" onclick="adminPanel.removeHighlight(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Professional Highlight ${index + 1}</h5>
                <div class="form-group">
                    <label>Highlight Text</label>
                    <input type="text" class="highlight-text" value="${highlight}" placeholder="e.g., Australia Immigration Specialist">
                </div>
            `;
            
            highlightsList.appendChild(highlightItem);
            
            // Add event listeners
            const textInput = highlightItem.querySelector('.highlight-text');
            if (textInput) {
                textInput.addEventListener('input', () => {
                    this.collectHighlightsData();
                    this.updatePreview();
                });
            }
        });
        
        // Collect highlights data after loading
        this.collectHighlightsData();
    }
    
    collectHighlightsData() {
        const highlights = [];
        document.querySelectorAll('#highlights-list .highlight-item').forEach((item, index) => {
            const textInput = item.querySelector('.highlight-text');
            if (textInput && textInput.value.trim()) {
                highlights.push(textInput.value.trim());
            }
        });
        
        // Save to website data
        if (!this.websiteData.about) this.websiteData.about = {};
        this.websiteData.about.highlights = highlights;
        
        return highlights;
    }
    
    // Statistics Management
    initializeStatistics() {
        const addStatisticBtn = document.getElementById('add-statistic');
        if (addStatisticBtn) {
            addStatisticBtn.addEventListener('click', () => this.addStatistic());
        }
        this.loadStatistics();
    }
    
    addStatistic() {
        const statisticsList = document.getElementById('statistics-list');
        if (!statisticsList) return;
        
        const currentStats = statisticsList.querySelectorAll('.statistic-item');
        if (currentStats.length >= 4) {
            this.showMessage('Maximum 4 statistics allowed', 'warning');
            return;
        }
        
        const statisticItem = document.createElement('div');
        statisticItem.className = 'statistic-item';
        statisticItem.innerHTML = `
            <button type="button" class="remove-statistic" onclick="adminPanel.removeStatistic(${currentStats.length})">
                <i class="fas fa-trash"></i>
            </button>
            <h5>Statistic ${currentStats.length + 1}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Number</label>
                    <input type="text" class="statistic-number" placeholder="e.g., 7, 200, 98">
                </div>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" class="statistic-label" placeholder="e.g., Years Experience, Students Guided">
                </div>
            </div>
        `;
        
        statisticsList.appendChild(statisticItem);
        
        // Add event listeners
        statisticItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.collectStatisticsData();
                this.updatePreview();
            });
        });
    }
    
    removeStatistic(index) {
        const statisticsList = document.getElementById('statistics-list');
        if (!statisticsList) return;
        
        const statisticItems = statisticsList.querySelectorAll('.statistic-item');
        if (statisticItems[index]) {
            statisticsList.removeChild(statisticItems[index]);
            this.collectStatisticsData();
            this.updatePreview();
        }
    }
    
    loadStatistics() {
        const statisticsList = document.getElementById('statistics-list');
        if (!statisticsList) return;
        
        statisticsList.innerHTML = '';
        
        // Get statistics from website data or use defaults
        const statistics = this.websiteData.about?.statistics || [
            { number: '7', label: 'Years Total Experience' },
            { number: '200', label: 'Students Guided' },
            { number: '50', label: 'Partner Institutions' },
            { number: '98', label: 'Success Rate %' }
        ];
        
        statistics.forEach((stat, index) => {
            const statisticItem = document.createElement('div');
            statisticItem.className = 'statistic-item';
            statisticItem.innerHTML = `
                <button type="button" class="remove-statistic" onclick="adminPanel.removeStatistic(${index})">
                    <i class="fas fa-trash"></i>
                </button>
                <h5>Statistic ${index + 1}</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Number</label>
                        <input type="text" class="statistic-number" value="${stat.number}" placeholder="e.g., 7, 200, 98">
                    </div>
                    <div class="form-group">
                        <label>Label</label>
                        <input type="text" class="statistic-label" value="${stat.label}" placeholder="e.g., Years Experience, Students Guided">
                    </div>
                </div>
            `;
            
            statisticsList.appendChild(statisticItem);
            
            // Add event listeners
            statisticItem.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => {
                    this.collectStatisticsData();
                    this.updatePreview();
                });
            });
        });
        
        // Collect statistics data after loading
        this.collectStatisticsData();
    }
    
    collectStatisticsData() {
        const statistics = [];
        document.querySelectorAll('#statistics-list .statistic-item').forEach((item, index) => {
            const numberInput = item.querySelector('.statistic-number');
            const labelInput = item.querySelector('.statistic-label');
            if (numberInput && labelInput && numberInput.value.trim() && labelInput.value.trim()) {
                statistics.push({
                    number: numberInput.value.trim(),
                    label: labelInput.value.trim()
                });
            }
        });
        
        // Save to website data
        if (!this.websiteData.about) this.websiteData.about = {};
        this.websiteData.about.statistics = statistics;
        
        return statistics;
    }

    // Initialize floating save button
    initializeFloatingSaveButton() {
        console.log('🔧 Initializing floating save button...');
        
        // Wait a bit to ensure the button is visible
        setTimeout(() => {
            const saveButton = document.getElementById('save-all-changes');
            const floatingContainer = document.getElementById('floating-save-btn');
            console.log('Save button found:', saveButton);
            console.log('Floating container found:', floatingContainer);
            console.log('Floating container classes:', floatingContainer?.className);
            console.log('Floating container display style:', floatingContainer?.style.display);
            console.log('Floating container computed display:', window.getComputedStyle(floatingContainer)?.display);
            
            // Force show the button if it's not visible
            if (floatingContainer && !floatingContainer.classList.contains('show')) {
                console.log('🔧 Forcing show class on floating save button');
                floatingContainer.classList.add('show');
                floatingContainer.style.display = 'block';
            }
            
            if (saveButton) {
                console.log('✅ Adding click listener to floating save button');
                
                // Remove any existing listeners first
                const newButton = saveButton.cloneNode(true);
                saveButton.parentNode.replaceChild(newButton, saveButton);
                
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('💾 Floating save button clicked!');
                    this.saveAllChanges();
                });
                
                // Also add a test click to see if the button is clickable
                console.log('🧪 Testing button clickability...');
                newButton.addEventListener('click', (e) => {
                    console.log('🧪 Test click detected!');
                });
                
                console.log('✅ Floating save button initialized successfully');
            } else {
                console.error('❌ Floating save button not found!');
            }
        }, 500);
    }

    // Initialize deploy modal
    initializeDeployModal() {
        console.log('🔧 Initializing deploy modal...');
        
        const deployBtn = document.getElementById('deploy-export-btn');
        const deployModal = document.getElementById('deploy-modal');
        const closeDeployModal = document.getElementById('close-deploy-modal');
        
        console.log('Deploy button:', deployBtn);
        console.log('Deploy modal:', deployModal);
        console.log('Close button:', closeDeployModal);
        
        if (deployBtn && deployModal) {
            console.log('✅ Adding click listener to deploy button');
            deployBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚀 Deploy button clicked!');
                deployModal.classList.remove('hidden');
                this.initializeDeployment();
            });
        } else {
            console.error('❌ Deploy button or modal not found!');
        }
        
        if (closeDeployModal && deployModal) {
            console.log('✅ Adding click listener to close button');
            closeDeployModal.addEventListener('click', () => {
                console.log('🔒 Closing deploy modal');
                deployModal.classList.add('hidden');
            });
        }
        
        // Close modal when clicking outside
        if (deployModal) {
            deployModal.addEventListener('click', (e) => {
                if (e.target === deployModal) {
                    console.log('🔒 Closing deploy modal (outside click)');
                    deployModal.classList.add('hidden');
                }
            });
        }
        
        console.log('✅ Deploy modal initialization complete');
    }

    // Save all changes
    async saveAllChanges() {
        console.log('💾 saveAllChanges() called');
        const saveButton = document.getElementById('save-all-changes');
        const originalText = saveButton.innerHTML;
        
        try {
            console.log('🔄 Starting save process...');
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveButton.disabled = true;
            
            // Collect all form data
            console.log('📝 Collecting form data...');
            this.collectFormData();
            
            // Save to database
            console.log('💾 Saving to database...');
            await this.saveChanges(true); // Suppress the message from saveChanges
            
            // Save legal data to Supabase
            console.log('💾 Saving legal data to Supabase...');
            await this.saveLegalDataToSupabase();
            
            // Update preview
            console.log('👁️ Updating preview...');
            this.updatePreviewIframe();
            
            // Show success message
            console.log('✅ Showing success message...');
            this.showMessage('✅ All changes saved successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            this.showMessage('❌ Error saving changes. Please try again.', 'error');
        } finally {
            setTimeout(() => {
                saveButton.innerHTML = originalText;
                saveButton.disabled = false;
                console.log('🔄 Save process completed');
            }, 1000);
        }
    }

    // Save specific section
    saveSection(sectionName) {
        console.log(`Saving ${sectionName} section...`);
        
        // Show loading state
        const button = document.querySelector(`[data-section="${sectionName}"]`);
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        button.disabled = true;

        try {
            // Collect data based on section
            switch(sectionName) {
                case 'hero':
                    this.collectHeroData();
                    break;
                case 'about':
                    this.collectAboutData();
                    break;
                case 'experience':
                    this.collectExperienceData();
                    break;
                case 'skills':
                    this.collectSkillsData();
                    break;
                case 'testimonials':
                    this.collectTestimonialsData();
                    break;
                case 'linkedin':
                    this.collectLinkedInData();
                    break;
                case 'contact':
                    this.collectContactData();
                    break;
                case 'form':
                    this.collectContactFormData();
                    break;
                case 'legal':
                    this.collectLegalData();
                    break;
                case 'navigation':
                    this.collectNavigationData();
                    break;
                case 'scripts':
                    this.collectScriptsData();
                    break;
                case 'settings':
                    this.collectSettingsData();
                    break;
                case 'credentials':
                    this.collectCredentialsData();
                    break;
                default:
                    console.warn(`Unknown section: ${sectionName}`);
                    return;
            }

            // Save to localStorage and update preview
            this.saveChanges();
            this.updatePreview();

            // Show success message
            this.showMessage(`✅ ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section saved successfully!`, 'success');

        } catch (error) {
            console.error(`Error saving ${sectionName} section:`, error);
            this.showMessage(`❌ Error saving ${sectionName} section. Please try again.`, 'error');
        } finally {
            // Restore button state
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1000);
        }
    }

    // Initialize deployment functionality
    initializeDeployment() {
        console.log('Initializing deployment modal...');
        
        this.bindDeploymentHandlers();
        
        // Update deployment preview after a short delay
        setTimeout(() => {
            this.updateDeploymentPreview();
        }, 500);
    }

    // Bind deployment event handlers
    bindDeploymentHandlers() {
        // Download buttons
        const downloadComplete = document.getElementById('download-complete');
        const downloadHtml = document.getElementById('download-html');
        const downloadZip = document.getElementById('download-zip');

        if (downloadComplete) {
            downloadComplete.addEventListener('click', () => this.downloadCompleteWebsite());
        }
        if (downloadHtml) {
            downloadHtml.addEventListener('click', () => this.downloadHtmlOnly());
        }
        if (downloadZip) {
            downloadZip.addEventListener('click', () => this.downloadAsZip());
        }

        // Token help buttons
        const vercelTokenHelp = document.getElementById('vercel-token-help');
        const netlifyTokenHelp = document.getElementById('netlify-token-help');

        if (vercelTokenHelp) {
            vercelTokenHelp.addEventListener('click', () => this.openVercelTokenHelp());
        }
        if (netlifyTokenHelp) {
            netlifyTokenHelp.addEventListener('click', () => this.openNetlifyTokenHelp());
        }

        // Deployment buttons
        const deployVercel = document.getElementById('deploy-vercel');
        const deployNetlify = document.getElementById('deploy-netlify');
        const showHostingGuide = document.getElementById('show-hosting-guide');

        if (deployVercel) {
            deployVercel.addEventListener('click', () => this.deployToVercel());
        }
        if (deployNetlify) {
            deployNetlify.addEventListener('click', () => this.deployToNetlify());
        }
        if (showHostingGuide) {
            showHostingGuide.addEventListener('click', () => this.showHostingGuide());
        }
    }

    // Download complete website
    downloadCompleteWebsite() {
        this.updateDeploymentStatus('info', 'Generating complete website package...');
        
        try {
            const websiteHtml = this.generateCompleteWebsite();
            const blob = new Blob([websiteHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'complete-website.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.updateDeploymentStatus('success', '✅ Complete website downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            this.updateDeploymentStatus('error', '❌ Error downloading website. Please try again.');
        }
    }

    // Download HTML only
    downloadHtmlOnly() {
        this.updateDeploymentStatus('info', 'Generating HTML file...');
        
        try {
            const websiteHtml = this.generateCompleteWebsite();
            const blob = new Blob([websiteHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.updateDeploymentStatus('success', '✅ HTML file downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            this.updateDeploymentStatus('error', '❌ Error downloading HTML. Please try again.');
        }
    }

    // Download as ZIP
    downloadAsZip() {
        this.updateDeploymentStatus('info', 'Creating ZIP package...');
        
        try {
            // For now, create a simple ZIP with instructions
            const zipContent = this.generateZipPackage();
            const blob = new Blob([zipContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'website-package.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.updateDeploymentStatus('success', '✅ ZIP package created! Check the file for deployment instructions.');
        } catch (error) {
            console.error('ZIP error:', error);
            this.updateDeploymentStatus('error', '❌ Error creating ZIP. Please try again.');
        }
    }

    // Open Vercel token help
    openVercelTokenHelp() {
        const helpWindow = window.open(
            'https://vercel.com/account/tokens',
            '_blank',
            'width=800,height=600,scrollbars=yes,resizable=yes'
        );
        
        this.updateDeploymentStatus('info', '📖 Vercel token help opened in new tab. Copy your token and paste it here.');
    }

    // Open Netlify token help
    openNetlifyTokenHelp() {
        const helpWindow = window.open(
            'https://app.netlify.com/user/applications#personal-access-tokens',
            '_blank',
            'width=800,height=600,scrollbars=yes,resizable=yes'
        );
        
        this.updateDeploymentStatus('info', '📖 Netlify token help opened in new tab. Copy your token and paste it here.');
    }

    // Deploy to Vercel
    deployToVercel() {
        const token = document.getElementById('vercel-token')?.value;
        const projectName = document.getElementById('vercel-project-name')?.value;

        if (!token) {
            this.updateDeploymentStatus('error', '❌ Please enter your Vercel token first.');
            return;
        }

        if (!projectName) {
            this.updateDeploymentStatus('error', '❌ Please enter a project name.');
            return;
        }

        this.updateDeploymentStatus('info', '🚀 Deploying to Vercel...');
        
        // Simulate deployment process
        setTimeout(() => {
            this.updateDeploymentStatus('warning', '⚠️ Vercel API integration coming soon! For now, download files and deploy manually.');
        }, 2000);
    }

    // Deploy to Netlify
    deployToNetlify() {
        const token = document.getElementById('netlify-token')?.value;
        const siteName = document.getElementById('netlify-site-name')?.value;

        if (!token) {
            this.updateDeploymentStatus('error', '❌ Please enter your Netlify token first.');
            return;
        }

        if (!siteName) {
            this.updateDeploymentStatus('error', '❌ Please enter a site name.');
            return;
        }

        this.updateDeploymentStatus('info', '🚀 Deploying to Netlify...');
        
        // Simulate deployment process
        setTimeout(() => {
            this.updateDeploymentStatus('warning', '⚠️ Netlify API integration coming soon! For now, download files and deploy manually.');
        }, 2000);
    }

    // Show hosting guide
    showHostingGuide() {
        const guideContent = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>📚 Complete Hosting Guide</h2>
                
                <h3>🎯 Popular Hosting Providers:</h3>
                <ul>
                    <li><strong>Vercel:</strong> Perfect for static sites, automatic deployments</li>
                    <li><strong>Netlify:</strong> Great for static sites, drag & drop deployment</li>
                    <li><strong>GitHub Pages:</strong> Free hosting for GitHub repositories</li>
                    <li><strong>Firebase Hosting:</strong> Google's hosting solution</li>
                    <li><strong>Cloudflare Pages:</strong> Fast global CDN</li>
                </ul>
                
                <h3>📋 Step-by-Step Deployment:</h3>
                <ol>
                    <li>Download your website files using the buttons above</li>
                    <li>Sign up for your chosen hosting provider</li>
                    <li>Upload your files to the hosting provider</li>
                    <li>Configure your domain (if you have one)</li>
                    <li>Your site will be live at the provided URL!</li>
                </ol>
                
                <h3>🔧 Manual Upload Instructions:</h3>
                <p>Most hosting providers have a file manager or FTP access:</p>
                <ul>
                    <li>Upload all files to the public_html or www folder</li>
                    <li>Ensure index.html is in the root directory</li>
                    <li>Check that all file paths are correct</li>
                    <li>Test your website functionality</li>
                </ul>
                
                <h3>🌐 Domain Configuration:</h3>
                <p>If you have a custom domain:</p>
                <ul>
                    <li>Point your domain's DNS to your hosting provider</li>
                    <li>Configure the domain in your hosting dashboard</li>
                    <li>Wait for DNS propagation (can take up to 48 hours)</li>
                </ul>
            </div>
        `;
        
        // Create modal with guide
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center; padding: 20px;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; border-radius: 10px; max-width: 700px;
            max-height: 80vh; overflow-y: auto; padding: 30px;
            position: relative;
        `;
        
        modalContent.innerHTML = `
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute; top: 10px; right: 15px; background: none;
                border: none; font-size: 24px; cursor: pointer; color: #666;
            ">&times;</button>
            ${guideContent}
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        this.updateDeploymentStatus('info', '📖 Hosting guide opened! Close the modal when done.');
    }

    // Generate complete website HTML
    generateCompleteWebsite() {
        // Get current website data
        const websiteData = this.websiteData || this.getDefaultData();
        
        // Generate the complete HTML with all current data
        return this.generateWebsiteHtml(websiteData);
    }

    // Generate website HTML from data
    generateWebsiteHtml(data) {
        // Get the actual current website content from the preview iframe
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame && previewFrame.contentDocument) {
            const htmlContent = previewFrame.contentDocument.documentElement.outerHTML;
            console.log('Generated HTML from preview frame');
            return htmlContent;
        }
        
        // Fallback: generate complete HTML with current data
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.hero?.name || 'Soumita Chatterjee'} – ${data.hero?.subtitle || 'Australia Immigration Specialist'}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.28.0/feather.min.css">
    <style>
        /* Essential styles for the website */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { text-align: center; padding: 80px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 1rem; }
        .section { padding: 60px 0; }
        .about { background: #f8f9fa; }
        .contact { background: #e9ecef; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>${data.hero?.name || 'Soumita Chatterjee'}</h1>
            <p>${data.hero?.subtitle || 'Australia Immigration Specialist'}</p>
            <p>${data.hero?.description || 'Professional immigration services with years of experience helping clients achieve their Australian dreams.'}</p>
            ${data.hero?.buttons ? data.hero.buttons.map(btn => `<a href="${btn.url || '#'}" class="btn" ${btn.newTab ? 'target="_blank"' : ''}>${btn.text}</a>`).join('') : ''}
        </div>
    </div>
    
    <div class="section about">
        <div class="container">
            <h2>About</h2>
            <p>${data.about?.description || 'Dedicated immigration specialist with extensive experience in Australian visa applications and immigration law.'}</p>
            ${data.about?.highlights ? `<div class="highlights">${data.about.highlights.map(highlight => `<div class="highlight">• ${highlight}</div>`).join('')}</div>` : ''}
        </div>
    </div>
    
    <div class="section contact">
        <div class="container">
            <h2>Contact</h2>
            <p><strong>Email:</strong> ${data.contact?.email || 'contact@example.com'}</p>
            <p><strong>Phone:</strong> ${data.contact?.phone || '+61 XXX XXX XXX'}</p>
            <p><strong>Address:</strong> ${data.contact?.address || 'Melbourne, Australia'}</p>
        </div>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.28.0/feather.min.js"></script>
    <script>feather.replace();</script>
</body>
</html>`;
    }

    // Generate ZIP package
    generateZipPackage() {
        return `WEBSITE DEPLOYMENT PACKAGE
============================

This package contains everything you need to deploy your website.

📁 FILES INCLUDED:
- index.html (main website file)
- Complete website with all your content
- All styling and functionality embedded

🚀 DEPLOYMENT OPTIONS:

1. VERCEL (Recommended):
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Upload your index.html file
   - Your site will be live instantly!

2. NETLIFY:
   - Go to https://netlify.com
   - Sign up/login
   - Drag & drop your index.html file
   - Get a free subdomain instantly

3. GITHUB PAGES:
   - Create a new GitHub repository
   - Upload your index.html file
   - Enable GitHub Pages in settings
   - Your site will be at username.github.io/repository

4. ANY WEB HOSTING:
   - Upload index.html to your hosting provider
   - Ensure it's in the public_html or www folder
   - Your site will be live at your domain

🔧 MANUAL DEPLOYMENT:
1. Download the complete website file
2. Upload to your web hosting provider
3. Ensure the file is named index.html
4. Test your website functionality

📞 NEED HELP?
- Check the hosting guide in the admin panel
- Most hosting providers have excellent documentation
- Contact your hosting provider's support

Your website is ready to go live! 🌐`;
    }

    // Update deployment status
    updateDeploymentStatus(type, message) {
        const statusContainer = document.getElementById('deployment-status');
        if (!statusContainer) return;

        const statusItem = document.createElement('div');
        statusItem.className = `status-item ${type}`;
        statusItem.innerHTML = `
            <i class="fas fa-${this.getStatusIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Clear previous status and add new one
        statusContainer.innerHTML = '';
        statusContainer.appendChild(statusItem);

        // Auto-clear success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (statusItem.parentNode) {
                    statusItem.remove();
                }
            }, 5000);
        }
    }

    // Get status icon based on type
    getStatusIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-triangle';
            case 'warning': return 'exclamation-circle';
            case 'info': return 'info-circle';
            default: return 'info-circle';
        }
    }

    // Resume Generator Functions
    initializeResumeGenerator() {
        console.log('Initializing resume generator...');
        
        // Bind resume template change event
        const templateSelect = document.getElementById('resume-template');
        if (templateSelect) {
            console.log('Template select found');
            templateSelect.addEventListener('change', () => {
                console.log('Template changed');
                setTimeout(() => this.updateResumePreview(), 100);
            });
        } else {
            console.log('Template select NOT found');
        }

        // Bind section checkbox events
        const sectionCheckboxes = [
            'resume-include-about',
            'resume-include-experience', 
            'resume-include-skills',
            'resume-include-contact',
            'resume-include-photo'
        ];

        sectionCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    setTimeout(() => this.updateResumePreview(), 100);
                });
            }
        });

        // Bind photo settings
        const photoSettings = [
            'resume-photo-source',
            'resume-photo-upload',
            'resume-photo-url',
            'resume-photo-style'
        ];

        photoSettings.forEach(id => {
            const setting = document.getElementById(id);
            if (setting) {
                setting.addEventListener('change', () => {
                    this.togglePhotoOptions();
                    setTimeout(() => this.updateResumePreview(), 100);
                });
                // Also listen for input events for URL field
                if (setting.type === 'url') {
                    setting.addEventListener('input', () => {
                        setTimeout(() => this.updateResumePreview(), 100);
                    });
                }
            }
        });

        // Bind settings change events
        const settingsInputs = [
            'resume-page-size',
            'resume-orientation',
            'resume-font-size',
            'resume-length'
        ];

        settingsInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => {
                    setTimeout(() => this.updateResumePreview(), 100);
                });
            }
        });

        // Bind customization controls
        const customizationControls = [
            'resume-primary-color',
            'resume-secondary-color', 
            'resume-bg-color',
            'resume-text-color',
            'resume-show-photo',
            'resume-show-icons',
            'resume-show-skill-tags',
            'resume-show-timeline'
        ];
        
        customizationControls.forEach(id => {
            const control = document.getElementById(id);
            if (control) {
                control.addEventListener('change', () => {
                    console.log('Customization control changed:', id);
                    this.updateColorPreviews();
                    setTimeout(() => this.updateResumePreview(), 100);
                });
                // Also listen for input events for color pickers
                if (control.type === 'color') {
                    control.addEventListener('input', () => {
                        console.log('Color input changed:', id);
                        this.updateColorPreviews();
                        setTimeout(() => this.updateResumePreview(), 100);
                    });
                }
            }
        });

        // Initial preview update
        setTimeout(() => {
            this.updateColorPreviews();
        this.updateResumePreview();
        }, 200);
    }

    togglePhotoOptions() {
        const photoSource = document.getElementById('resume-photo-source')?.value || 'index';
        const uploadGroup = document.getElementById('resume-photo-upload-group');
        const urlGroup = document.getElementById('resume-photo-url-group');

        if (uploadGroup) uploadGroup.style.display = photoSource === 'upload' ? 'block' : 'none';
        if (urlGroup) urlGroup.style.display = photoSource === 'url' ? 'block' : 'none';
    }

    updateColorPreviews() {
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3498db';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';

        // Update color preview circles
        const primaryPreview = document.getElementById('primary-color-preview');
        const secondaryPreview = document.getElementById('secondary-color-preview');
        const bgPreview = document.getElementById('bg-color-preview');
        const textPreview = document.getElementById('text-color-preview');

        if (primaryPreview) primaryPreview.style.background = primaryColor;
        if (secondaryPreview) secondaryPreview.style.background = secondaryColor;
        if (bgPreview) bgPreview.style.background = bgColor;
        if (textPreview) textPreview.style.background = textColor;
    }

    updateResumePreview() {
        // The preview is now the integrated editor
        // Users should use "Load Content" to see changes
        console.log('Resume preview updated - use Load Content to see changes in the editor');
    }

    getResumePhoto() {
        const includePhoto = document.getElementById('resume-include-photo')?.checked;
        if (!includePhoto) return null;

        const photoSource = document.getElementById('resume-photo-source')?.value || 'index';
        const photoStyle = document.getElementById('resume-photo-style')?.value || 'circle';

        let photoUrl = null;
        let photoData = null;

        switch (photoSource) {
            case 'index':
                // Get photo from website data
                const websiteData = this.websiteData;
                if (websiteData && websiteData.hero && websiteData.hero.image) {
                    photoUrl = websiteData.hero.image;
                }
                break;
            case 'upload':
                // Get uploaded photo data
                const uploadInput = document.getElementById('resume-photo-upload');
                if (uploadInput && uploadInput.files && uploadInput.files[0]) {
                    photoData = uploadInput.files[0];
                    // Create a temporary URL for the uploaded file
                    photoUrl = URL.createObjectURL(uploadInput.files[0]);
                }
                break;
            case 'url':
                // Get photo from URL
                const urlInput = document.getElementById('resume-photo-url');
                if (urlInput && urlInput.value) {
                    photoUrl = urlInput.value;
                }
                break;
        }

        return { photoUrl, photoData, photoStyle };
    }

    // Helper function to create elegant photo container
    createPhotoContainer(photoSettings, hero, primaryColor, secondaryColor, size = 120) {
        if (!photoSettings) return '';
        
        const borderRadius = photoSettings.photoStyle === 'circle' ? '50%' : 
                           photoSettings.photoStyle === 'rounded' ? '12px' : '0';
        
        return `
            <div style="width: ${size}px; height: ${size}px; border-radius: ${borderRadius}; margin: 0 auto 20px; overflow: hidden; border: 3px solid ${primaryColor}; box-shadow: 0 8px 25px rgba(0,0,0,0.15); background: white;">
                ${photoSettings.photoUrl ? 
                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; object-position: center top;">` :
                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: ${size * 0.4}px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'P'}</span>
                    </div>`
                }
            </div>
        `;
    }

    // Helper function to get real data from website
    getRealData(data, field) {
        const websiteData = this.websiteData;
        return data[field] || 
               (websiteData && websiteData.hero && websiteData.hero[field]) || 
               (websiteData && websiteData[field]) || 
               this.getDefaultValue(field);
    }

    getDefaultValue(field) {
        const defaults = {
            name: 'Your Name',
            subtitle: 'Professional Title',
            title: 'Professional Title',
            description: 'Professional description',
            location: 'Your Location',
            phone: 'Your Phone',
            email: 'your.email@example.com'
        };
        return defaults[field] || '';
    }

    // WCAG AAA compliant color helper
    getContrastColor(backgroundColor) {
        // Ensure proper contrast for WCAG AAA compliance
        const lightColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0'];
        const isLight = lightColors.includes(backgroundColor.toLowerCase());
        return isLight ? '#1f2937' : '#ffffff';
    }

    // Rich Text Editor Functions
    execCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.updateResumePreview();
    }

    clearEditor() {
        const editor = document.getElementById('resume-editor-content');
        if (editor) {
            editor.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280; font-style: italic;">
                    <p>Click "Load Content" to load the current resume for editing...</p>
                    <p>Edit directly in this window - all changes will be saved to your PDF</p>
                </div>
            `;
        }
    }

    downloadResume() {
        const editor = document.getElementById('resume-editor-content');
        if (!editor) return;

        // Get the edited content
        const editedContent = editor.innerHTML;
        
        // Create a new window with the edited content for PDF generation
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: 'Inter', sans-serif; }
                    @media print {
                        body { margin: 0; }
                        @page { margin: 0.5in; }
                    }
                </style>
            </head>
            <body>
                ${editedContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    loadResumeContent() {
        const editor = document.getElementById('resume-editor-content');
        if (!editor) return;

        // Generate current resume content
        const template = document.getElementById('resume-template')?.value || 'architect';
        const sections = this.getResumeSections();
        const length = document.getElementById('resume-length')?.value || 'single';
        
        const resumeHtml = this.generateResumeHtml(template, sections, length);
        
        // Load the full HTML directly into the editor for WYSIWYG editing
        editor.innerHTML = resumeHtml;
        
        // Focus the editor
        editor.focus();
    }

    getEditedResumeContent() {
        const editor = document.getElementById('resume-editor-content');
        return editor ? editor.innerHTML : '';
    }

    getResumeSections() {
        return {
            about: document.getElementById('resume-include-about')?.checked || false,
            education: document.getElementById('resume-include-education')?.checked || false,
            experience: document.getElementById('resume-include-experience')?.checked || false,
            skills: document.getElementById('resume-include-skills')?.checked || false,
            contact: document.getElementById('resume-include-contact')?.checked || false,
            photo: document.getElementById('resume-include-photo')?.checked || false
        };
    }

    generateResumeHtml(template, sections, length = 'single') {
        const data = this.websiteData;
        if (!data) return '<p>No data available</p>';

        // Adjust data based on length
        const adjustedData = this.adjustDataForLength(data, length);

        switch (template) {
            case 'architect':
                return this.generateArchitectResume(adjustedData, sections, length);
            case 'analyst':
                return this.generateAnalystResume(adjustedData, sections, length);
            case 'engineer':
                return this.generateEngineerResume(adjustedData, sections, length);
            case 'innovator':
                return this.generateInnovatorResume(adjustedData, sections, length);
            case 'professional':
                return this.generateProfessionalResume(adjustedData, sections, length);
            case 'minimalist':
                return this.generateMinimalistResume(adjustedData, sections, length);
            case 'chrono':
                return this.generateChronoResume(adjustedData, sections, length);
            case 'portfolio':
                return this.generatePortfolioResume(adjustedData, sections, length);
            case 'coder':
                return this.generateCoderResume(adjustedData, sections, length);
            case 'hybrid':
                return this.generateHybridResume(adjustedData, sections, length);
            case 'dashboard':
                return this.generateDashboardResume(adjustedData, sections, length);
            case 'glassmorphism':
                return this.generateGlassmorphismResume(adjustedData, sections, length);
            case 'neon':
                return this.generateNeonResume(adjustedData, sections, length);
            case 'gradient':
                return this.generateGradientResume(adjustedData, sections, length);
            case 'card':
                return this.generateCardResume(adjustedData, sections, length);
            case 'infographic':
                return this.generateInfographicResume(adjustedData, sections, length);
            case 'magazine':
                return this.generateMagazineResume(adjustedData, sections, length);
            case 'dashboard-dark':
                return this.generateDashboardDarkResume(adjustedData, sections, length);
            case 'minimal-color':
                return this.generateMinimalColorResume(adjustedData, sections, length);
            case 'geometric':
                return this.generateGeometricResume(adjustedData, sections, length);
            default:
                return this.generateAnalystResume(adjustedData, sections, length);
        }
    }

    adjustDataForLength(data, length) {
        const adjustedData = { ...data };
        
        if (length === 'single') {
            // For single page, condense but keep ALL important information
            if (adjustedData.about && adjustedData.about.description) {
                // Condense description but keep key points
                adjustedData.about.description = this.condenseText(adjustedData.about.description, 200);
            }
            
            // Keep all experience but condense descriptions
            if (adjustedData.experience && adjustedData.experience.length > 0) {
                adjustedData.experience.forEach(exp => {
                    if (exp.description) {
                        exp.description = this.condenseText(exp.description, 120);
                    }
                });
            }
            
            // Keep all skills but show fewer per category
            if (adjustedData.skills) {
                Object.keys(adjustedData.skills).forEach(category => {
                    if (adjustedData.skills[category] && adjustedData.skills[category].length > 4) {
                        adjustedData.skills[category] = adjustedData.skills[category].slice(0, 4);
                    }
                });
            }
        } else {
            // For long resume, create MUCH more detailed content with bullet points and formatting
            if (adjustedData.about && adjustedData.about.description) {
                adjustedData.about.description = `<strong>${adjustedData.about.description}</strong><br><br>
                
                <strong>Professional Highlights:</strong><br>
                • <em>7+ years</em> of combined experience in financial analysis and education consulting<br>
                • <em>200+ students</em> successfully guided through complex visa applications<br>
                • <em>98% success rate</em> in visa application processing<br>
                • <em>Expertise</em> in Australian immigration pathways and regulatory compliance<br><br>
                
                <strong>Core Competencies:</strong><br>
                • <strong>Strategic Planning:</strong> Develop comprehensive immigration strategies for complex cases including skilled migration and family reunification<br>
                • <strong>Process Optimization:</strong> Implement data-driven decision-making processes that reduced application processing times by 60%<br>
                • <strong>Team Leadership:</strong> Led and trained teams of admissions officers, improving efficiency by 40%<br>
                • <strong>Client Relations:</strong> Provide empathetic client service with personalized immigration strategies<br>
                • <strong>Regulatory Expertise:</strong> Deep understanding of complex immigration regulations and compliance requirements<br><br>
                
                <strong>Specializations:</strong><br>
                • Student visas and educational pathway planning<br>
                • Skilled migration applications and assessment<br>
                • Family reunification and sponsorship programs<br>
                • Business and investment visa categories<br>
                • Compliance and documentation management`;
            }
            
            // Expand experience descriptions with MUCH more detail and bullet points
            if (adjustedData.experience && adjustedData.experience.length > 0) {
                adjustedData.experience.forEach(exp => {
                    if (exp.description) {
                        if (exp.title === 'Senior Admissions Officer') {
                            exp.description = `<strong>${exp.description}</strong><br><br>
                            
                            <strong>Leadership & Team Management:</strong><br>
                            • Led a team of <em>8 admissions officers</em>, implementing advanced training programs<br>
                            • Improved team efficiency by <em>40%</em> through structured mentoring and skill development<br>
                            • Conducted regular training sessions on immigration regulations and best practices<br><br>
                            
                            <strong>Strategic Development:</strong><br>
                            • Developed comprehensive immigration strategies for complex cases<br>
                            • Established partnerships with <em>50+ educational institutions</em> across Australia<br>
                            • Created streamlined application processes and standardized procedures<br><br>
                            
                            <strong>Process Innovation:</strong><br>
                            • Implemented data-driven decision-making processes<br>
                            • Reduced application processing times by <em>60%</em> through automation<br>
                            • Managed high-profile cases requiring exceptional attention to detail<br><br>
                            
                            <strong>Relationship Management:</strong><br>
                            • Developed and maintained relationships with immigration authorities<br>
                            • Ensured smooth application processes with partner institutions<br>
                            • Provided strategic guidance on visa options and pathways`;
                        } else if (exp.title === 'Admissions Officer') {
                            exp.description = `<strong>${exp.description}</strong><br><br>
                            
                            <strong>Application Processing:</strong><br>
                            • Processed over <em>150 visa applications annually</em> with a <em>98% success rate</em><br>
                            • Conducted comprehensive interviews with applicants to assess eligibility<br>
                            • Gathered and verified required documentation for complex cases<br><br>
                            
                            <strong>Client Support:</strong><br>
                            • Provided detailed guidance on visa requirements and documentation preparation<br>
                            • Developed personalized immigration strategies based on individual circumstances<br>
                            • Offered ongoing support throughout the entire visa application process<br><br>
                            
                            <strong>Collaboration & Compliance:</strong><br>
                            • Collaborated with educational institutions to ensure smooth enrollment processes<br>
                            • Maintained detailed records of all applications and communications<br>
                            • Ensured compliance with all regulatory requirements and documentation standards<br><br>
                            
                            <strong>Specialized Services:</strong><br>
                            • Expert guidance on student visas and educational pathways<br>
                            • Skilled migration application support and assessment<br>
                            • Family reunification and sponsorship program assistance`;
                        }
                    }
                });
            }
            
            // Add more detailed skills for long format
            if (adjustedData.skills) {
                // Add more skills to existing categories
                if (adjustedData.skills['Admissions & Immigration']) {
                    adjustedData.skills['Admissions & Immigration'].push(
                        { name: 'Skilled Migration', percentage: 88 },
                        { name: 'Family Reunification', percentage: 85 },
                        { name: 'Visa Strategy Planning', percentage: 92 },
                        { name: 'Documentation Review', percentage: 95 },
                        { name: 'Compliance Management', percentage: 90 }
                    );
                }
                
                // Add new skill categories for long format
                adjustedData.skills['Leadership & Management'] = [
                    { name: 'Team Leadership', percentage: 85 },
                    { name: 'Process Optimization', percentage: 90 },
                    { name: 'Training & Development', percentage: 80 },
                    { name: 'Strategic Planning', percentage: 88 },
                    { name: 'Performance Management', percentage: 82 }
                ];
                
                adjustedData.skills['Financial Analysis'] = [
                    { name: 'Financial Reporting', percentage: 85 },
                    { name: 'Audit Procedures', percentage: 90 },
                    { name: 'Risk Assessment', percentage: 88 },
                    { name: 'Compliance Review', percentage: 92 },
                    { name: 'Data Analysis', percentage: 85 }
                ];
            }
        }
        
        return adjustedData;
    }

    condenseText(text, maxLength) {
        if (text.length <= maxLength) return text;
        
        // Try to keep complete sentences
        const sentences = text.split('. ');
        let condensedText = '';
        
        for (let sentence of sentences) {
            if ((condensedText + sentence).length <= maxLength) {
                condensedText += (condensedText ? '. ' : '') + sentence;
            } else {
                break;
            }
        }
        
        return condensedText + (condensedText.endsWith('.') ? '' : '.');
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    generateArchitectResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3498db';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real data from website
        const realName = this.getRealData(hero, 'name');
        const realSubtitle = this.getRealData(hero, 'subtitle');
        const realLocation = this.getRealData(contact, 'location');
        const realPhone = this.getRealData(contact, 'phone');
        const realEmail = this.getRealData(contact, 'email');

        let html = `
            <div style="font-family: 'Poppins, Open Sans, sans-serif'; max-width: 1000px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; padding: 40px 20px;">
                <!-- The Architect - Elegant Two Column Layout -->
                <div style="display: flex; min-height: 100vh; border-radius: 25px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.1);">
                    <!-- Left Sidebar - Elegant Dark Panel -->
                    <div style="width: 350px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; padding: 40px 30px; position: relative;">
                        <!-- Elegant Profile Section -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            ${sections.photo && photoSettings ? this.createPhotoContainer(photoSettings, hero, 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)', 160) : `
                                <div style="width: 160px; height: 160px; border-radius: 50%; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                                    <span style="font-size: 48px; color: white; font-weight: bold;">${realName ? realName.charAt(0).toUpperCase() : 'A'}</span>
                        </div>
                            `}
                            
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; font-family: 'Poppins', sans-serif; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${realName}</h1>
                            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300; font-family: 'Open Sans', sans-serif;">${realSubtitle}</p>
                </div>

                        <!-- Contact Information -->
                        ${sections.contact ? `
                    <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px; font-family: 'Poppins', sans-serif;">📞 Contact</h3>
                                <div style="font-size: 14px; line-height: 1.8; font-family: 'Open Sans', sans-serif;">
                                    ${realEmail ? `<div style="margin: 8px 0; display: flex; align-items: center;">📧 ${realEmail}</div>` : ''}
                                    ${realPhone ? `<div style="margin: 8px 0; display: flex; align-items: center;">📞 ${realPhone}</div>` : ''}
                                    ${realLocation ? `<div style="margin: 8px 0; display: flex; align-items: center;">📍 ${realLocation}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin: 8px 0; display: flex; align-items: center;">🔗 LinkedIn</div>` : ''}
                                </div>
                    </div>
                ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px; font-family: 'Poppins', sans-serif;">⚡ Skills & Languages</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 25px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; opacity: 0.9; font-family: 'Poppins', sans-serif;">${categoryName}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${skillList.map(skill => `
                                                <span style="background: rgba(255,255,255,0.25); color: white; padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: 600; font-family: 'Open Sans', sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${skill.name || skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content - Subtle Color Difference -->
                    <div style="flex: 1; padding: 40px 35px; background: #fafbfc;">
                        <!-- About & Aspiration -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 35px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; border-bottom: 3px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Poppins', sans-serif; letter-spacing: 0.5px;">📋 About & Aspiration</h2>
                                <div style="line-height: 1.8; font-size: 16px; color: #1f2937; font-family: 'Open Sans', sans-serif; font-weight: 400;">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Education -->
                        ${sections.education ? `
                            <div style="margin-bottom: 35px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; border-bottom: 3px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Poppins', sans-serif; letter-spacing: 0.5px;">🎓 Education</h2>
                                <div style="margin-bottom: 25px; padding-left: 20px; border-left: 3px solid ${secondaryColor};">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                        <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: ${primaryColor}; font-family: 'Poppins', sans-serif;">Master of Business Administration</h3>
                                        <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px; font-family: 'Open Sans', sans-serif;">2018 - 2020</span>
                                    </div>
                                    <div style="color: ${secondaryColor}; font-size: 18px; margin-bottom: 12px; font-weight: 600; font-family: 'Poppins', sans-serif;">University of Melbourne</div>
                                    <div style="line-height: 1.6; font-size: 15px; color: #1f2937; font-family: 'Open Sans', sans-serif; font-weight: 400;">Specialized in International Business and Strategic Management</div>
                                </div>
                                <div style="margin-bottom: 25px; padding-left: 20px; border-left: 3px solid ${secondaryColor};">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                        <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: ${primaryColor}; font-family: 'Poppins', sans-serif;">Bachelor of Commerce</h3>
                                        <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px; font-family: 'Open Sans', sans-serif;">2014 - 2018</span>
                                    </div>
                                    <div style="color: ${secondaryColor}; font-size: 18px; margin-bottom: 12px; font-weight: 600; font-family: 'Poppins', sans-serif;">Monash University</div>
                                    <div style="line-height: 1.6; font-size: 15px; color: #1f2937; font-family: 'Open Sans', sans-serif; font-weight: 400;">Major in Finance and Economics</div>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Professional Experience & Timeline -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 35px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; border-bottom: 3px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Poppins', sans-serif; letter-spacing: 0.5px;">💼 Professional Experience</h2>
                                ${adjustedExperience.map((exp, index) => `
                                    <div style="margin-bottom: 30px; padding-left: 20px; border-left: 3px solid ${secondaryColor}; position: relative;">
                                        <div style="position: absolute; left: -6px; top: 0; width: 12px; height: 12px; background: ${secondaryColor}; border-radius: 50%; border: 3px solid white;"></div>
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: ${primaryColor}; font-family: 'Poppins', sans-serif;">${exp.title}</h3>
                                            <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px; font-family: 'Open Sans', sans-serif;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 18px; margin-bottom: 12px; font-weight: 600; font-family: 'Poppins', sans-serif;">${exp.company}</div>
                                        <div style="line-height: 1.7; font-size: 15px; color: #1f2937; font-family: 'Open Sans', sans-serif; font-weight: 400;">${exp.description}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                    </div>
                </div>
            </div>
        `;

                return html;
    }

    generateAnalystResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3498db';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real data from website
        const realName = this.getRealData(hero, 'name');
        const realSubtitle = this.getRealData(hero, 'subtitle');
        const realLocation = this.getRealData(contact, 'location');
        const realPhone = this.getRealData(contact, 'phone');
        const realEmail = this.getRealData(contact, 'email');

        let html = `
            <div style="font-family: 'Lora, Merriweather, serif'; max-width: 800px; margin: 0 auto; padding: 40px; background: ${bgColor}; color: ${textColor};">
                <!-- The Analyst - Classic Single Column -->
                <!-- Header -->
                <div style="text-align: center; border-bottom: 3px solid ${primaryColor}; padding-bottom: 30px; margin-bottom: 40px;">
                    ${sections.photo && photoSettings ? `
                        <div style="margin-bottom: 25px;">
                            ${this.createPhotoContainer(photoSettings, hero, primaryColor, secondaryColor, 120)}
                        </div>
                    ` : ''}
                    <h1 style="margin: 0; color: ${primaryColor}; font-size: 42px; font-weight: 400; font-family: 'Lora', serif;">${realName}</h1>
                    <p style="margin: 15px 0; color: #7f8c8d; font-size: 22px; font-style: italic; font-family: 'Merriweather', serif;">${realSubtitle}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 25px; font-size: 15px; color: #34495e; line-height: 1.8;">
                            ${realLocation ? `<div style="display: inline-block; margin: 0 15px;">📍 ${realLocation}</div>` : ''}
                            ${realPhone ? `<div style="display: inline-block; margin: 0 15px;">📞 ${realPhone}</div>` : ''}
                            ${realEmail ? `<div style="display: inline-block; margin: 0 15px;">📧 ${realEmail}</div>` : ''}
                            ${contact.linkedin ? `<div style="display: inline-block; margin: 0 15px;">🔗 LinkedIn</div>` : ''}
                    </div>
                    ` : ''}
                </div>

                <!-- Professional Summary -->
                ${sections.about && adjustedAbout.description ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Lora', serif; font-weight: 500; border-bottom: 1px solid #bdc3c7; padding-bottom: 10px;">PROFESSIONAL SUMMARY</h2>
                        <p style="margin: 0; line-height: 1.8; color: #34495e; font-size: 15px; font-family: 'Merriweather', serif;">${adjustedAbout.description}</p>
                    </div>
                ` : ''}

                <!-- Work Experience -->
                ${sections.experience && adjustedExperience.length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Lora', serif; font-weight: 500; border-bottom: 1px solid #bdc3c7; padding-bottom: 10px;">PROFESSIONAL EXPERIENCE</h2>
                        ${adjustedExperience.map(exp => `
                <div style="margin-bottom: 30px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <h3 style="margin: 0; color: ${primaryColor}; font-size: 18px; font-weight: 600; font-family: 'Lora', serif;">${exp.title}</h3>
                                    <span style="color: #7f8c8d; font-size: 15px; font-style: italic; font-family: 'Merriweather', serif;">${exp.date || exp.period}</span>
                        </div>
                                <div style="color: #34495e; font-size: 16px; margin-bottom: 12px; font-weight: 500; font-family: 'Merriweather', serif;">${exp.company}</div>
                                <p style="margin: 0; line-height: 1.7; color: #2c3e50; font-size: 14px; font-family: 'Merriweather', serif;">${exp.description}</p>
                    </div>
                        `).join('')}
                </div>
                ` : ''}

                <!-- Skills Section -->
                ${sections.skills && Object.keys(skills).length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Lora', serif; font-weight: 500; border-bottom: 1px solid #bdc3c7; padding-bottom: 10px;">SKILLS & EXPERTISE</h2>
                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                            <div style="margin-bottom: 25px;">
                                <h3 style="margin: 0 0 12px 0; color: ${primaryColor}; font-size: 16px; font-weight: 600; font-family: 'Lora', serif;">${categoryName}</h3>
                                <p style="margin: 0; color: #34495e; font-size: 14px; line-height: 1.6; font-family: 'Merriweather', serif;">${skillList.map(skill => skill.name || skill).join(' • ')}</p>
                </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    generateModernResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3498db';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        const showPhoto = document.getElementById('resume-show-photo')?.checked !== false;
        const showIcons = document.getElementById('resume-show-icons')?.checked !== false;
        const showSkillTags = document.getElementById('resume-show-skill-tags')?.checked !== false;

        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, Arial', sans-serif; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- Modern Two Column Layout -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 320px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; padding: 40px 30px; position: relative; box-shadow: 4px 0 20px rgba(0,0,0,0.1);">
                        <!-- Decorative Elements -->
                        <div style="position: absolute; top: 20px; right: 20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: 20px; left: 20px; width: 60px; height: 60px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                        
                        <!-- Profile Picture -->
                        ${showPhoto ? `
                            <div style="width: 160px; height: 160px; border-radius: 50%; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                                ${hero.image ? 
                                    `<img src="${hero.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 56px; color: white; font-weight: bold;">
                                        ${hero.name ? hero.name.charAt(0).toUpperCase() : 'A'}
                                    </div>`
                                }
                            </div>
                        ` : ''}
                        
                        <!-- Name and Title -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300;">${hero.subtitle || 'Professional Title'}</p>
                        </div>
                        
                        <!-- Contact Information -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Contact</h3>
                                <div style="font-size: 14px; line-height: 1.8;">
                                    ${contact.email ? `<div style="margin: 8px 0; display: flex; align-items: center;">📧 ${contact.email}</div>` : ''}
                                    ${contact.phone ? `<div style="margin: 8px 0; display: flex; align-items: center;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.location ? `<div style="margin: 8px 0; display: flex; align-items: center;">📍 ${contact.location}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin: 8px 0; display: flex; align-items: center;">🔗 ${contact.linkedin}</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Section with Percentage Bars -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Skills</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 25px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; opacity: 0.9;">${categoryName}</h4>
                                        ${skillList.map(skill => `
                                            <div style="margin-bottom: 12px;">
                                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                                    <span style="font-size: 12px; font-weight: 500; opacity: 0.9;">${skill.name || skill}</span>
                                                    <span style="font-size: 11px; font-weight: 600; opacity: 0.8;">${skill.percentage || 85}%</span>
                                                </div>
                                                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                                                    <div style="width: ${skill.percentage || 85}%; height: 100%; background: rgba(255,255,255,0.8); border-radius: 2px;"></div>
                                                </div>
                                            </div>
                                            `).join('')}
                                        </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 40px 35px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 35px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; border-bottom: 3px solid ${secondaryColor}; padding-bottom: 10px;">Professional Summary</h2>
                                <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${textColor};">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 35px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; border-bottom: 3px solid ${secondaryColor}; padding-bottom: 10px;">Professional Experience</h2>
                                ${adjustedExperience.map(exp => `
                                    <div style="margin-bottom: 30px; padding-left: 20px; border-left: 3px solid ${secondaryColor};">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">${exp.title}</h3>
                                            <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 12px; font-weight: 600;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; font-size: 14px; color: ${textColor};">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}


                            </div>
                        </div>
            </div>
        `;

        return html;
    }

    generateEngineerResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#34495e';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#e74c3c';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Roboto Slab, Roboto, serif'; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- The Engineer - Two Column with Timeline -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 280px; background: ${primaryColor}; color: white; padding: 30px 25px;">
                        <!-- Profile Picture -->
                        <div style="width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 25px; overflow: hidden; border: 4px solid ${secondaryColor}; background: ${secondaryColor}; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 48px; color: white; font-weight: bold; font-family: 'Roboto Slab', serif;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'E'}</span>
                        </div>
                        
                        <!-- Contact Information -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: ${secondaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">CONTACT</h3>
                                ${contact.location ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'Roboto', sans-serif;"><span style="margin-right: 8px;">📍</span> ${contact.location}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'Roboto', sans-serif;"><span style="margin-right: 8px;">📞</span> ${contact.phone}</div>` : ''}
                                ${contact.email ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'Roboto', sans-serif;"><span style="margin-right: 8px;">📧</span> ${contact.email}</div>` : ''}
                                ${contact.linkedin ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'Roboto', sans-serif;"><span style="margin-right: 8px;">🔗</span> LinkedIn</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                        <div>
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: ${secondaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">SKILLS</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: ${secondaryColor}; font-family: 'Roboto Slab', serif;">${categoryName}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                            ${skillList.map(skill => `
                                                <span style="background: rgba(255,255,255,0.1); color: white; padding: 3px 8px; border-radius: 8px; font-size: 11px; font-family: 'Roboto', sans-serif;">${skill.name || skill}</span>
                                            `).join('')}
                            </div>
                        </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 40px 35px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="margin: 0; color: ${primaryColor}; font-size: 36px; font-weight: 700; font-family: 'Roboto Slab', serif;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0 0 0; color: ${secondaryColor}; font-size: 18px; font-family: 'Roboto', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Roboto Slab', serif;">PROFESSIONAL SUMMARY</h2>
                                <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${textColor}; font-family: 'Roboto', sans-serif;">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience with Timeline -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Roboto Slab', serif;">PROFESSIONAL EXPERIENCE</h2>
                                ${adjustedExperience.map((exp, index) => `
                                    <div style="margin-bottom: 30px; position: relative; padding-left: 30px;">
                                        <div style="position: absolute; left: 0; top: 0; width: 12px; height: 12px; background: ${secondaryColor}; border-radius: 50%; border: 3px solid ${primaryColor};"></div>
                                        <div style="position: absolute; left: 5px; top: 12px; width: 2px; height: calc(100% - 12px); background: ${secondaryColor};"></div>
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor}; font-family: 'Roboto Slab', serif;">${exp.title}</h3>
                                            <span style="color: ${secondaryColor}; font-size: 14px; font-weight: 500; background: #f8f9fa; padding: 4px 12px; border-radius: 15px; font-family: 'Roboto', sans-serif;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 12px; font-weight: 600; font-family: 'Roboto Slab', serif;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; font-size: 14px; color: ${textColor}; font-family: 'Roboto', sans-serif;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateInnovatorResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#6366f1';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#8b5cf6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Oswald, Lato, sans-serif'; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; position: relative;">
                <!-- The Innovator - Asymmetrical Design with Vertical Line -->
                <div style="position: relative;">
                    <!-- Vertical Line -->
                    <div style="position: fixed; left: 50px; top: 0; width: 3px; height: 100vh; background: linear-gradient(to bottom, ${primaryColor}, ${secondaryColor}); z-index: 1;"></div>
                    
                    <!-- Profile Picture (Offset) -->
                    <div style="position: absolute; top: 40px; right: 40px; width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid ${primaryColor}; box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: ${primaryColor}; display: flex; align-items: center; justify-content: center; z-index: 2;">
                        <span style="font-size: 36px; color: white; font-weight: bold; font-family: 'Oswald', sans-serif;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'I'}</span>
                                </div>

                    <!-- Header -->
                    <div style="padding: 60px 40px 40px 80px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; border-radius: 0 0 30px 30px; margin-bottom: 40px;">
                        <h1 style="margin: 0; font-size: 48px; font-weight: 700; letter-spacing: 2px; font-family: 'Oswald', sans-serif;">${hero.name || 'Your Name'}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.9; font-weight: 300; font-family: 'Lato', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                        ${sections.contact ? `
                            <div style="margin-top: 25px; display: flex; flex-wrap: wrap; gap: 20px; font-size: 14px; font-family: 'Lato', sans-serif;">
                                ${contact.location ? `<div style="display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                                ${contact.phone ? `<div style="display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                                ${contact.email ? `<div style="display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                                ${contact.linkedin ? `<div style="display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                            </div>
                        ` : ''}
                        </div>

                    <div style="padding: 0 40px 40px 80px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 40px; position: relative;">
                                <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Oswald', sans-serif; position: relative;">
                                    <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">About</span>
                                    Professional Summary
                                </h2>
                                <p style="margin: 0; line-height: 1.8; font-size: 16px; color: #4b5563; background: #f8fafc; padding: 25px; border-radius: 15px; border-left: 5px solid ${primaryColor}; font-family: 'Lato', sans-serif;">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Oswald', sans-serif; position: relative;">
                                    <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">Work</span>
                                    Experience
                                </h2>
                                ${adjustedExperience.map((exp, index) => `
                                    <div style="margin-bottom: 30px; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; position: relative; overflow: hidden;">
                                        <div style="position: absolute; top: 0; left: 0; width: 5px; height: 100%; background: linear-gradient(to bottom, ${primaryColor}, ${secondaryColor});"></div>
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                            <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: ${primaryColor}; font-family: 'Oswald', sans-serif;">${exp.title}</h3>
                                            <span style="color: ${secondaryColor}; font-size: 14px; font-weight: 600; background: #f3f4f6; padding: 6px 15px; border-radius: 20px; font-family: 'Lato', sans-serif;">${exp.date || exp.period}</span>
                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 18px; margin-bottom: 15px; font-weight: 600; font-family: 'Oswald', sans-serif;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.7; font-size: 15px; color: #6b7280; font-family: 'Lato', sans-serif;">${exp.description}</p>
                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Oswald', sans-serif; position: relative;">
                                    <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">Skills</span>
                                    & Expertise
                                </h2>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 30px; background: white; border-radius: 20px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                                        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: ${primaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Oswald', sans-serif;">${categoryName}</h3>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${skillList.map(skill => `
                                                <span style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: white; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; font-family: 'Lato', sans-serif;">${skill.name || skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateProfessionalResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#34495e';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Garamond, EB Garamond, serif'; max-width: 800px; margin: 0 auto; padding: 40px; background: ${bgColor}; color: ${textColor};">
                <!-- The Professional - Traditional Single Column -->
                <!-- Header -->
                <div style="text-align: center; border-bottom: 2px solid ${primaryColor}; padding-bottom: 30px; margin-bottom: 40px;">
                    <h1 style="margin: 0; color: ${primaryColor}; font-size: 42px; font-weight: 400; font-family: 'Garamond', serif; letter-spacing: 1px;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 15px 0; color: ${secondaryColor}; font-size: 20px; font-style: italic; font-family: 'EB Garamond', serif;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 25px; font-size: 15px; color: #555; line-height: 1.8; font-family: 'EB Garamond', serif;">
                            ${contact.location ? `<div style="display: inline-block; margin: 0 15px;">📍 ${contact.location}</div>` : ''}
                            ${contact.phone ? `<div style="display: inline-block; margin: 0 15px;">📞 ${contact.phone}</div>` : ''}
                            ${contact.email ? `<div style="display: inline-block; margin: 0 15px;">📧 ${contact.email}</div>` : ''}
                            ${contact.linkedin ? `<div style="display: inline-block; margin: 0 15px;">🔗 LinkedIn</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Professional Summary -->
                ${sections.about && adjustedAbout.description ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Garamond', serif; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 10px;">PROFESSIONAL SUMMARY</h2>
                        <p style="margin: 0; line-height: 1.8; color: #444; font-size: 15px; font-family: 'EB Garamond', serif;">${adjustedAbout.description}</p>
                    </div>
                ` : ''}

                <!-- Work Experience -->
                ${sections.experience && adjustedExperience.length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Garamond', serif; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 10px;">PROFESSIONAL EXPERIENCE</h2>
                        ${adjustedExperience.map(exp => `
                            <div style="margin-bottom: 30px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <h3 style="margin: 0; color: ${primaryColor}; font-size: 18px; font-weight: 600; font-family: 'Garamond', serif;">${exp.title}</h3>
                                    <span style="color: #666; font-size: 15px; font-style: italic; font-family: 'EB Garamond', serif;">${exp.date || exp.period}</span>
                                </div>
                                <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 12px; font-weight: 500; font-family: 'EB Garamond', serif;">${exp.company}</div>
                                <p style="margin: 0; line-height: 1.7; color: #333; font-size: 14px; font-family: 'EB Garamond', serif;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Skills Section -->
                ${sections.skills && Object.keys(skills).length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="color: ${primaryColor}; font-size: 24px; margin-bottom: 20px; font-family: 'Garamond', serif; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 10px;">SKILLS & EXPERTISE</h2>
                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                            <div style="margin-bottom: 25px;">
                                <h3 style="margin: 0 0 12px 0; color: ${primaryColor}; font-size: 16px; font-weight: 600; font-family: 'Garamond', serif;">${categoryName}</h3>
                                <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.6; font-family: 'EB Garamond', serif;">${skillList.map(skill => skill.name || skill).join(' • ')}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    generateMinimalistResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#1a1a1a';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#666666';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, Arial, sans-serif'; max-width: 800px; margin: 0 auto; padding: 60px 40px; background: ${bgColor}; color: ${textColor};">
                <!-- The Minimalist - Ultra Clean Single Column -->
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 60px;">
                    <h1 style="margin: 0; color: ${primaryColor}; font-size: 48px; font-weight: 300; letter-spacing: -1px; font-family: 'Inter', sans-serif;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 20px 0 0 0; color: ${secondaryColor}; font-size: 18px; font-weight: 300; font-family: 'Inter', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 30px; font-size: 14px; color: ${secondaryColor}; line-height: 1.8; font-weight: 300; font-family: 'Inter', sans-serif;">
                            ${contact.location ? `<div style="display: inline-block; margin: 0 20px;">📍 ${contact.location}</div>` : ''}
                            ${contact.phone ? `<div style="display: inline-block; margin: 0 20px;">📞 ${contact.phone}</div>` : ''}
                            ${contact.email ? `<div style="display: inline-block; margin: 0 20px;">📧 ${contact.email}</div>` : ''}
                            ${contact.linkedin ? `<div style="display: inline-block; margin: 0 20px;">🔗 LinkedIn</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Professional Summary -->
                ${sections.about && adjustedAbout.description ? `
                    <div style="margin-bottom: 50px;">
                        <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 25px; font-weight: 400; font-family: 'Inter', sans-serif; border-bottom: 1px solid #eee; padding-bottom: 15px;">PROFESSIONAL SUMMARY</h2>
                        <p style="margin: 0; line-height: 1.8; color: ${textColor}; font-size: 15px; font-weight: 300; font-family: 'Inter', sans-serif;">${adjustedAbout.description}</p>
                    </div>
                ` : ''}

                <!-- Work Experience -->
                ${sections.experience && adjustedExperience.length > 0 ? `
                    <div style="margin-bottom: 50px;">
                        <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 25px; font-weight: 400; font-family: 'Inter', sans-serif; border-bottom: 1px solid #eee; padding-bottom: 15px;">PROFESSIONAL EXPERIENCE</h2>
                        ${adjustedExperience.map(exp => `
                <div style="margin-bottom: 40px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                    <h3 style="margin: 0; color: ${primaryColor}; font-size: 16px; font-weight: 500; font-family: 'Inter', sans-serif;">${exp.title}</h3>
                                    <span style="color: ${secondaryColor}; font-size: 14px; font-weight: 300; font-family: 'Inter', sans-serif;">${exp.date || exp.period}</span>
                                </div>
                                <div style="color: ${secondaryColor}; font-size: 15px; margin-bottom: 15px; font-weight: 400; font-family: 'Inter', sans-serif;">${exp.company}</div>
                                <p style="margin: 0; line-height: 1.7; color: ${textColor}; font-size: 14px; font-weight: 300; font-family: 'Inter', sans-serif;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Skills Section -->
                ${sections.skills && Object.keys(skills).length > 0 ? `
                    <div style="margin-bottom: 50px;">
                        <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 25px; font-weight: 400; font-family: 'Inter', sans-serif; border-bottom: 1px solid #eee; padding-bottom: 15px;">SKILLS & EXPERTISE</h2>
                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; color: ${primaryColor}; font-size: 15px; font-weight: 500; font-family: 'Inter', sans-serif;">${categoryName}</h3>
                                <p style="margin: 0; color: ${textColor}; font-size: 14px; line-height: 1.6; font-weight: 300; font-family: 'Inter', sans-serif;">${skillList.map(skill => skill.name || skill).join(' • ')}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    generateChronoResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#e74c3c';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Montserrat, Source Sans Pro, sans-serif'; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- The Chrono - Timeline Focused Layout -->
                <!-- Header -->
                <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; border-radius: 0 0 30px 30px; margin-bottom: 50px;">
                    ${sections.photo && photoSettings ? `
                        <div style="margin-bottom: 20px;">
                            <div style="width: 120px; height: 120px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '15px' : '0'}; margin: 0 auto; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                                ${photoSettings.photoUrl ? 
                                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<span style="font-size: 48px; color: white; font-weight: bold; font-family: 'Montserrat', sans-serif;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'C'}</span>`
                                }
                            </div>
                        </div>
                    ` : ''}
                    <h1 style="margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 1px; font-family: 'Montserrat', sans-serif;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.9; font-weight: 300; font-family: 'Source Sans Pro', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 25px; display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 14px; font-family: 'Source Sans Pro', sans-serif;">
                            ${contact.location ? `<div style="display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                            ${contact.phone ? `<div style="display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                            ${contact.email ? `<div style="display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                            ${contact.linkedin ? `<div style="display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <div style="padding: 0 40px 40px;">
                                            <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 50px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Montserrat', sans-serif;">PROFESSIONAL SUMMARY</h2>
                                <div style="line-height: 1.8; font-size: 16px; color: ${textColor}; font-family: 'Source Sans Pro', sans-serif;">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                    <!-- Work Experience with Visual Timeline -->
                    ${sections.experience && adjustedExperience.length > 0 ? `
                        <div style="margin-bottom: 50px;">
                            <h2 style="margin: 0 0 40px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Montserrat', sans-serif;">PROFESSIONAL EXPERIENCE</h2>
                            <div style="position: relative;">
                                <!-- Timeline Line -->
                                <div style="position: absolute; left: 120px; top: 0; width: 3px; height: 100%; background: ${secondaryColor};"></div>
                                ${adjustedExperience.map((exp, index) => `
                                    <div style="margin-bottom: 40px; position: relative; padding-left: 200px;">
                                        <!-- Timeline Dot -->
                                        <div style="position: absolute; left: 110px; top: 0; width: 20px; height: 20px; background: ${secondaryColor}; border-radius: 50%; border: 4px solid ${bgColor}; box-shadow: 0 0 0 3px ${secondaryColor};"></div>
                                        <!-- Date -->
                                        <div style="position: absolute; left: 0; top: 0; width: 100px; text-align: right;">
                                            <div style="color: ${secondaryColor}; font-size: 14px; font-weight: 600; font-family: 'Montserrat', sans-serif;">${exp.date || exp.period}</div>
                                        </div>
                                        <!-- Content -->
                                        <div style="background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); border-left: 4px solid ${secondaryColor};">
                                            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: ${primaryColor}; font-family: 'Montserrat', sans-serif;">${exp.title}</h3>
                                            <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 15px; font-weight: 600; font-family: 'Montserrat', sans-serif;">${exp.company}</div>
                                            <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${textColor}; font-family: 'Source Sans Pro', sans-serif;">${exp.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Skills Section -->
                    ${sections.skills && Object.keys(skills).length > 0 ? `
                        <div style="margin-bottom: 50px;">
                            <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; font-family: 'Montserrat', sans-serif;">SKILLS & EXPERTISE</h2>
                            ${Object.entries(skills).map(([categoryName, skillList]) => `
                                <div style="margin-bottom: 30px; background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                                    <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: ${primaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Montserrat', sans-serif;">${categoryName}</h3>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                        ${skillList.map(skill => `
                                            <span style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: white; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; font-family: 'Source Sans Pro', sans-serif;">${skill.name || skill}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return html;
    }

    generatePortfolioResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#1e40af';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3b82f6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Fira Sans, Work Sans, sans-serif'; max-width: 1000px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- The Portfolio - Two Column with Projects Focus -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 300px; background: ${primaryColor}; color: white; padding: 40px 30px;">
                        <!-- Profile Picture -->
                        <div style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 48px; color: white; font-weight: bold; font-family: 'Fira Sans', sans-serif;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'P'}</span>
                        </div>
                        
                        <!-- Name and Title -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; font-family: 'Fira Sans', sans-serif;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 300; font-family: 'Work Sans', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Contact Information -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px; font-family: 'Fira Sans', sans-serif;">CONTACT</h3>
                                <div style="font-size: 13px; line-height: 1.8; font-family: 'Work Sans', sans-serif;">
                                    ${contact.email ? `<div style="margin: 8px 0; display: flex; align-items: center;">📧 ${contact.email}</div>` : ''}
                                    ${contact.phone ? `<div style="margin: 8px 0; display: flex; align-items: center;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.location ? `<div style="margin: 8px 0; display: flex; align-items: center;">📍 ${contact.location}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin: 8px 0; display: flex; align-items: center;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px; font-family: 'Fira Sans', sans-serif;">SKILLS</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; opacity: 0.9; font-family: 'Fira Sans', sans-serif;">${categoryName}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                            ${skillList.map(skill => `
                                                <span style="background: rgba(255,255,255,0.2); color: white; padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; font-family: 'Work Sans', sans-serif;">${skill.name || skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 40px 35px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Fira Sans', sans-serif;">PROFESSIONAL SUMMARY</h2>
                                <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${textColor}; font-family: 'Work Sans', sans-serif;">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Fira Sans', sans-serif;">PROFESSIONAL EXPERIENCE</h2>
                                ${adjustedExperience.map(exp => `
                                    <div style="margin-bottom: 30px; padding-left: 20px; border-left: 3px solid ${secondaryColor};">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor}; font-family: 'Fira Sans', sans-serif;">${exp.title}</h3>
                                            <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px; font-family: 'Work Sans', sans-serif;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 12px; font-weight: 600; font-family: 'Fira Sans', sans-serif;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; font-size: 14px; color: ${textColor}; font-family: 'Work Sans', sans-serif;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Projects Section (Enhanced) -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Fira Sans', sans-serif;">PROJECTS & TECHNOLOGIES</h2>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 30px; background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
                                        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: ${primaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 10px; font-family: 'Fira Sans', sans-serif;">${categoryName}</h3>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${skillList.map(skill => `
                                                <span style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: white; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; font-family: 'Work Sans', sans-serif;">${skill.name || skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateCoderResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#1a1a1a';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#00ff00';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#0a0a0a';
        const textColor = document.getElementById('resume-text-color')?.value || '#ffffff';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Space Mono, JetBrains Mono, monospace'; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- The Coder - Dark Theme with Code Style -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 280px; background: #111111; color: white; padding: 30px 25px; border-right: 2px solid ${secondaryColor};">
                        <!-- Profile Picture -->
                        <div style="width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 25px; overflow: hidden; border: 4px solid ${secondaryColor}; background: ${secondaryColor}; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 48px; color: ${bgColor}; font-weight: bold; font-family: 'Space Mono', monospace;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'C'}</span>
                        </div>
                        
                        <!-- Contact Information -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: ${secondaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 8px; font-family: 'Space Mono', monospace;">// CONTACT</h3>
                                ${contact.location ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace;"><span style="margin-right: 8px; color: ${secondaryColor};">📍</span> ${contact.location}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace;"><span style="margin-right: 8px; color: ${secondaryColor};">📞</span> ${contact.phone}</div>` : ''}
                                ${contact.email ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace;"><span style="margin-right: 8px; color: ${secondaryColor};">📧</span> ${contact.email}</div>` : ''}
                                ${contact.linkedin ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; font-family: 'JetBrains Mono', monospace;"><span style="margin-right: 8px; color: ${secondaryColor};">🔗</span> LinkedIn</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: ${secondaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 8px; font-family: 'Space Mono', monospace;">// SKILLS</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: ${secondaryColor}; font-family: 'Space Mono', monospace;">// ${categoryName}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                            ${skillList.map(skill => `
                                                <span style="background: rgba(0,255,0,0.1); color: ${secondaryColor}; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-family: 'JetBrains Mono', monospace; border: 1px solid ${secondaryColor};">${skill.name || skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 40px 35px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="margin: 0; color: ${secondaryColor}; font-size: 36px; font-weight: 700; font-family: 'Space Mono', monospace;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0 0 0; color: #888; font-size: 18px; font-family: 'JetBrains Mono', monospace;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${secondaryColor}; font-family: 'Space Mono', monospace;">// PROFESSIONAL SUMMARY</h2>
                                <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${textColor}; font-family: 'JetBrains Mono', monospace;">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: ${secondaryColor}; font-family: 'Space Mono', monospace;">// WORK EXPERIENCE</h2>
                                ${adjustedExperience.map((exp, index) => `
                                    <div style="margin-bottom: 30px; background: #111111; border-radius: 8px; padding: 25px; border: 1px solid #333;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor}; font-family: 'Space Mono', monospace;">${exp.title}</h3>
                                            <span style="color: #888; font-size: 14px; font-weight: 500; background: #222; padding: 4px 12px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: #888; font-size: 16px; margin-bottom: 12px; font-weight: 600; font-family: 'Space Mono', monospace;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; font-size: 14px; color: ${textColor}; font-family: 'JetBrains Mono', monospace;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateHybridResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#2c3e50';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3498db';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#333333';
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Playfair Display, Raleway, serif'; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- The Hybrid - Single Column Header + Two Column Layout -->
                <!-- Header Section -->
                <div style="text-align: center; padding: 50px 40px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; border-radius: 0 0 30px 30px; margin-bottom: 40px;">
                    <h1 style="margin: 0; font-size: 48px; font-weight: 700; letter-spacing: 1px; font-family: 'Playfair Display', serif;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 15px 0 0 0; font-size: 22px; opacity: 0.9; font-weight: 300; font-family: 'Raleway', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 25px; display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 15px; font-family: 'Raleway', sans-serif;">
                            ${contact.location ? `<div style="display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                            ${contact.phone ? `<div style="display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                            ${contact.email ? `<div style="display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                            ${contact.linkedin ? `<div style="display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Two Column Layout -->
                <div style="display: flex; padding: 0 40px 40px;">
                    <!-- Left Column -->
                    <div style="width: 300px; padding-right: 30px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif;">PROFESSIONAL SUMMARY</h2>
                                <p style="margin: 0; line-height: 1.8; font-size: 15px; color: ${textColor}; font-family: 'Raleway', sans-serif;">${adjustedAbout.description}</p>
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif;">SKILLS & EXPERTISE</h2>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                    <div style="margin-bottom: 25px;">
                                        <h3 style="margin: 0 0 12px 0; color: ${primaryColor}; font-size: 16px; font-weight: 600; font-family: 'Playfair Display', serif;">${categoryName}</h3>
                                        <p style="margin: 0; color: ${textColor}; font-size: 14px; line-height: 1.6; font-family: 'Raleway', sans-serif;">${skillList.map(skill => skill.name || skill).join(' • ')}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Right Column -->
                    <div style="flex: 1;">
                        <!-- Work Experience -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div>
                                <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif;">PROFESSIONAL EXPERIENCE</h2>
                                ${adjustedExperience.map(exp => `
                                    <div style="margin-bottom: 35px; padding-left: 20px; border-left: 3px solid ${secondaryColor};">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor}; font-family: 'Playfair Display', serif;">${exp.title}</h3>
                                            <span style="color: #718096; font-size: 14px; font-weight: 500; background: #f7fafc; padding: 4px 12px; border-radius: 15px; font-family: 'Raleway', sans-serif;">${exp.date || exp.period}</span>
                                        </div>
                                        <div style="color: ${secondaryColor}; font-size: 16px; margin-bottom: 12px; font-weight: 600; font-family: 'Playfair Display', serif;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.7; font-size: 14px; color: ${textColor}; font-family: 'Raleway', sans-serif;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateDashboardResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#1e40af';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#3b82f6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#f8fafc';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real subtitle from website data
        const websiteData = this.websiteData;
        const realSubtitle = hero.subtitle || hero.title || (websiteData && websiteData.hero && websiteData.hero.subtitle) || (websiteData && websiteData.hero && websiteData.hero.title) || 'Professional Title';

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; padding: 40px 20px;">
                <!-- The Dashboard - Elegant Data-Driven Layout -->
                <div style="display: grid; grid-template-columns: 320px 1fr; gap: 0; min-height: 100vh; border-radius: 25px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.1);">
                    <!-- Left Sidebar - Elegant Info Panel -->
                    <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; padding: 40px 30px; position: relative;">
                        <!-- Elegant Profile Section -->
                        <div style="text-align: center; margin-bottom: 40px;">
                            ${sections.photo && photoSettings ? this.createPhotoContainer(photoSettings, hero, 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)', 140) : ''}
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${realName}</h1>
                            <p style="margin: 12px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 400;">${realSubtitle}</p>
                        </div>

                        <!-- Elegant Stats Dashboard -->
                        <div style="margin-bottom: 40px;">
                            <h3 style="margin: 0 0 25px 0; font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.9); text-align: center;">📊 Key Metrics</h3>
                            <div style="display: grid; gap: 12px;">
                                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); color: white; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
                                    <div style="font-size: 22px; font-weight: 700;">7+</div>
                                    <div style="font-size: 11px; opacity: 0.9;">Years Experience</div>
                                </div>
                                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); color: white; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
                                    <div style="font-size: 22px; font-weight: 700;">200+</div>
                                    <div style="font-size: 11px; opacity: 0.9;">Students Guided</div>
                                </div>
                                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); color: white; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
                                    <div style="font-size: 22px; font-weight: 700;">98%</div>
                                    <div style="font-size: 11px; opacity: 0.9;">Success Rate</div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">📞 Contact</h3>
                                <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                                    ${contact.location ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                                    ${contact.phone ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.email ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- About Summary for Left Column -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">📋 About</h3>
                                <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                                    ${this.truncateText(adjustedAbout.description, 200)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Chart -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">⚡ Skills Overview</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                            <span style="font-size: 14px; font-weight: 500; color: #374151;">${categoryName}</span>
                                            <span style="font-size: 12px; color: #6b7280;">${skillList.length} skills</span>
                        </div>
                                        <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                                            <div style="width: ${Math.min(skillList.length * 20, 100)}%; height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); border-radius: 3px;"></div>
                    </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                </div>

                    <!-- Main Content -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📋 Professional Summary
                                </h2>
                                <div style="line-height: 1.7; font-size: 15px; color: #1f2937;">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Experience Table -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    💼 Professional Experience
                                </h2>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                        <thead>
                                            <tr style="background: ${primaryColor}; color: white;">
                                                <th style="padding: 15px; text-align: left; border-radius: 8px 0 0 8px;">Position</th>
                                                <th style="padding: 15px; text-align: left;">Company</th>
                                                <th style="padding: 15px; text-align: left;">Duration</th>
                                                <th style="padding: 15px; text-align: left; border-radius: 0 8px 8px 0;">Key Achievements</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${adjustedExperience.map((exp, index) => `
                                                <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background: #f9fafb;' : ''}">
                                                    <td style="padding: 15px; font-weight: 600; color: ${primaryColor};">${exp.title}</td>
                                                    <td style="padding: 15px; color: #374151;">${exp.company}</td>
                                                    <td style="padding: 15px; color: #6b7280; font-size: 13px;">${exp.date || exp.period}</td>
                                                    <td style="padding: 15px; color: #1f2937; line-height: 1.5;">${exp.description}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Grid -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    🎯 Skills & Expertise
                                </h2>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                    ${Object.entries(skills).map(([categoryName, skillList]) => `
                                        <div style="background: #f8fafc; border-radius: 15px; padding: 20px; border-left: 4px solid ${primaryColor};">
                                            <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">${categoryName}</h3>
                                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                ${skillList.map(skill => `
                                                    <span style="background: white; color: ${primaryColor}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid ${primaryColor};">${skill.name || skill}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateGlassmorphismResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#6366f1';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#8b5cf6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#f8fafc';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real data from website
        const realName = this.getRealData(hero, 'name');
        const realSubtitle = this.getRealData(hero, 'subtitle');
        const realLocation = this.getRealData(contact, 'location');
        const realPhone = this.getRealData(contact, 'phone');
        const realEmail = this.getRealData(contact, 'email');

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, ${bgColor} 0%, #e0e7ff 100%); color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Glassmorphism - Modern Glass Effect -->
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.2); padding: 40px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Glass Effect -->
                    <div style="text-align: center; margin-bottom: 50px; padding: 40px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.3);">
                        ${sections.photo && photoSettings ? `
                            <div style="width: 150px; height: 150px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '20px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 3px solid rgba(255, 255, 255, 0.4); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); backdrop-filter: blur(5px);">
                                ${photoSettings.photoUrl ? 
                                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 60px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'G'}</span>
                                    </div>`
                                }
                            </div>
                        ` : ''}
                        <h1 style="margin: 0; font-size: 48px; font-weight: 700; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${realName}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 20px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${realSubtitle}</p>
                    </div>

                    <!-- Content Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <!-- Left Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- About Section -->
                            ${sections.about && adjustedAbout.description ? `
                                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        ✨ About Me
                                    </h2>
                                    <div style="line-height: 1.8; font-size: 16px; color: rgba(255, 255, 255, 0.9);">${adjustedAbout.description}</div>
                                </div>
                            ` : ''}

                            <!-- Contact Info -->
                            ${sections.contact ? `
                                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        📞 Contact
                                    </h2>
                                    <div style="font-size: 15px; line-height: 1.8; color: rgba(255, 255, 255, 0.95);">
                                        ${realLocation ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📍 ${realLocation}</div>` : ''}
                                        ${realPhone ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📞 ${realPhone}</div>` : ''}
                                        ${realEmail ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📧 ${realEmail}</div>` : ''}
                                        ${contact.linkedin ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">🔗 LinkedIn</div>` : ''}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Skills Glass Cards -->
                            ${sections.skills && Object.keys(skills).length > 0 ? `
                                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                    <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        🎯 Skills
                                    </h2>
                                    <div style="display: flex; flex-direction: column; gap: 20px;">
                                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                                            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">${categoryName}</h3>
                                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                    ${skillList.map(skill => `
                                                        <span style="background: rgba(255, 255, 255, 0.2); color: ${primaryColor}; padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 500; backdrop-filter: blur(5px); border: 1px solid rgba(255, 255, 255, 0.3);">${skill.name || skill}</span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Right Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- Experience Timeline -->
                            ${sections.experience && adjustedExperience.length > 0 ? `
                                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                    <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        💼 Experience
                                    </h2>
                                    <div style="position: relative;">
                                        ${adjustedExperience.map((exp, index) => `
                                            <div style="position: relative; margin-bottom: 30px; padding-left: 30px;">
                                                <div style="position: absolute; left: 0; top: 0; width: 12px; height: 12px; background: ${primaryColor}; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.3);"></div>
                                                ${index < adjustedExperience.length - 1 ? `<div style="position: absolute; left: 5px; top: 12px; width: 2px; height: 40px; background: linear-gradient(to bottom, ${primaryColor}, transparent);"></div>` : ''}
                                                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">${exp.title}</h3>
                                                        <span style="font-size: 13px; color: rgba(255, 255, 255, 0.7); background: rgba(255, 255, 255, 0.1); padding: 4px 12px; border-radius: 12px;">${exp.date || exp.period}</span>
                                                    </div>
                                                    <p style="margin: 0 0 10px 0; font-size: 15px; color: rgba(255, 255, 255, 0.8); font-weight: 500;">${exp.company}</p>
                                                    <div style="line-height: 1.6; font-size: 14px; color: rgba(255, 255, 255, 0.9);">${exp.description}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateNeonResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#00ff88';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#ff0080';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#0a0a0a';
        const textColor = document.getElementById('resume-text-color')?.value || '#ffffff';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real data from website
        const realName = this.getRealData(hero, 'name');
        const realSubtitle = this.getRealData(hero, 'subtitle');
        const realLocation = this.getRealData(contact, 'location');
        const realPhone = this.getRealData(contact, 'phone');
        const realEmail = this.getRealData(contact, 'email');

        let html = `
            <div style="font-family: 'Orbitron, monospace'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px; position: relative; overflow: hidden;">
                <!-- Neon Grid Background -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
                    linear-gradient(rgba(${primaryColor}, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(${primaryColor}, 0.1) 1px, transparent 1px);
                    background-size: 50px 50px; z-index: 1;"></div>
                
                <!-- Main Content -->
                <div style="position: relative; z-index: 2;">
                    <!-- Header with Neon Effect -->
                    <div style="text-align: center; margin-bottom: 50px; padding: 40px; background: rgba(0, 0, 0, 0.8); border-radius: 20px; border: 2px solid ${primaryColor}; box-shadow: 0 0 30px ${primaryColor}, inset 0 0 30px rgba(0, 255, 136, 0.1);">
                        ${sections.photo && photoSettings ? `
                            <div style="width: 150px; height: 150px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '20px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 3px solid ${primaryColor}; box-shadow: 0 0 20px ${primaryColor};">
                                ${photoSettings.photoUrl ? 
                                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">` :
                                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 60px; color: ${bgColor}; font-weight: bold;">${realName ? realName.charAt(0).toUpperCase() : 'N'}</span>
                                    </div>`
                                }
                            </div>
                        ` : ''}
                        <h1 style="margin: 0; font-size: 48px; font-weight: 700; color: ${primaryColor}; text-shadow: 0 0 20px ${primaryColor}, 0 0 40px ${primaryColor};">${realName}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 20px; color: ${secondaryColor}; text-shadow: 0 0 10px ${secondaryColor}; font-weight: 500;">${realSubtitle}</p>
                    </div>

                    <!-- Content Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <!-- Left Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- About Section -->
                            ${sections.about && adjustedAbout.description ? `
                                <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 30px; border: 2px solid ${primaryColor}; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; text-shadow: 0 0 10px ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        ⚡ About
                                    </h2>
                                    <div style="line-height: 1.8; font-size: 16px; color: ${textColor};">${adjustedAbout.description}</div>
                                </div>
                            ` : ''}

                            <!-- Contact Info -->
                            ${sections.contact ? `
                                <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 30px; border: 2px solid ${secondaryColor}; box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${secondaryColor}; text-shadow: 0 0 10px ${secondaryColor}; display: flex; align-items: center; gap: 10px;">
                                        📡 Contact
                                    </h2>
                                    <div style="font-size: 15px; line-height: 1.8; color: ${textColor};">
                                        ${contact.location ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📍 ${contact.location}</div>` : ''}
                                        ${contact.phone ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📞 ${contact.phone}</div>` : ''}
                                        ${contact.email ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📧 ${contact.email}</div>` : ''}
                                        ${contact.linkedin ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">🔗 LinkedIn</div>` : ''}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Skills with Neon Bars -->
                            ${sections.skills && Object.keys(skills).length > 0 ? `
                                <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 30px; border: 2px solid ${primaryColor}; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);">
                                    <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; text-shadow: 0 0 10px ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                        🎯 Skills
                                    </h2>
                                    <div style="display: flex; flex-direction: column; gap: 20px;">
                                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                                            <div style="background: rgba(0, 0, 0, 0.5); border-radius: 15px; padding: 20px; border: 1px solid ${primaryColor};">
                                                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: ${secondaryColor}; text-shadow: 0 0 5px ${secondaryColor};">${categoryName}</h3>
                                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                    ${skillList.map(skill => `
                                                        <span style="background: rgba(0, 255, 136, 0.2); color: ${primaryColor}; padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 500; border: 1px solid ${primaryColor}; box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);">${skill.name || skill}</span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Right Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- Experience Timeline -->
                            ${sections.experience && adjustedExperience.length > 0 ? `
                                <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 30px; border: 2px solid ${secondaryColor}; box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);">
                                    <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 600; color: ${secondaryColor}; text-shadow: 0 0 10px ${secondaryColor}; display: flex; align-items: center; gap: 10px;">
                                        💼 Experience
                                    </h2>
                                    <div style="position: relative;">
                                        ${adjustedExperience.map((exp, index) => `
                                            <div style="position: relative; margin-bottom: 30px; padding-left: 30px;">
                                                <div style="position: absolute; left: 0; top: 0; width: 12px; height: 12px; background: ${secondaryColor}; border-radius: 50%; box-shadow: 0 0 10px ${secondaryColor};"></div>
                                                ${index < adjustedExperience.length - 1 ? `<div style="position: absolute; left: 5px; top: 12px; width: 2px; height: 40px; background: linear-gradient(to bottom, ${secondaryColor}, transparent); box-shadow: 0 0 5px ${secondaryColor};"></div>` : ''}
                                                <div style="background: rgba(0, 0, 0, 0.5); border-radius: 15px; padding: 20px; border: 1px solid ${secondaryColor};">
                                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor}; text-shadow: 0 0 5px ${primaryColor};">${exp.title}</h3>
                                                        <span style="font-size: 13px; color: ${secondaryColor}; background: rgba(255, 0, 128, 0.2); padding: 4px 12px; border-radius: 12px; border: 1px solid ${secondaryColor};">${exp.date || exp.period}</span>
                                                    </div>
                                                    <p style="margin: 0 0 10px 0; font-size: 15px; color: ${textColor}; font-weight: 500;">${exp.company}</p>
                                                    <div style="line-height: 1.6; font-size: 14px; color: ${textColor};">${exp.description}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateGradientResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#667eea';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#764ba2';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#f093fb';
        const textColor = document.getElementById('resume-text-color')?.value || '#ffffff';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        // Get real data from website
        const realName = this.getRealData(hero, 'name');
        const realSubtitle = this.getRealData(hero, 'subtitle');
        const realLocation = this.getRealData(contact, 'location');
        const realPhone = this.getRealData(contact, 'phone');
        const realEmail = this.getRealData(contact, 'email');

        let html = `
            <div style="font-family: 'Poppins, sans-serif'; max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${bgColor} 100%); color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Gradient - Colorful Modern -->
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.2); padding: 40px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);">
                    <!-- Header with Gradient -->
                    <div style="text-align: center; margin-bottom: 50px; padding: 40px; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.3);">
                        ${sections.photo && photoSettings ? `
                            <div style="width: 150px; height: 150px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '20px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255, 255, 255, 0.4); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);">
                                ${photoSettings.photoUrl ? 
                                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 60px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'G'}</span>
                                    </div>`
                                }
                            </div>
                        ` : ''}
                        <h1 style="margin: 0; font-size: 48px; font-weight: 700; color: white; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">${realName}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 20px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${realSubtitle}</p>
                    </div>

                    <!-- Content Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <!-- Left Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- About Section -->
                            ${sections.about && adjustedAbout.description ? `
                                <div style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.3);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;">
                                        🌈 About Me
                                    </h2>
                                    <div style="line-height: 1.8; font-size: 16px; color: rgba(255, 255, 255, 0.95);">${adjustedAbout.description}</div>
                                </div>
                            ` : ''}

                            <!-- Contact Info -->
                            ${sections.contact ? `
                                <div style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.3);">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;">
                                        📞 Contact
                                    </h2>
                                    <div style="font-size: 15px; line-height: 1.8; color: rgba(255, 255, 255, 0.95);">
                                        ${contact.location ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📍 ${contact.location}</div>` : ''}
                                        ${contact.phone ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📞 ${contact.phone}</div>` : ''}
                                        ${contact.email ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📧 ${contact.email}</div>` : ''}
                                        ${contact.linkedin ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">🔗 LinkedIn</div>` : ''}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Skills with Gradient Bars -->
                            ${sections.skills && Object.keys(skills).length > 0 ? `
                                <div style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.3);">
                                    <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 600; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;">
                                        🎯 Skills
                                    </h2>
                                    <div style="display: flex; flex-direction: column; gap: 20px;">
                                        ${Object.entries(skills).map(([categoryName, skillList]) => `
                                            <div style="background: rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${categoryName}</h3>
                                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                    ${skillList.map(skill => `
                                                        <span style="background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%); color: white; padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 500; border: 1px solid rgba(255, 255, 255, 0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${skill.name || skill}</span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Right Column -->
                        <div style="display: flex; flex-direction: column; gap: 30px;">
                            <!-- Experience Timeline -->
                            ${sections.experience && adjustedExperience.length > 0 ? `
                                <div style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.3);">
                                    <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 600; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;">
                                        💼 Experience
                                    </h2>
                                    <div style="position: relative;">
                                        ${adjustedExperience.map((exp, index) => `
                                            <div style="position: relative; margin-bottom: 30px; padding-left: 30px;">
                                                <div style="position: absolute; left: 0; top: 0; width: 12px; height: 12px; background: white; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.5); box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);"></div>
                                                ${index < adjustedExperience.length - 1 ? `<div style="position: absolute; left: 5px; top: 12px; width: 2px; height: 40px; background: linear-gradient(to bottom, white, transparent);"></div>` : ''}
                                                <div style="background: rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.2);">
                                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${exp.title}</h3>
                                                        <span style="font-size: 13px; color: white; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.3);">${exp.date || exp.period}</span>
                                                    </div>
                                                    <p style="margin: 0 0 10px 0; font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${exp.company}</p>
                                                    <div style="line-height: 1.6; font-size: 14px; color: rgba(255, 255, 255, 0.95);">${exp.description}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateCardResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#3b82f6';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#1e40af';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#f8fafc';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Card - Card-Based Layout -->
                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 30px;">
                    <!-- Left Sidebar Cards -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <!-- Profile Card -->
                        <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
                            ${sections.photo && photoSettings ? `
                                <div style="width: 120px; height: 120px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '15px' : '0'}; margin: 0 auto 20px; overflow: hidden; border: 4px solid ${primaryColor}; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                                    ${photoSettings.photoUrl ? 
                                        `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 48px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'C'}</span>
                                        </div>`
                                    }
                                </div>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: ${primaryColor};">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 8px 0 0 0; font-size: 16px; color: #6b7280; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Contact Card -->
                        ${sections.contact ? `
                            <div style="background: white; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">📞 Contact</h3>
                                <div style="font-size: 14px; line-height: 1.6; color: #6b7280;">
                                    ${contact.location ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                                    ${contact.phone ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.email ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Card -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">🎯 Skills</h3>
                                <div style="display: flex; flex-direction: column; gap: 15px;">
                                    ${Object.entries(skills).map(([categoryName, skillList]) => `
                                        <div>
                                            <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: ${secondaryColor};">${categoryName}</h4>
                                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                                ${skillList.map(skill => `
                                                    <span style="background: ${primaryColor}; color: white; padding: 4px 10px; border-radius: 15px; font-size: 11px; font-weight: 500;">${skill.name || skill}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content Cards -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <!-- About Card -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📋 About Me
                                </h2>
                                <div style="line-height: 1.7; font-size: 15px; color: ${textColor};">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Experience Cards -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    💼 Experience
                                </h2>
                                <div style="display: flex; flex-direction: column; gap: 20px;">
                                    ${adjustedExperience.map((exp, index) => `
                                        <div style="background: #f8fafc; border-radius: 15px; padding: 20px; border-left: 4px solid ${primaryColor};">
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">${exp.title}</h3>
                                                <span style="font-size: 12px; color: #6b7280; background: #e5e7eb; padding: 4px 10px; border-radius: 10px;">${exp.date || exp.period}</span>
                                            </div>
                                            <p style="margin: 0 0 10px 0; font-size: 15px; color: ${secondaryColor}; font-weight: 500;">${exp.company}</p>
                                            <div style="line-height: 1.6; font-size: 14px; color: ${textColor};">${exp.description}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateInfographicResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#10b981';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#059669';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Infographic - Visual Data -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                    <!-- Left Column -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        <!-- Header with Stats -->
                        <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
                            ${sections.photo && photoSettings ? `
                                <div style="width: 120px; height: 120px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '15px' : '0'}; margin: 0 auto 20px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                                    ${photoSettings.photoUrl ? 
                                        `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 48px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'I'}</span>
                                        </div>`
                                    }
                                </div>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 36px; font-weight: 700;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${hero.subtitle || 'Professional Title'}</p>
                            
                            <!-- Stats Row -->
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 28px; font-weight: 700;">7+</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Years</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 28px; font-weight: 700;">200+</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Projects</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 28px; font-weight: 700;">98%</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Success</div>
                                </div>
                            </div>
                        </div>

                        <!-- About Section -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📊 About
                                </h2>
                                <div style="line-height: 1.7; font-size: 15px; color: ${textColor};">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📞 Contact
                                </h2>
                                <div style="font-size: 15px; line-height: 1.8; color: #6b7280;">
                                    ${contact.location ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📍 ${contact.location}</div>` : ''}
                                    ${contact.phone ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.email ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">📧 ${contact.email}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Right Column -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        <!-- Skills Chart -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📈 Skills Overview
                                </h2>
                                <div style="display: flex; flex-direction: column; gap: 20px;">
                                    ${Object.entries(skills).map(([categoryName, skillList]) => `
                                        <div>
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: ${secondaryColor};">${categoryName}</h3>
                                                <span style="font-size: 12px; color: #6b7280;">${skillList.length} skills</span>
                                            </div>
                                            <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                                                <div style="width: ${Math.min(skillList.length * 15, 100)}%; height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); border-radius: 4px;"></div>
                                            </div>
                                            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                                                ${skillList.map(skill => `
                                                    <span style="background: #f3f4f6; color: ${primaryColor}; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; border: 1px solid #e5e7eb;">${skill.name || skill}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Experience Timeline -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📅 Experience Timeline
                                </h2>
                                <div style="position: relative;">
                                    ${adjustedExperience.map((exp, index) => `
                                        <div style="position: relative; margin-bottom: 30px; padding-left: 40px;">
                                            <div style="position: absolute; left: 0; top: 0; width: 16px; height: 16px; background: ${primaryColor}; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 3px ${primaryColor};"></div>
                                            ${index < adjustedExperience.length - 1 ? `<div style="position: absolute; left: 7px; top: 16px; width: 2px; height: 50px; background: ${primaryColor};"></div>` : ''}
                                            <div style="background: #f8fafc; border-radius: 15px; padding: 20px; border-left: 4px solid ${primaryColor};">
                                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">${exp.title}</h3>
                                                    <span style="font-size: 12px; color: #6b7280; background: #e5e7eb; padding: 4px 10px; border-radius: 10px;">${exp.date || exp.period}</span>
                                                </div>
                                                <p style="margin: 0 0 10px 0; font-size: 15px; color: ${secondaryColor}; font-weight: 500;">${exp.company}</p>
                                                <div style="line-height: 1.6; font-size: 14px; color: ${textColor};">${exp.description}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateMagazineResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#1f2937';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#6b7280';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Playfair Display, serif'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Magazine - Editorial Style -->
                <div style="background: white; border-radius: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Magazine Header -->
                    <div style="background: ${primaryColor}; color: white; padding: 60px 40px; text-align: center;">
                        ${sections.photo && photoSettings ? `
                            <div style="width: 150px; height: 150px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '20px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
                                ${photoSettings.photoUrl ? 
                                    `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 60px; color: white; font-weight: bold; font-family: 'Playfair Display', serif;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'M'}</span>
                                    </div>`
                                }
                            </div>
                        ` : ''}
                        <h1 style="margin: 0; font-size: 56px; font-weight: 700; letter-spacing: 2px; font-family: 'Playfair Display', serif;">${hero.name || 'Your Name'}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 24px; opacity: 0.9; font-family: 'Lora', serif; font-style: italic;">${hero.subtitle || 'Professional Title'}</p>
                    </div>

                    <!-- Magazine Content -->
                    <div style="padding: 60px 40px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
                            <!-- Left Column -->
                            <div style="display: flex; flex-direction: column; gap: 40px;">
                                <!-- About Section -->
                                ${sections.about && adjustedAbout.description ? `
                                    <div>
                                        <h2 style="margin: 0 0 30px 0; font-size: 32px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif; border-bottom: 3px solid ${primaryColor}; padding-bottom: 10px;">
                                            About
                                        </h2>
                                        <div style="line-height: 1.8; font-size: 18px; color: ${textColor}; font-family: 'Lora', serif;">${adjustedAbout.description}</div>
                                    </div>
                                ` : ''}

                                <!-- Contact Info -->
                                ${sections.contact ? `
                                    <div>
                                        <h2 style="margin: 0 0 30px 0; font-size: 32px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif; border-bottom: 3px solid ${primaryColor}; padding-bottom: 10px;">
                                            Contact
                                        </h2>
                                        <div style="font-size: 16px; line-height: 2; color: ${textColor}; font-family: 'Lora', serif;">
                                            ${contact.location ? `<div style="margin-bottom: 15px;">📍 ${contact.location}</div>` : ''}
                                            ${contact.phone ? `<div style="margin-bottom: 15px;">📞 ${contact.phone}</div>` : ''}
                                            ${contact.email ? `<div style="margin-bottom: 15px;">📧 ${contact.email}</div>` : ''}
                                            ${contact.linkedin ? `<div style="margin-bottom: 15px;">🔗 LinkedIn</div>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Right Column -->
                            <div style="display: flex; flex-direction: column; gap: 40px;">
                                <!-- Experience Section -->
                                ${sections.experience && adjustedExperience.length > 0 ? `
                                    <div>
                                        <h2 style="margin: 0 0 30px 0; font-size: 32px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif; border-bottom: 3px solid ${primaryColor}; padding-bottom: 10px;">
                                            Experience
                                        </h2>
                                        <div style="display: flex; flex-direction: column; gap: 30px;">
                                            ${adjustedExperience.map((exp, index) => `
                                                <div style="border-left: 4px solid ${primaryColor}; padding-left: 30px; position: relative;">
                                                    <div style="position: absolute; left: -8px; top: 0; width: 12px; height: 12px; background: ${primaryColor}; border-radius: 50%;"></div>
                                                    <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; font-family: 'Playfair Display', serif;">${exp.title}</h3>
                                                    <p style="margin: 0 0 10px 0; font-size: 18px; color: ${secondaryColor}; font-family: 'Lora', serif; font-style: italic;">${exp.company}</p>
                                                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #9ca3af; font-family: 'Lora', serif;">${exp.date || exp.period}</p>
                                                    <div style="line-height: 1.7; font-size: 16px; color: ${textColor}; font-family: 'Lora', serif;">${exp.description}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Skills Section -->
                                ${sections.skills && Object.keys(skills).length > 0 ? `
                                    <div>
                                        <h2 style="margin: 0 0 30px 0; font-size: 32px; font-weight: 700; color: ${primaryColor}; font-family: 'Playfair Display', serif; border-bottom: 3px solid ${primaryColor}; padding-bottom: 10px;">
                                            Skills
                                        </h2>
                                        <div style="display: flex; flex-direction: column; gap: 25px;">
                                            ${Object.entries(skills).map(([categoryName, skillList]) => `
                                                <div>
                                                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: ${secondaryColor}; font-family: 'Playfair Display', serif;">${categoryName}</h3>
                                                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                                        ${skillList.map(skill => `
                                                            <span style="background: #f3f4f6; color: ${primaryColor}; padding: 8px 16px; border-radius: 0; font-size: 14px; font-weight: 500; font-family: 'Lora', serif; border: 1px solid #e5e7eb;">${skill.name || skill}</span>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateDashboardDarkResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#00d4ff';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#ff6b6b';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#0f172a';
        const textColor = document.getElementById('resume-text-color')?.value || '#ffffff';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'JetBrains Mono, monospace'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Dashboard Dark - Dark Data -->
                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 30px;">
                    <!-- Left Sidebar - Dark Stats -->
                    <div style="background: #1e293b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); height: fit-content;">
                        <!-- Profile Section -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            ${sections.photo && photoSettings ? `
                                <div style="width: 120px; height: 120px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '15px' : '0'}; margin: 0 auto 20px; overflow: hidden; border: 3px solid ${primaryColor}; box-shadow: 0 0 20px ${primaryColor};">
                                    ${photoSettings.photoUrl ? 
                                        `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 48px; color: ${bgColor}; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'D'}</span>
                                        </div>`
                                    }
                                </div>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: ${primaryColor};">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 8px 0 0 0; font-size: 16px; color: #94a3b8; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Dark Stats Dashboard -->
                        <div style="margin-bottom: 30px;">
                            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: ${primaryColor};">📊 Metrics</h3>
                            <div style="display: grid; gap: 15px;">
                                <div style="background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: ${bgColor}; padding: 15px; border-radius: 12px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: 700;">7+</div>
                                    <div style="font-size: 12px; opacity: 0.9;">Years</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #10b981, #34d399); color: ${bgColor}; padding: 15px; border-radius: 12px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: 700;">200+</div>
                                    <div style="font-size: 12px; opacity: 0.9;">Projects</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: ${bgColor}; padding: 15px; border-radius: 12px; text-align: center;">
                                    <div style="font-size: 24px; font-weight: 700;">98%</div>
                                    <div style="font-size: 12px; opacity: 0.9;">Success</div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">📞 Contact</h3>
                                <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                                    ${contact.location ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                                    ${contact.phone ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.email ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Chart -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">⚡ Skills</h3>
                                ${Object.entries(skills).map(([categoryName, skillList]) => `
                                    <div style="margin-bottom: 20px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                            <span style="font-size: 14px; font-weight: 500; color: #94a3b8;">${categoryName}</span>
                                            <span style="font-size: 12px; color: #64748b;">${skillList.length} skills</span>
                                        </div>
                                        <div style="width: 100%; height: 6px; background: #334155; border-radius: 3px; overflow: hidden;">
                                            <div style="width: ${Math.min(skillList.length * 20, 100)}%; height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); border-radius: 3px;"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        <!-- Professional Summary -->
                        ${sections.about && adjustedAbout.description ? `
                            <div style="background: #1e293b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    📋 Summary
                                </h2>
                                <div style="line-height: 1.7; font-size: 15px; color: ${textColor};">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Experience Table -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div style="background: #1e293b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    💼 Experience
                                </h2>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                        <thead>
                                            <tr style="background: ${primaryColor}; color: ${bgColor};">
                                                <th style="padding: 15px; text-align: left; border-radius: 8px 0 0 8px;">Position</th>
                                                <th style="padding: 15px; text-align: left;">Company</th>
                                                <th style="padding: 15px; text-align: left;">Duration</th>
                                                <th style="padding: 15px; text-align: left; border-radius: 0 8px 8px 0;">Achievements</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${adjustedExperience.map((exp, index) => `
                                                <tr style="border-bottom: 1px solid #334155; ${index % 2 === 0 ? 'background: #334155;' : ''}">
                                                    <td style="padding: 15px; font-weight: 600; color: ${primaryColor};">${exp.title}</td>
                                                    <td style="padding: 15px; color: #94a3b8;">${exp.company}</td>
                                                    <td style="padding: 15px; color: #94a3b8; font-size: 13px;">${exp.date || exp.period}</td>
                                                    <td style="padding: 15px; color: ${textColor}; line-height: 1.5;">${exp.description}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Grid -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div style="background: #1e293b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 700; color: ${primaryColor}; display: flex; align-items: center; gap: 10px;">
                                    🎯 Skills
                                </h2>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                    ${Object.entries(skills).map(([categoryName, skillList]) => `
                                        <div style="background: #334155; border-radius: 15px; padding: 20px; border-left: 4px solid ${primaryColor};">
                                            <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${primaryColor};">${categoryName}</h3>
                                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                ${skillList.map(skill => `
                                                    <span style="background: ${primaryColor}; color: ${bgColor}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${skill.name || skill}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateMinimalColorResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#6366f1';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#8b5cf6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1000px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 60px 40px;">
                <!-- The Minimal Color - Subtle Accents -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
                    <!-- Left Column -->
                    <div style="display: flex; flex-direction: column; gap: 40px;">
                        <!-- Header -->
                        <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid ${primaryColor};">
                            ${sections.photo && photoSettings ? `
                                <div style="width: 120px; height: 120px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '15px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 3px solid ${primaryColor};">
                                    ${photoSettings.photoUrl ? 
                                        `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 48px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'M'}</span>
                                        </div>`
                                    }
                                </div>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 36px; font-weight: 700; color: ${primaryColor};">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0 0 0; font-size: 18px; color: #6b7280; font-weight: 400;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- About Section -->
                        ${sections.about && adjustedAbout.description ? `
                            <div>
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; border-left: 4px solid ${primaryColor}; padding-left: 15px;">
                                    About
                                </h2>
                                <div style="line-height: 1.7; font-size: 16px; color: ${textColor};">${adjustedAbout.description}</div>
                            </div>
                        ` : ''}

                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div>
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; border-left: 4px solid ${primaryColor}; padding-left: 15px;">
                                    Contact
                                </h2>
                                <div style="font-size: 16px; line-height: 1.8; color: #6b7280;">
                                    ${contact.location ? `<div style="margin-bottom: 12px;">📍 ${contact.location}</div>` : ''}
                                    ${contact.phone ? `<div style="margin-bottom: 12px;">📞 ${contact.phone}</div>` : ''}
                                    ${contact.email ? `<div style="margin-bottom: 12px;">📧 ${contact.email}</div>` : ''}
                                    ${contact.linkedin ? `<div style="margin-bottom: 12px;">🔗 LinkedIn</div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Right Column -->
                    <div style="display: flex; flex-direction: column; gap: 40px;">
                        <!-- Experience Section -->
                        ${sections.experience && adjustedExperience.length > 0 ? `
                            <div>
                                <h2 style="margin: 0 0 30px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; border-left: 4px solid ${primaryColor}; padding-left: 15px;">
                                    Experience
                                </h2>
                                <div style="display: flex; flex-direction: column; gap: 30px;">
                                    ${adjustedExperience.map((exp, index) => `
                                        <div style="border-left: 3px solid ${secondaryColor}; padding-left: 25px; position: relative;">
                                            <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background: ${secondaryColor}; border-radius: 50%;"></div>
                                            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: ${primaryColor};">${exp.title}</h3>
                                            <p style="margin: 0 0 8px 0; font-size: 16px; color: ${secondaryColor}; font-weight: 500;">${exp.company}</p>
                                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #9ca3af;">${exp.date || exp.period}</p>
                                            <div style="line-height: 1.6; font-size: 15px; color: ${textColor};">${exp.description}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && Object.keys(skills).length > 0 ? `
                            <div>
                                <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 600; color: ${primaryColor}; border-left: 4px solid ${primaryColor}; padding-left: 15px;">
                                    Skills
                                </h2>
                                <div style="display: flex; flex-direction: column; gap: 20px;">
                                    ${Object.entries(skills).map(([categoryName, skillList]) => `
                                        <div>
                                            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">${categoryName}</h3>
                                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                                ${skillList.map(skill => `
                                                    <span style="background: #f3f4f6; color: ${primaryColor}; padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: 500; border: 1px solid #e5e7eb;">${skill.name || skill}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateGeometricResume(data, sections, length = 'single') {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#ef4444';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#dc2626';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';
        
        // Get photo settings
        const photoSettings = this.getResumePhoto();
        
        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, length);
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, system-ui, sans-serif'; max-width: 1200px; margin: 0 auto; background: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 40px 20px;">
                <!-- The Geometric - Angular Design -->
                <div style="background: white; border-radius: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Geometric Header -->
                    <div style="background: ${primaryColor}; color: white; padding: 60px 40px; position: relative; overflow: hidden;">
                        <!-- Geometric Shapes -->
                        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: ${secondaryColor}; transform: rotate(45deg);"></div>
                        <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); transform: rotate(45deg);"></div>
                        
                        <div style="position: relative; z-index: 2; text-align: center;">
                            ${sections.photo && photoSettings ? `
                                <div style="width: 150px; height: 150px; border-radius: ${photoSettings.photoStyle === 'circle' ? '50%' : photoSettings.photoStyle === 'rounded' ? '20px' : '0'}; margin: 0 auto 30px; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
                                    ${photoSettings.photoUrl ? 
                                        `<img src="${photoSettings.photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 60px; color: white; font-weight: bold;">${hero.name ? hero.name.charAt(0).toUpperCase() : 'G'}</span>
                                        </div>`
                                    }
                                </div>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 48px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.9; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>
                    </div>

                    <!-- Geometric Content -->
                    <div style="padding: 60px 40px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
                            <!-- Left Column -->
                            <div style="display: flex; flex-direction: column; gap: 40px;">
                                <!-- About Section -->
                                ${sections.about && adjustedAbout.description ? `
                                    <div style="border-left: 5px solid ${primaryColor}; padding-left: 25px;">
                                        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
                                            About
                                        </h2>
                                        <div style="line-height: 1.7; font-size: 16px; color: ${textColor};">${adjustedAbout.description}</div>
                                    </div>
                                ` : ''}

                                <!-- Contact Info -->
                                ${sections.contact ? `
                                    <div style="border-left: 5px solid ${secondaryColor}; padding-left: 25px;">
                                        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: ${secondaryColor}; text-transform: uppercase; letter-spacing: 1px;">
                                            Contact
                                        </h2>
                                        <div style="font-size: 16px; line-height: 1.8; color: #6b7280;">
                                            ${contact.location ? `<div style="margin-bottom: 12px;">📍 ${contact.location}</div>` : ''}
                                            ${contact.phone ? `<div style="margin-bottom: 12px;">📞 ${contact.phone}</div>` : ''}
                                            ${contact.email ? `<div style="margin-bottom: 12px;">📧 ${contact.email}</div>` : ''}
                                            ${contact.linkedin ? `<div style="margin-bottom: 12px;">🔗 LinkedIn</div>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Right Column -->
                            <div style="display: flex; flex-direction: column; gap: 40px;">
                                <!-- Experience Section -->
                                ${sections.experience && adjustedExperience.length > 0 ? `
                                    <div>
                                        <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
                                            Experience
                                        </h2>
                                        <div style="display: flex; flex-direction: column; gap: 30px;">
                                            ${adjustedExperience.map((exp, index) => `
                                                <div style="position: relative; padding-left: 30px;">
                                                    <div style="position: absolute; left: 0; top: 0; width: 15px; height: 15px; background: ${primaryColor}; transform: rotate(45deg);"></div>
                                                    <h3 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 600; color: ${primaryColor}; text-transform: uppercase;">${exp.title}</h3>
                                                    <p style="margin: 0 0 10px 0; font-size: 18px; color: ${secondaryColor}; font-weight: 500;">${exp.company}</p>
                                                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">${exp.date || exp.period}</p>
                                                    <div style="line-height: 1.6; font-size: 16px; color: ${textColor};">${exp.description}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Skills Section -->
                                ${sections.skills && Object.keys(skills).length > 0 ? `
                                    <div>
                                        <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
                                            Skills
                                        </h2>
                                        <div style="display: flex; flex-direction: column; gap: 25px;">
                                            ${Object.entries(skills).map(([categoryName, skillList]) => `
                                                <div>
                                                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: ${secondaryColor}; text-transform: uppercase; letter-spacing: 1px;">${categoryName}</h3>
                                                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                                        ${skillList.map(skill => `
                                                            <span style="background: ${primaryColor}; color: white; padding: 8px 16px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">${skill.name || skill}</span>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // Distinctive template functions
    generateCreativeResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || {};
        const contact = data.contact || {};
        
        // Get customization settings
        const primaryColor = document.getElementById('resume-primary-color')?.value || '#6366f1';
        const secondaryColor = document.getElementById('resume-secondary-color')?.value || '#8b5cf6';
        const bgColor = document.getElementById('resume-bg-color')?.value || '#ffffff';
        const textColor = document.getElementById('resume-text-color')?.value || '#1f2937';

        // Adjust data for length
        const adjustedData = this.adjustDataForLength(data, 'single');
        const adjustedExperience = adjustedData.experience || experience;
        const adjustedAbout = adjustedData.about || about;

        let html = `
            <div style="font-family: 'Inter, Arial', sans-serif; max-width: 900px; margin: 0 auto; background: ${bgColor}; color: ${textColor};">
                <!-- Creative Portfolio Layout -->
                <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: white; padding: 40px; border-radius: 0 0 30px 30px; margin-bottom: 40px;">
                    <div style="text-align: center;">
                        <h1 style="margin: 0; font-size: 48px; font-weight: 800; letter-spacing: -1px;">${hero.name || 'Your Name'}</h1>
                        <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.9; font-weight: 300;">${hero.subtitle || 'Professional Title'}</p>
                        ${sections.contact ? `
                            <div style="margin-top: 25px; display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 14px;">
                                ${contact.email ? `<div style="display: flex; align-items: center; gap: 8px;">📧 ${contact.email}</div>` : ''}
                                ${contact.phone ? `<div style="display: flex; align-items: center; gap: 8px;">📞 ${contact.phone}</div>` : ''}
                                ${contact.location ? `<div style="display: flex; align-items: center; gap: 8px;">📍 ${contact.location}</div>` : ''}
                                ${contact.linkedin ? `<div style="display: flex; align-items: center; gap: 8px;">🔗 ${contact.linkedin}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div style="padding: 0 40px 40px;">
                    <!-- Professional Summary -->
                    ${sections.about && adjustedAbout.description ? `
                <div style="margin-bottom: 40px;">
                            <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; position: relative;">
                                <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">About</span>
                                Professional Summary
                            </h2>
                            <p style="margin: 0; line-height: 1.8; font-size: 16px; color: #4b5563; background: #f8fafc; padding: 25px; border-radius: 15px; border-left: 5px solid ${primaryColor};">${adjustedAbout.description}</p>
                    </div>
                    ` : ''}

                    <!-- Work Experience -->
                    ${sections.experience && adjustedExperience.length > 0 ? `
                        <div style="margin-bottom: 40px;">
                            <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; position: relative;">
                                <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">Work</span>
                                Experience
                            </h2>
                            ${adjustedExperience.map((exp, index) => `
                                <div style="margin-bottom: 30px; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; position: relative; overflow: hidden;">
                                    <div style="position: absolute; top: 0; left: 0; width: 5px; height: 100%; background: linear-gradient(to bottom, ${primaryColor}, ${secondaryColor});"></div>
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: ${primaryColor};">${exp.title}</h3>
                                        <span style="color: ${secondaryColor}; font-size: 14px; font-weight: 600; background: #f3f4f6; padding: 6px 15px; border-radius: 20px;">${exp.date || exp.period}</span>
                </div>
                                    <div style="color: ${secondaryColor}; font-size: 18px; margin-bottom: 15px; font-weight: 600;">${exp.company}</div>
                                    <p style="margin: 0; line-height: 1.7; font-size: 15px; color: #6b7280;">${exp.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Skills Section with Percentage Bars -->
                    ${sections.skills && Object.keys(skills).length > 0 ? `
                <div style="margin-bottom: 40px;">
                            <h2 style="margin: 0 0 30px 0; font-size: 28px; font-weight: 700; color: ${primaryColor}; position: relative;">
                                <span style="background: ${primaryColor}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px; margin-right: 15px;">Skills</span>
                                & Expertise
                            </h2>
                            ${Object.entries(skills).map(([categoryName, skillList]) => `
                                <div style="margin-bottom: 30px; background: white; border-radius: 20px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                                    <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: ${primaryColor}; border-bottom: 2px solid ${secondaryColor}; padding-bottom: 10px;">${categoryName}</h3>
                                    ${skillList.map(skill => `
                    <div style="margin-bottom: 15px;">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                <span style="font-weight: 600; color: ${textColor}; font-size: 14px;">${skill.name || skill}</span>
                                                <span style="font-weight: 600; color: ${secondaryColor}; font-size: 14px;">${skill.percentage || 85}%</span>
                        </div>
                                            <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                                                <div style="width: ${skill.percentage || 85}%; height: 100%; background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}); border-radius: 4px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}


                </div>
            </div>
        `;

        return html;
    }

    generateTechResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Roboto Slab, Roboto, serif'; max-width: 900px; margin: 0 auto; background: white;">
                <!-- The Engineer - Two Column with Timeline -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 280px; background: #34495e; color: white; padding: 30px 25px;">
                        <!-- Profile Picture -->
                        <div style="width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 25px; overflow: hidden; border: 4px solid #e74c3c;">
                            ${hero.image ? 
                                `<img src="${hero.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                `<div style="width: 100%; height: 100%; background: #e74c3c; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; font-weight: bold;">
                                    ${hero.name ? hero.name.charAt(0).toUpperCase() : 'E'}
                                </div>`
                            }
                        </div>
                        
                        <!-- Contact Information -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 8px;">CONTACT</h3>
                                ${contact.location ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">📍</span> ${contact.location}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">📞</span> ${contact.phone}</div>` : ''}
                                ${contact.email ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">📧</span> ${contact.email}</div>` : ''}
                                ${contact.linkedin ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">🔗</span> LinkedIn</div>` : ''}
                                ${contact.github ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">💻</span> GitHub</div>` : ''}
                                ${contact.portfolio ? `<div style="margin-bottom: 12px; font-size: 14px; display: flex; align-items: center;"><span style="margin-right: 8px;">🌐</span> Portfolio</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && skills.length > 0 ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 8px;">SKILLS</h3>
                                ${skills.map(category => `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #ecf0f1; font-weight: 600;">${category.name}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                            ${category.skills.map(skill => `
                                                <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px;">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Certifications Section -->
                        <div style="margin-bottom: 30px;">
                            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 8px;">CERTIFICATIONS</h3>
                            <div style="font-size: 14px; line-height: 1.6;">
                                <div style="margin-bottom: 8px;">🏆 AWS Certified Developer</div>
                                <div style="margin-bottom: 8px;">📜 PMP Certification</div>
                                <div style="margin-bottom: 8px;">🔒 CISSP Security</div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 40px 30px;">
                        <!-- Header -->
                        <div style="margin-bottom: 30px;">
                            <h1 style="margin: 0; color: #2c3e50; font-size: 36px; font-weight: 700; font-family: 'Roboto Slab', serif;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0; color: #e74c3c; font-size: 20px; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- Professional Summary -->
                        ${sections.about && about.description ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">PROFESSIONAL SUMMARY</h2>
                                <p style="margin: 0; line-height: 1.6; color: #555; font-size: 14px; font-family: 'Roboto', sans-serif;">${about.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience with Timeline -->
                        ${sections.experience && experience.length > 0 ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">PROFESSIONAL EXPERIENCE</h2>
                                ${experience.map((exp, index) => `
                                    <div style="margin-bottom: 25px; position: relative;">
                                        <!-- Timeline Dot -->
                                        <div style="position: absolute; left: -15px; top: 8px; width: 12px; height: 12px; background: #e74c3c; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #e74c3c;"></div>
                                        <!-- Timeline Line -->
                                        ${index < experience.length - 1 ? `<div style="position: absolute; left: -9px; top: 20px; width: 2px; height: 40px; background: #e74c3c;"></div>` : ''}
                                        
                                        <div style="margin-left: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                                <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Roboto Slab', serif;">${exp.title}</h3>
                                                <span style="color: #e74c3c; font-size: 14px; font-weight: 500;">${exp.period}</span>
                                            </div>
                                            <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500; font-family: 'Roboto', sans-serif;">${exp.company}</div>
                                            <p style="margin: 0; line-height: 1.6; color: #555; font-size: 13px; font-family: 'Roboto', sans-serif;">${exp.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Education Section -->
                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">EDUCATION</h2>
                            <div style="margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Roboto Slab', serif;">Bachelor's Degree in Computer Science</h3>
                                    <span style="color: #e74c3c; font-size: 14px; font-weight: 500;">2020 - 2024</span>
                                </div>
                                <div style="color: #666; font-size: 14px; margin-bottom: 8px; font-weight: 500; font-family: 'Roboto', sans-serif;">University Name</div>
                                <p style="margin: 0; line-height: 1.5; color: #555; font-size: 13px; font-family: 'Roboto', sans-serif;">Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems</p>
                            </div>
                        </div>

                        <!-- Projects Section -->
                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; font-family: 'Roboto Slab', serif;">PROJECTS</h2>
                            <div style="margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Roboto Slab', serif;">E-Commerce Platform</h3>
                                <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; font-family: 'Roboto', sans-serif;">React, Node.js, MongoDB, AWS</p>
                                <p style="margin: 0; line-height: 1.5; color: #555; font-size: 13px; font-family: 'Roboto', sans-serif;">Developed a full-stack e-commerce platform with payment integration and admin dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateExecutiveResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Oswald, Lato, sans-serif'; max-width: 900px; margin: 0 auto; background: white;">
                <!-- The Innovator - Asymmetrical Design -->
                <div style="position: relative; min-height: 100vh;">
                    <!-- Vertical Accent Line -->
                    <div style="position: absolute; left: 50px; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, #9b59b6, #3498db);"></div>
                    
                    <!-- Header Section -->
                    <div style="padding: 40px 60px 30px 80px; background: linear-gradient(135deg, #9b59b6 0%, #3498db 100%); color: white;">
                        <div style="display: flex; align-items: center; gap: 30px;">
                            <!-- Profile Picture -->
                            <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid rgba(255,255,255,0.3); flex-shrink: 0;">
                                ${hero.image ? 
                                    `<img src="${hero.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                    `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 36px; color: white; font-weight: bold;">
                                        ${hero.name ? hero.name.charAt(0).toUpperCase() : 'I'}
                                    </div>`
                                }
                            </div>
                            
                            <div style="flex: 1;">
                                <h1 style="margin: 0; font-size: 42px; font-weight: 700; font-family: 'Oswald', sans-serif;">${hero.name || 'Your Name'}</h1>
                                <p style="margin: 10px 0; font-size: 20px; opacity: 0.9; font-family: 'Lato', sans-serif;">${hero.subtitle || 'Professional Title'}</p>
                                ${sections.contact ? `
                                    <div style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                                        ${contact.location ? `<div style="margin-bottom: 5px;">📍 ${contact.location}</div>` : ''}
                                        ${contact.phone ? `<div style="margin-bottom: 5px;">📞 ${contact.phone}</div>` : ''}
                                        ${contact.email ? `<div style="margin-bottom: 5px;">📧 ${contact.email}</div>` : ''}
                                        ${contact.linkedin ? `<div style="margin-bottom: 5px;">🔗 LinkedIn</div>` : ''}
                                        ${contact.github ? `<div style="margin-bottom: 5px;">💻 GitHub</div>` : ''}
                                        ${contact.portfolio ? `<div style="margin-bottom: 5px;">🌐 Portfolio</div>` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 60px 40px 80px;">
                        <!-- Professional Summary -->
                        ${sections.about && about.description ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                    <span style="background: white; padding-right: 15px;">PROFESSIONAL SUMMARY</span>
                                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                                </h2>
                                <p style="margin: 0; line-height: 1.7; color: #555; font-size: 15px; font-family: 'Lato', sans-serif;">${about.description}</p>
                            </div>
                        ` : ''}

                        <!-- Work Experience -->
                        ${sections.experience && experience.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                    <span style="background: white; padding-right: 15px;">PROFESSIONAL EXPERIENCE</span>
                                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                                </h2>
                                ${experience.map(exp => `
                                    <div style="margin-bottom: 30px; padding: 25px; background: #f8f9fa; border-radius: 12px; border-left: 5px solid #9b59b6; position: relative;">
                                        <div style="position: absolute; top: -10px; left: 20px; background: #9b59b6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: bold; font-family: 'Oswald', sans-serif;">${exp.period}</div>
                                        <div style="margin-top: 15px;">
                                            <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 18px; font-weight: 600; font-family: 'Oswald', sans-serif;">${exp.title}</h3>
                                            <div style="color: #9b59b6; font-size: 16px; margin-bottom: 12px; font-weight: 500; font-family: 'Lato', sans-serif;">${exp.company}</div>
                                            <p style="margin: 0; line-height: 1.6; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">${exp.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Skills Section -->
                        ${sections.skills && skills.length > 0 ? `
                            <div style="margin-bottom: 40px;">
                                <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                    <span style="background: white; padding-right: 15px;">SKILLS & EXPERTISE</span>
                                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                                </h2>
                                ${skills.map(category => `
                                    <div style="margin-bottom: 25px;">
                                        <h3 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Oswald', sans-serif;">${category.name}</h3>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            ${category.skills.map(skill => `
                                                <span style="background: linear-gradient(135deg, #9b59b6, #3498db); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; font-family: 'Lato', sans-serif;">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Education Section -->
                        <div style="margin-bottom: 40px;">
                            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                <span style="background: white; padding-right: 15px;">EDUCATION</span>
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                            </h2>
                            <div style="padding: 25px; background: #f8f9fa; border-radius: 12px; border-left: 5px solid #9b59b6; position: relative;">
                                <div style="position: absolute; top: -10px; left: 20px; background: #9b59b6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: bold; font-family: 'Oswald', sans-serif;">2020 - 2024</div>
                                <div style="margin-top: 15px;">
                                    <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 18px; font-weight: 600; font-family: 'Oswald', sans-serif;">Bachelor's Degree in Computer Science</h3>
                                    <div style="color: #9b59b6; font-size: 16px; margin-bottom: 12px; font-weight: 500; font-family: 'Lato', sans-serif;">University Name</div>
                                    <p style="margin: 0; line-height: 1.6; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems</p>
                                </div>
                            </div>
                        </div>

                        <!-- Projects Section -->
                        <div style="margin-bottom: 40px;">
                            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                <span style="background: white; padding-right: 15px;">PROJECTS</span>
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                            </h2>
                            <div style="padding: 25px; background: #f8f9fa; border-radius: 12px; border-left: 5px solid #9b59b6;">
                                <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 18px; font-weight: 600; font-family: 'Oswald', sans-serif;">E-Commerce Platform</h3>
                                <p style="margin: 0 0 8px 0; color: #9b59b6; font-size: 14px; font-family: 'Lato', sans-serif;">React, Node.js, MongoDB, AWS</p>
                                <p style="margin: 0; line-height: 1.6; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">Developed a full-stack e-commerce platform with payment integration and admin dashboard.</p>
                            </div>
                        </div>

                        <!-- Certifications Section -->
                        <div style="margin-bottom: 40px;">
                            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                <span style="background: white; padding-right: 15px;">CERTIFICATIONS & AWARDS</span>
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                            </h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 8px;">🏆</div>
                                    <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 14px; font-weight: 600; font-family: 'Oswald', sans-serif;">AWS Certified Developer</h3>
                                    <p style="margin: 0; color: #9b59b6; font-size: 12px; font-family: 'Lato', sans-serif;">Amazon Web Services</p>
                                </div>
                                <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 8px;">📜</div>
                                    <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 14px; font-weight: 600; font-family: 'Oswald', sans-serif;">PMP Certification</h3>
                                    <p style="margin: 0; color: #9b59b6; font-size: 12px; font-family: 'Lato', sans-serif;">Project Management Institute</p>
                                </div>
                            </div>
                        </div>

                        <!-- Languages Section -->
                        <div>
                            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-family: 'Oswald', sans-serif; font-weight: 600; position: relative;">
                                <span style="background: white; padding-right: 15px;">LANGUAGES</span>
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #9b59b6; z-index: -1;"></div>
                            </h2>
                            <div style="display: flex; gap: 20px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🇺🇸</div>
                                    <p style="margin: 0; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">English (Native)</p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🇪🇸</div>
                                    <p style="margin: 0; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">Spanish (Fluent)</p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🇫🇷</div>
                                    <p style="margin: 0; color: #555; font-size: 14px; font-family: 'Lato', sans-serif;">French (Intermediate)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateDesignerResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; background: white;">
                <!-- Designer Layout with Color Blocks -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Color Block -->
                    <div style="width: 200px; background: linear-gradient(45deg, #ff6b6b, #feca57); padding: 30px 20px; color: white;">
                        <!-- Profile Picture -->
                        <div style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                            ${hero.image ? 
                                `<img src="${hero.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 36px; color: white; font-weight: bold;">
                                    ${hero.name ? hero.name.charAt(0).toUpperCase() : 'D'}
                                </div>`
                            }
                        </div>
                        
                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">CONTACT</h3>
                                ${contact.email ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📧 ${contact.email}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📞 ${contact.phone}</div>` : ''}
                                ${contact.location ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📍 ${contact.location}</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills -->
                        ${sections.skills && skills.length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">SKILLS</h3>
                                ${skills.map(category => `
                                    <div style="margin-bottom: 15px;">
                                        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-align: center;">${category.name}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
                                            ${category.skills.map(skill => `
                                                <span style="background: rgba(255,255,255,0.2); padding: 3px 6px; border-radius: 10px; font-size: 11px;">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 30px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0; color: #2c3e50; font-size: 36px; font-weight: 700;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0; color: #ff6b6b; font-size: 20px; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- About Section -->
                        ${sections.about && about.description ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">ABOUT</h2>
                                <p style="margin: 0; line-height: 1.6; color: #555;">${about.description}</p>
                            </div>
                        ` : ''}

                        <!-- Experience Section -->
                        ${sections.experience && experience.length > 0 ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">EXPERIENCE</h2>
                                ${experience.map(exp => `
                                    <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 15px; border-left: 4px solid #ff6b6b;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${exp.title}</h3>
                                            <span style="color: #ff6b6b; font-size: 14px; font-weight: 500;">${exp.period}</span>
                                        </div>
                                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; color: #555;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateCorporateResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; background: white; padding: 20px;">
                <!-- Corporate Header -->
                <div style="text-align: center; background: #f8f9fa; padding: 30px; margin-bottom: 30px; border: 1px solid #dee2e6;">
                    <h1 style="margin: 0; color: #212529; font-size: 32px; font-weight: 600;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 10px 0; color: #6c757d; font-size: 18px;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 20px; font-size: 14px; color: #495057;">
                            ${contact.email ? `<div style="margin-bottom: 5px;">📧 ${contact.email}</div>` : ''}
                            ${contact.phone ? `<div style="margin-bottom: 5px;">📞 ${contact.phone}</div>` : ''}
                            ${contact.location ? `<div style="margin-bottom: 5px;">📍 ${contact.location}</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- About Section -->
                ${sections.about && about.description ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #212529; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h2>
                        <p style="margin: 0; line-height: 1.6; color: #495057;">${about.description}</p>
                    </div>
                ` : ''}

                <!-- Experience Section -->
                ${sections.experience && experience.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #212529; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">PROFESSIONAL EXPERIENCE</h2>
                        ${experience.map(exp => `
                            <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <h3 style="margin: 0; color: #212529; font-size: 16px; font-weight: 600;">${exp.title}</h3>
                                    <span style="color: #007bff; font-size: 14px; font-weight: 500;">${exp.period}</span>
                                </div>
                                <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${exp.company}</div>
                                <p style="margin: 0; line-height: 1.6; color: #495057;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Skills Section -->
                ${sections.skills && skills.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #212529; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">SKILLS & EXPERTISE</h2>
                        ${skills.map(category => `
                            <div style="margin-bottom: 20px;">
                                <h3 style="margin: 0 0 10px 0; color: #212529; font-size: 16px; font-weight: 600;">${category.name}</h3>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    ${category.skills.map(skill => `
                                        <span style="background: #007bff; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">${skill}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    generateStartupResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; background: white;">
                <!-- Startup Layout -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px;">
                        <!-- Profile Picture -->
                        <div style="width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                            ${hero.image ? 
                                `<img src="${hero.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
                                `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 40px; color: white; font-weight: bold;">
                                    ${hero.name ? hero.name.charAt(0).toUpperCase() : 'S'}
                                </div>`
                            }
                        </div>
                        
                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">CONTACT</h3>
                                ${contact.email ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📧 ${contact.email}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📞 ${contact.phone}</div>` : ''}
                                ${contact.location ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📍 ${contact.location}</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills -->
                        ${sections.skills && skills.length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">SKILLS</h3>
                                ${skills.map(category => `
                                    <div style="margin-bottom: 15px;">
                                        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-align: center;">${category.name}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
                                            ${category.skills.map(skill => `
                                                <span style="background: rgba(255,255,255,0.2); padding: 3px 6px; border-radius: 10px; font-size: 11px;">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 30px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0; color: #333; font-size: 32px; font-weight: 700;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0; color: #667eea; font-size: 18px; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- About Section -->
                        ${sections.about && about.description ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">ABOUT</h2>
                                <p style="margin: 0; line-height: 1.6; color: #555;">${about.description}</p>
                            </div>
                        ` : ''}

                        <!-- Experience Section -->
                        ${sections.experience && experience.length > 0 ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">EXPERIENCE</h2>
                                ${experience.map(exp => `
                                    <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #667eea;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${exp.title}</h3>
                                            <span style="color: #667eea; font-size: 14px; font-weight: 500;">${exp.period}</span>
                                        </div>
                                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; color: #555;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    generateAcademicResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; background: white; padding: 20px;">
                <!-- Academic Header -->
                <div style="text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="margin: 0; color: #2c3e50; font-size: 28px; font-weight: bold;">${hero.name || 'Your Name'}</h1>
                    <p style="margin: 10px 0; color: #7f8c8d; font-size: 16px;">${hero.subtitle || 'Professional Title'}</p>
                    ${sections.contact ? `
                        <div style="margin-top: 15px; font-size: 14px; color: #34495e;">
                            ${contact.email ? `<div>📧 ${contact.email}</div>` : ''}
                            ${contact.phone ? `<div>📞 ${contact.phone}</div>` : ''}
                            ${contact.location ? `<div>📍 ${contact.location}</div>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- About Section -->
                ${sections.about && about.description ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">RESEARCH INTERESTS</h2>
                        <p style="margin: 0; line-height: 1.6; color: #2c3e50;">${about.description}</p>
                    </div>
                ` : ''}

                <!-- Experience Section -->
                ${sections.experience && experience.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">ACADEMIC & PROFESSIONAL EXPERIENCE</h2>
                        ${experience.map(exp => `
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                    <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: bold;">${exp.title}</h3>
                                    <span style="color: #7f8c8d; font-size: 14px;">${exp.period}</span>
                                </div>
                                <div style="color: #7f8c8d; font-size: 14px; margin-bottom: 8px; font-style: italic;">${exp.company}</div>
                                <p style="margin: 0; line-height: 1.5; color: #2c3e50;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Skills Section -->
                ${sections.skills && skills.length > 0 ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">TECHNICAL SKILLS & EXPERTISE</h2>
                        ${skills.map(category => `
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 14px; font-weight: bold;">${category.name}</h3>
                                <p style="margin: 0; color: #2c3e50; font-size: 13px;">${category.skills.join(', ')}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return html;
    }

    generateFreelanceResume(data, sections) {
        const hero = data.hero || {};
        const about = data.about || {};
        const experience = data.experience || [];
        const skills = data.skills || [];
        const contact = data.contact || {};

        let html = `
            <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; background: white;">
                <!-- Freelance Layout -->
                <div style="display: flex; min-height: 100vh;">
                    <!-- Left Sidebar -->
                    <div style="width: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px;">
                        <!-- Profile Picture -->
                        <div style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold;">
                            ${hero.name ? hero.name.charAt(0).toUpperCase() : 'F'}
                        </div>
                        
                        <!-- Contact Info -->
                        ${sections.contact ? `
                            <div style="margin-bottom: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">CONTACT</h3>
                                ${contact.email ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📧 ${contact.email}</div>` : ''}
                                ${contact.phone ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📞 ${contact.phone}</div>` : ''}
                                ${contact.location ? `<div style="margin-bottom: 8px; font-size: 13px; text-align: center;">📍 ${contact.location}</div>` : ''}
                            </div>
                        ` : ''}

                        <!-- Skills -->
                        ${sections.skills && skills.length > 0 ? `
                            <div>
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; text-align: center;">SKILLS</h3>
                                ${skills.map(category => `
                                    <div style="margin-bottom: 15px;">
                                        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-align: center;">${category.name}</h4>
                                        <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
                                            ${category.skills.map(skill => `
                                                <span style="background: rgba(255,255,255,0.2); padding: 3px 6px; border-radius: 10px; font-size: 11px;">${skill}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Main Content -->
                    <div style="flex: 1; padding: 30px;">
                        <!-- Header -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="margin: 0; color: #333; font-size: 32px; font-weight: 700;">${hero.name || 'Your Name'}</h1>
                            <p style="margin: 10px 0; color: #667eea; font-size: 18px; font-weight: 500;">${hero.subtitle || 'Professional Title'}</p>
                        </div>

                        <!-- About Section -->
                        ${sections.about && about.description ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">ABOUT</h2>
                                <p style="margin: 0; line-height: 1.6; color: #555;">${about.description}</p>
                            </div>
                        ` : ''}

                        <!-- Experience Section -->
                        ${sections.experience && experience.length > 0 ? `
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">EXPERIENCE</h2>
                                ${experience.map(exp => `
                                    <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #667eea;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${exp.title}</h3>
                                            <span style="color: #667eea; font-size: 14px; font-weight: 500;">${exp.period}</span>
                                        </div>
                                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">${exp.company}</div>
                                        <p style="margin: 0; line-height: 1.6; color: #555;">${exp.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    async generateResume() {
        try {
            const template = document.getElementById('resume-template')?.value || 'classic';
            const sections = this.getResumeSections();
            const resumeLength = document.getElementById('resume-length')?.value || 'single';
            const pageSize = document.getElementById('resume-page-size')?.value || 'A4';
            const orientation = document.getElementById('resume-orientation')?.value || 'portrait';
            const fontSize = document.getElementById('resume-font-size')?.value || 'medium';

            // Generate resume HTML with length consideration
            const resumeHtml = this.generateResumeHtml(template, sections, resumeLength);
            
            // Create a temporary container for the resume
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = resumeHtml;
            document.body.appendChild(tempContainer);

            // Use html2pdf.js to generate PDF
            const opt = {
                margin: 10,
                filename: `${this.websiteData?.hero?.name || 'resume'}_${template}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { 
                    unit: 'mm', 
                    format: pageSize.toLowerCase(), 
                    orientation: orientation 
                }
            };

            // Load html2pdf library if not already loaded
            if (typeof html2pdf === 'undefined') {
                await this.loadHtml2PdfLibrary();
            }

            // Generate PDF
            await html2pdf().set(opt).from(tempContainer).save();

            // Clean up
            document.body.removeChild(tempContainer);

            this.showMessage('Resume generated and downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating resume:', error);
            this.showMessage('Error generating resume. Please try again.', 'error');
        }
    }

    async loadHtml2PdfLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof html2pdf !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

// Initialize Admin Panel
console.log('About to create AdminPanel instance...');
try {
    // Prevent multiple instances
    if (window.adminPanel) {
        console.log('AdminPanel already exists, skipping creation');
    } else {
        const adminPanel = new AdminPanel();
        window.adminPanel = adminPanel; // Make it globally accessible
        console.log('AdminPanel instance created:', adminPanel);
    }
} catch (error) {
    console.error('Failed to create AdminPanel instance:', error);
    window.adminPanel = null;
}

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