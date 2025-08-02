// Website Content Loader for Supabase Integration
class WebsiteLoader {
    constructor() {
        this.supabase = null;
        this.content = {};
        this.init();
    }

    async init() {
        try {
            // Try to initialize immediately, then retry if needed
            let retries = 0;
            while (retries < 3) {
                if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                retries++;
            }
            
            // Initialize Supabase client
            if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
                console.error('Supabase library not loaded, using default content');
                this.content = this.getDefaultContent();
                this.updateWebsite();
                return;
            }
            
            this.supabase = window.supabase.createClient(
                'https://wwpjacyzmteiexchtnfj.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGphY3l6bXRlaWV4Y2h0bmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njk2MDIsImV4cCI6MjA2NDU0NTYwMn0.cq4SuNwcmk2a7vfV9XnaXZkbv-r-LQXuWy06u75C97Q'
            );

            // Load content and update website
            await this.loadContent();
            this.updateWebsite();
        } catch (error) {
            console.error('Error initializing website loader:', error);
            this.content = this.getDefaultContent();
            this.updateWebsite();
        }
    }

    async loadContent() {
        try {
            console.log('Loading content from Supabase...');
            const { data, error } = await this.supabase
                .from('website_content')
                .select('*');
            
            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }
            
            console.log('Raw data from Supabase:', data);
            
            // Convert array to object with section_name as key
            this.content = {};
            data.forEach(item => {
                this.content[item.section_name] = item.content;
            });
            
            console.log('Content loaded from Supabase:', this.content);
            
            // Log what sections we have
            console.log('Available sections:', Object.keys(this.content));
            
            // Check if we have the expected sections
            const expectedSections = ['hero', 'about', 'experience', 'skills', 'testimonials', 'contact', 'settings', 'linkedin', 'navigation', 'footer'];
            expectedSections.forEach(section => {
                if (this.content[section]) {
                    console.log(`${section} section found:`, this.content[section]);
                    
                    // Special debug for footer section
                    if (section === 'footer') {
                        console.log('Footer section details:', this.content.footer);
                        if (this.content.footer.linkedin || this.content.footer.facebook || this.content.footer.twitter || this.content.footer.instagram) {
                            console.log('Social media found in footer:', {
                                linkedin: this.content.footer.linkedin,
                                facebook: this.content.footer.facebook,
                                twitter: this.content.footer.twitter,
                                instagram: this.content.footer.instagram
                            });
                        } else {
                            console.log('No social media found in footer');
                        }
                    }
                } else {
                    console.log(`${section} section NOT found`);
                }
            });
        } catch (error) {
            console.error('Error loading content from Supabase:', error);
            // Fallback to default content
            this.content = this.getDefaultContent();
        }
    }

    async refreshContent() {
        console.log('Refreshing content from Supabase...');
        await this.loadContent();
        this.updateWebsite();
        console.log('Content refreshed and website updated');
    }

    getDefaultContent() {
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
            },
            testimonials: [
                {
                    name: 'Ananya S.',
                    title: 'Master\'s Student',
                    quote: 'Soumita transformed my dream of studying in Australia into reality. Her meticulous approach was exceptional.',
                    rating: 5
                },
                {
                    name: 'Priya S.',
                    title: 'Senior Colleague',
                    quote: 'Her commitment to excellence and process optimization has elevated our entire team\'s performance.',
                    rating: 5
                }
            ],
            contact: {
                email: 'hello@soumita.space',
                linkedin: 'https://www.linkedin.com/in/soumita-chatterjee',
                location: 'Kolkata, India'
            },
            linkedin: [
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
            ],
            settings: {
                title: 'Soumita Chatterjee – Australia Immigration Specialist',
                primaryColor: '#6a5acd',
                secondaryColor: '#8e6ee6',
                accentColor: '#ffa726'
            }
        };
    }

    updateWebsite() {
        console.log('Updating website with content:', this.content);
        console.log('LinkedIn content in updateWebsite:', this.content.linkedin);
        
        // Update hero section
        this.updateHeroSection();
        
        // Update about section
        this.updateAboutSection();
        
        // Update experience section
        this.updateExperienceSection();
        
        // Update skills section
        this.updateSkillsSection();
        
        // Update testimonials section
        this.updateTestimonialsSection();
        
        // Update contact section
        this.updateContactSection();
        
        // Update LinkedIn section
        console.log('About to update LinkedIn section...');
        this.updateLinkedInSection();
        
        // Update navigation
        this.updateNavigation();
        
        // Update contact form
        this.updateContactForm();
        
        // Update settings
        this.updateSettings();
        
        // Update footer if footer data exists
        if (this.content.footer) {
            this.updateFooter();
        }
        
        console.log('Website update complete');
    }

    updateHeroSection() {
        if (!this.content.hero) return;
        
        const hero = this.content.hero;
        
        // Update hero content
        const greetingEl = document.querySelector('.hero-greeting');
        const nameEl = document.querySelector('.hero-name');
        const subtitleEl = document.querySelector('.hero-subtitle');
        const descriptionEl = document.querySelector('.hero-description');
        const imageEl = document.querySelector('.hero-image');
        
        if (greetingEl) greetingEl.textContent = hero.greeting || '';
        if (nameEl) {
            nameEl.textContent = hero.name || '';
            // Add gradient-text class for styling
            nameEl.className = 'hero-name gradient-text';
        }
        if (subtitleEl) {
            // Check if we should use typewriter or static subtitle
            if (!hero.subtitle || hero.subtitle.trim() === '') {
                // Use typewriter effect
                console.log('Using typewriter effect');
                // Clear the subtitle element first
                subtitleEl.innerHTML = '<span id="typewriter-subtitle" class="typewriter-text"></span>';
                
                if (hero.typewriterTitles && hero.typewriterTitles.length > 0) {
                    this.updateTypewriterTitles(hero.typewriterTitles);
                } else {
                    // Use default titles if none provided
                    const defaultTitles = ["Australia Immigration Specialist", "Team Leader", "Certified Industrial Accountant", "Senior Admissions Officer"];
                    this.updateTypewriterTitles(defaultTitles);
                }
            } else {
                // Use static subtitle
                console.log('Using static subtitle:', hero.subtitle);
                subtitleEl.textContent = hero.subtitle;
            }
        }
        if (descriptionEl) descriptionEl.textContent = hero.description || '';
        if (imageEl && hero.image) imageEl.src = hero.image;
    }

    updateAboutSection() {
        if (!this.content.about) return;
        
        const about = this.content.about;
        
        const titleEl = document.querySelector('.about-title');
        const descriptionEl = document.querySelector('.about-description');
        const textEl = document.querySelector('.about-text');
        
        if (titleEl) titleEl.textContent = about.title || '';
        if (descriptionEl) descriptionEl.textContent = about.description || '';
        if (textEl) {
            // Split text into paragraphs and update the about-text div
            const paragraphs = about.text.split('\n\n');
            textEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
        
        // Update highlights if they exist
        if (about.highlights && about.highlights.length > 0) {
            const highlightsContainer = document.querySelector('.about-highlights');
            if (highlightsContainer) {
                highlightsContainer.innerHTML = '';
                about.highlights.forEach((highlight, index) => {
                    const highlightItem = document.createElement('div');
                    highlightItem.className = 'about-highlight-item';
                    
                    // Choose icon based on index or content
                    const icons = ['globe', 'briefcase', 'check-circle', 'award', 'star'];
                    const icon = icons[index % icons.length];
                    
                    highlightItem.innerHTML = `
                        <i data-feather="${icon}"></i>
                        <span>${highlight}</span>
                    `;
                    highlightsContainer.appendChild(highlightItem);
                });
                
                // Reinitialize Feather icons
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }
        
        // Update statistics if they exist
        if (about.statistics && about.statistics.length > 0) {
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid) {
                console.log('Updating statistics with:', about.statistics);
                statsGrid.innerHTML = '';
                about.statistics.forEach((stat, index) => {
                    const statCard = document.createElement('div');
                    statCard.className = 'stat-card card gradient-border';
                    statCard.setAttribute('data-animation', 'fade-in-up');
                    statCard.innerHTML = `
                        <div class="stat-number" data-count-to="${stat.number}">0</div>
                        <div class="stat-label">${stat.label}</div>
                    `;
                    statsGrid.appendChild(statCard);
                });
                
                // Trigger count-up animations
                setTimeout(() => {
                    this.triggerStatisticsAnimations();
                }, 100);
            }
        } else {
            // If no statistics data, ensure default statistics are shown
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid && statsGrid.children.length === 0) {
                console.log('No statistics data found, showing defaults');
                // Restore default statistics if none exist
                const defaultStats = [
                    { number: '7', label: 'Years Total Experience' },
                    { number: '200', label: 'Students Guided' },
                    { number: '50', label: 'Partner Institutions' },
                    { number: '98', label: 'Success Rate %' }
                ];
                
                defaultStats.forEach((stat, index) => {
                    const statCard = document.createElement('div');
                    statCard.className = 'stat-card card gradient-border';
                    statCard.setAttribute('data-animation', 'fade-in-up');
                    statCard.innerHTML = `
                        <div class="stat-number" data-count-to="${stat.number}">0</div>
                        <div class="stat-label">${stat.label}</div>
                    `;
                    statsGrid.appendChild(statCard);
                });
                
                // Trigger count-up animations
                setTimeout(() => {
                    this.triggerStatisticsAnimations();
                }, 100);
            }
        }
        
        // Always ensure statistics are visible
        setTimeout(() => {
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid && statsGrid.children.length === 0) {
                console.log('Statistics grid is empty, forcing default statistics');
                const defaultStats = [
                    { number: '7', label: 'Years Total Experience' },
                    { number: '200', label: 'Students Guided' },
                    { number: '50', label: 'Partner Institutions' },
                    { number: '98', label: 'Success Rate %' }
                ];
                
                defaultStats.forEach((stat, index) => {
                    const statCard = document.createElement('div');
                    statCard.className = 'stat-card card gradient-border';
                    statCard.setAttribute('data-animation', 'fade-in-up');
                    statCard.innerHTML = `
                        <div class="stat-number" data-count-to="${stat.number}">0</div>
                        <div class="stat-label">${stat.label}</div>
                    `;
                    statsGrid.appendChild(statCard);
                });
                
                this.triggerStatisticsAnimations();
            }
        }, 500);
    }

    updateExperienceSection() {
        if (!this.content.experience) return;
        
        console.log('Updating experience section with:', this.content.experience);
        
        // Try different selectors
        let experienceContainer = document.querySelector('.experience-list');
        if (!experienceContainer) {
            experienceContainer = document.querySelector('.timeline');
            console.log('Trying .timeline selector');
        }
        if (!experienceContainer) {
            experienceContainer = document.querySelector('#experience .timeline');
            console.log('Trying #experience .timeline selector');
        }
        if (!experienceContainer) {
            console.log('Experience container not found with any selector');
            return;
        }
        
        console.log('Found experience container:', experienceContainer);
        
        // Instead of clearing, let's update existing items or create new ones
        const existingItems = experienceContainer.querySelectorAll('.timeline-item');
        console.log('Found existing items:', existingItems.length);
        
        this.content.experience.forEach((exp, index) => {
            console.log('Processing experience item:', exp);
            
            let expEl;
            if (existingItems[index]) {
                // Update existing item
                expEl = existingItems[index];
                console.log('Updating existing item');
            } else {
                // Create new item
                expEl = document.createElement('div');
                expEl.className = 'timeline-item';
                expEl.setAttribute('data-animation', index % 2 === 0 ? 'fade-in-right' : 'fade-in-left');
                experienceContainer.appendChild(expEl);
                console.log('Created new item');
            }
            
            // Split description into bullet points
            const bulletPoints = exp.description.split('. ').filter(point => point.trim() !== '');
            
            expEl.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card card gradient-border">
                    <h3 class="timeline-title">${exp.title}</h3>
                    <div class="timeline-date">${exp.date}</div>
                    <div class="timeline-company">${exp.company}</div>
                    <ul class="timeline-list">
                        ${bulletPoints.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            console.log('Updated/created experience item');
        });
        
        // Remove extra items if we have more existing items than new data
        while (existingItems.length > this.content.experience.length) {
            experienceContainer.removeChild(existingItems[existingItems.length - 1]);
            console.log('Removed extra item');
        }
        
        console.log('Experience section updated');
        
        // Test if content is visible after a small delay
        setTimeout(() => {
            const testItem = experienceContainer.querySelector('.timeline-item');
            if (testItem) {
                console.log('Test item found:', testItem);
                console.log('Test item visible:', testItem.offsetHeight > 0);
                console.log('Test item position:', testItem.style.left);
                console.log('Test item computed style:', window.getComputedStyle(testItem).left);
            } else {
                console.log('No timeline items found in container');
            }
        }, 100);
    }

    updateSkillsSection() {
        console.log('Updating skills section...');
        console.log('Skills content:', this.content.skills);
        
        if (!this.content.skills) {
            console.log('No skills content found');
            return;
        }
        
        const skillsContainer = document.querySelector('.skills-list');
        console.log('Skills container found:', skillsContainer);
        
        if (!skillsContainer) {
            console.log('Skills container not found');
            return;
        }
        
        // Clear existing content
        skillsContainer.innerHTML = '';
        console.log('Cleared skills container');
        
        Object.entries(this.content.skills).forEach(([category, skills]) => {
            console.log(`Processing category: ${category} with ${skills.length} skills`);
            
                            const categoryEl = document.createElement('div');
                categoryEl.className = 'skills-category-card card gradient-border';
                categoryEl.setAttribute('data-animation', 'fade-in-up');
                categoryEl.innerHTML = `<h3 class="skills-category-title">${category}</h3>`;
            
            // If skills array is empty, add default skills for this category
            if (!skills || skills.length === 0) {
                console.log(`Category ${category} is empty, using default skills`);
                const defaultSkills = this.getDefaultSkillsForCategory(category);
                defaultSkills.forEach(skill => {
                    const skillEl = document.createElement('div');
                    skillEl.className = 'skill-item';
                    const skillColor = skill.color || '#6a5acd';
                    skillEl.innerHTML = `
                        <div class="skill-header">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-percentage" data-count-to="${skill.percentage}">0%</div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-fill" data-width="${skill.percentage}%" style="background: ${skillColor}"></div>
                        </div>
                    `;
                    categoryEl.appendChild(skillEl);
                });
            } else {
                skills.forEach(skill => {
                    console.log('Processing skill:', skill);
                    const skillEl = document.createElement('div');
                    skillEl.className = 'skill-item';
                    const skillColor = skill.color || '#6a5acd';
                    skillEl.innerHTML = `
                        <div class="skill-header">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-percentage" data-count-to="${skill.percentage}">0%</div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-fill" data-width="${skill.percentage}%" style="background: ${skillColor}"></div>
                        </div>
                    `;
                    categoryEl.appendChild(skillEl);
                });
            }
            
            skillsContainer.appendChild(categoryEl);
            console.log(`Added category: ${category}`);
        });
        
        console.log('Skills section update complete');
        
        // Trigger animations and percentage counting for skills
        setTimeout(() => {
            this.triggerSkillsAnimations();
        }, 200);
        
        // Debug: Check what's actually in the container
        setTimeout(() => {
            const skillsContainer = document.querySelector('.skills-list');
            if (skillsContainer) {
                console.log('Final skills container HTML:', skillsContainer.innerHTML);
                console.log('Number of category cards:', skillsContainer.children.length);
                console.log('Skills container visible:', skillsContainer.offsetHeight > 0);
                console.log('Skills container display:', window.getComputedStyle(skillsContainer).display);
                console.log('Skills container opacity:', window.getComputedStyle(skillsContainer).opacity);
                Array.from(skillsContainer.children).forEach((child, index) => {
                    console.log(`Category ${index}:`, child.className, child.innerHTML.substring(0, 100));
                    console.log(`Category ${index} visible:`, child.offsetHeight > 0);
                });
            }
        }, 100);
    }

    getDefaultSkillsForCategory(category) {
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
        
        return defaultSkills[category] || [];
    }

    triggerSkillsAnimations() {
        console.log('Triggering skills animations...');
        
        // Find all skill category cards
        const skillCards = document.querySelectorAll('.skills-category-card');
        
        skillCards.forEach((card, index) => {
            // Add stagger delay for animation
            setTimeout(() => {
                // Make the card visible
                card.classList.add('is-visible');
                
                // Trigger percentage counting for each skill in this card
                const skillPercentages = card.querySelectorAll('.skill-percentage[data-count-to]');
                const skillFills = card.querySelectorAll('.skill-fill[data-width]');
                
                skillPercentages.forEach((percentageEl, skillIndex) => {
                    setTimeout(() => {
                        this.animateCountUp(percentageEl);
                    }, skillIndex * 100);
                });
                
                skillFills.forEach((fillEl, skillIndex) => {
                    setTimeout(() => {
                        const width = fillEl.getAttribute('data-width');
                        fillEl.style.width = width;
                    }, skillIndex * 100);
                });
            }, index * 200); // Stagger each category
        });
    }

    animateCountUp(el) {
        const target = parseInt(el.dataset.countTo, 10);
        const duration = 2000;
        const suffix = el.innerText.includes('%') ? '%' : '';
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.innerText = Math.floor(progress * target) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    updateTestimonialsSection() {
        if (!this.content.testimonials) return;
        
        const testimonialsContainer = document.querySelector('.testimonials-list');
        if (!testimonialsContainer) return;
        
        // Find the swiper wrapper
        const swiperWrapper = testimonialsContainer.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;
        
        // Clear existing slides
        swiperWrapper.innerHTML = '';
        
        this.content.testimonials.forEach(testimonial => {
            const slideEl = document.createElement('div');
            slideEl.className = 'swiper-slide';
            
            // Create avatar - use image if available, otherwise use initials
            const avatarHtml = testimonial.image && testimonial.image.trim() !== '' 
                ? `<img src="${testimonial.image}" alt="${testimonial.name}" class="author-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                : '';
            
            slideEl.innerHTML = `
                <div class="testimonial-card card gradient-border">
                    <div class="author-info">
                        <div class="author-avatar">
                            ${avatarHtml}
                            <div class="author-avatar-initial" ${testimonial.image && testimonial.image.trim() !== '' ? 'style="display:none;"' : ''}>${testimonial.name.charAt(0)}</div>
                        </div>
                        <div>
                            <h4 class="author-name">${testimonial.name}</h4>
                            <p class="author-title">${testimonial.title}</p>
                        </div>
                    </div>
                    <p class="quote">"${testimonial.quote}"</p>
                    <div class="stars">${'★'.repeat(testimonial.rating || 5)}</div>
                </div>
            `;
            swiperWrapper.appendChild(slideEl);
        });
    }

    updateContactSection() {
        if (!this.content.contact) return;
        
        const contact = this.content.contact;
        
        const emailEl = document.querySelector('.contact-email');
        const linkedinEl = document.querySelector('.contact-linkedin');
        const locationEl = document.querySelector('.contact-location');
        
        if (emailEl) emailEl.href = `mailto:${contact.email}`;
        if (linkedinEl) linkedinEl.href = contact.linkedin;
        if (locationEl) locationEl.textContent = contact.location;
        
        // Update contact form
        this.updateContactForm();
    }
    
    updateNavigation() {
        // Check for navigation data in the correct location
        const navigation = this.content.navigation;
        console.log('Navigation data found:', navigation);
        if (!navigation) {
            console.log('No navigation data found');
            return;
        }
        const navbar = document.getElementById('navbar');
        const logoElement = navbar?.querySelector('.logo');
        
        if (!navbar || !logoElement) return;
        
        // Handle logo visibility
        if (navigation.showLogo === false) {
            logoElement.style.display = 'none';
        } else {
            logoElement.style.display = 'block';
            
            // Update logo if provided
            if (navigation.logo) {
                const logoImg = logoElement.querySelector('img');
                if (logoImg) {
                    logoImg.src = navigation.logo;
                }
            }
        }
        
        // Handle sticky navigation
        if (navigation.sticky === false) {
            navbar.classList.remove('sticky');
        } else {
            navbar.classList.add('sticky');
        }
        
        // Update navigation colors based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? (navigation.textColor || '#ffffff') : (navigation.textColorLight || '#333333');
        const bgColor = isDarkMode ? (navigation.bgColor || '#1a1a1a') : (navigation.bgColorLight || '#ffffff');
        const hoverColor = isDarkMode ? (navigation.hoverColor || '#ffd700') : (navigation.hoverColorLight || '#6a5acd');
        
        // Apply colors to navigation
        navbar.style.setProperty('--nav-text-color', textColor);
        navbar.style.setProperty('--nav-bg-color', bgColor);
        navbar.style.setProperty('--nav-hover-color', hoverColor);
        
        // Update navigation links
        if (navigation.links && navigation.links.length > 0) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.innerHTML = '';
                navigation.links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.target;
                    a.textContent = link.text;
                    if (link.newTab) {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    }
                    li.appendChild(a);
                    navMenu.appendChild(li);
                });
            }
        }
    }
    
    updateContactForm() {
        const formContainer = document.getElementById('contact-form');
        
        if (!formContainer) return;
        
        if (!this.content.form_config) {
            // Render default form if no config
            this.renderDefaultForm();
            return;
        }
        
        const formConfig = this.content.form_config;
        console.log('Updating contact form with config:', formConfig);
        
        switch (formConfig.type) {
            case 'email':
                this.renderEmailForm(formConfig.email);
                break;
            case 'autoresponder':
                this.renderAutoresponderForm(formConfig.autoresponder);
                break;
            case 'google-form':
                this.renderGoogleForm(formConfig.googleForm);
                break;
            case 'custom':
                this.renderCustomForm(formConfig.custom);
                break;
            default:
                this.renderDefaultForm();
        }
    }
    
    renderEmailForm(config) {
        const formContainer = document.getElementById('contact-form');
        formContainer.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" id="firstName" name="firstName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" id="lastName" name="lastName" class="form-input" required>
                </div>
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" name="email" class="form-input" required>
            </div>
            <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea id="message" name="message" class="form-textarea" placeholder="Share your goals and how I can assist you..." required></textarea>
            </div>
            <button type="submit" class="btn-submit magnetic">Submit Request <i data-feather="send"></i></button>
        `;
        
        // Add email submission handler
        formContainer.onsubmit = (e) => this.handleEmailSubmission(e, config);
    }
    
    renderAutoresponderForm(config) {
        const formContainer = document.getElementById('contact-form');
        
        if (config.parsedData) {
            // Use parsed form data
            const fields = config.parsedData.fields.map(field => `
                <div class="form-group">
                    <label for="${field.name}" class="form-label">${field.label}</label>
                    <input type="${field.type}" id="${field.name}" name="${field.name}" class="form-input" 
                           placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                </div>
            `).join('');
            
            formContainer.innerHTML = `
                <form action="${config.parsedData.action}" method="${config.parsedData.method}">
                    ${fields}
                    <button type="submit" class="btn-submit magnetic">Submit <i data-feather="send"></i></button>
                </form>
            `;
        } else {
            // Use raw code
            formContainer.innerHTML = config.code || '<p>No autoresponder code configured</p>';
        }
    }
    
    renderGoogleForm(config) {
        const formContainer = document.getElementById('contact-form');
        const embedUrl = config.url.replace('/viewform', '/embed');
        
        formContainer.innerHTML = `
            <iframe src="${embedUrl}" 
                    width="100%" 
                    height="${config.height}" 
                    frameborder="0" 
                    marginheight="0" 
                    marginwidth="0">
                Loading…
            </iframe>
        `;
    }
    
    renderCustomForm(config) {
        const formContainer = document.getElementById('contact-form');
        
        const fields = config.fields.map(field => `
            <div class="form-group">
                <label for="${field.name}" class="form-label">${field.label}</label>
                ${field.type === 'textarea' ? 
                    `<textarea id="${field.name}" name="${field.name}" class="form-textarea" ${field.required ? 'required' : ''}></textarea>` :
                    `<input type="${field.type}" id="${field.name}" name="${field.name}" class="form-input" ${field.required ? 'required' : ''}>`
                }
            </div>
        `).join('');
        
        formContainer.innerHTML = `
            <form id="custom-contact-form">
                ${fields}
                <button type="submit" class="btn-submit magnetic">Submit <i data-feather="send"></i></button>
            </form>
        `;
        
        // Add custom form handler
        formContainer.querySelector('#custom-contact-form').onsubmit = (e) => this.handleCustomSubmission(e);
    }
    
    renderDefaultForm() {
        const formContainer = document.getElementById('contact-form');
        formContainer.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" id="firstName" name="firstName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" id="lastName" name="lastName" class="form-input" required>
                </div>
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" name="email" class="form-input" required>
            </div>
            <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea id="message" name="message" class="form-textarea" placeholder="Share your goals and how I can assist you..." required></textarea>
            </div>
            <button type="submit" class="btn-submit magnetic">Submit Request <i data-feather="send"></i></button>
        `;
    }
    
    async handleEmailSubmission(e, config) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // For now, just show a success message
        // In production, you'd send this to your email service
        alert('Thank you for your message! Soumita will get back to you soon.');
        e.target.reset();
    }
    
    handleCustomSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('Custom form submission:', data);
        alert('Thank you for your message! Soumita will get back to you soon.');
        e.target.reset();
    }

    updateLinkedInSection() {
        console.log('Updating LinkedIn section...');
        console.log('LinkedIn content:', this.content.linkedin);
        
        if (!this.content.linkedin) {
            console.log('No LinkedIn content found, keeping original content');
            return;
        }
        
        const linkedinPosts = this.content.linkedin;
        const linkedinContainer = document.querySelector('.linkedin-posts-grid');
        
        console.log('LinkedIn container found:', linkedinContainer);
        
        if (!linkedinContainer) {
            console.log('LinkedIn container not found');
            return;
        }
        
        // Only clear and repopulate if we have valid LinkedIn data
        if (linkedinPosts && linkedinPosts.length > 0) {
            linkedinContainer.innerHTML = '';
            console.log('LinkedIn posts to render:', linkedinPosts);
        } else {
            console.log('No LinkedIn posts to render, keeping original content');
            return;
        }
        
        linkedinPosts.forEach((post, index) => {
            console.log(`Creating LinkedIn post ${index}:`, post);
            const postElement = document.createElement('div');
            postElement.className = 'linkedin-post-card card gradient-border';
            // Temporarily remove animation to test visibility
            // postElement.setAttribute('data-animation', 'fade-in-up');
            
            // Show post image if available
            const imageSection = post.image ? `
                <div class="linkedin-post-image">
                    <img src="${post.image}" alt="LinkedIn post image" onerror="this.style.display='none'">
                </div>
            ` : '';
            
            postElement.innerHTML = `
                <div class="linkedin-post-header">
                    <img src="https://soumita.space/images/soumita-office-1.jpeg" alt="Soumita Chatterjee" class="linkedin-profile-pic">
                    <div class="linkedin-author-info">
                        <span class="linkedin-author-name">Soumita Chatterjee</span>
                        <span class="linkedin-author-handle">Australia Immigration Specialist</span>
                    </div>
                </div>
                <div class="linkedin-post-body">
                    <p class="linkedin-post-text">${post.description}</p>
                    <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="linkedin-post-link">
                        Read more on LinkedIn <i data-feather="arrow-right" style="width:16px;"></i>
                    </a>
                </div>
            `;
            
            linkedinContainer.appendChild(postElement);
            console.log(`LinkedIn post ${index} added to container`);
        });
        
        console.log('LinkedIn section update complete');
        console.log('Final LinkedIn container HTML:', linkedinContainer.innerHTML.substring(0, 500));
    }

    async scrapeLinkedInPost(url) {
        try {
            console.log('Scraping LinkedIn post:', url);
            
            // Use a CORS proxy to avoid cross-origin issues
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(url));
            
            if (!response.ok) {
                throw new Error('Failed to fetch LinkedIn post');
            }
            
            const html = await response.text();
            
            // Parse the HTML to extract post data
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract post content
            const postContent = doc.querySelector('.feed-shared-update-v2__description') || 
                               doc.querySelector('.feed-shared-text') ||
                               doc.querySelector('[data-test-id="post-content"]');
            
            // Extract post title/headline
            const postTitle = doc.querySelector('.feed-shared-update-v2__description')?.textContent?.trim() ||
                             doc.querySelector('.feed-shared-text')?.textContent?.trim() ||
                             'LinkedIn Post';
            
            // Extract post image
            const postImage = doc.querySelector('.feed-shared-image__image')?.src ||
                             doc.querySelector('.feed-shared-image img')?.src ||
                             '';
            
            // Extract engagement data
            const likes = doc.querySelector('[data-test-id="social-actions__reactions-count"]')?.textContent || '0';
            const comments = doc.querySelector('[data-test-id="social-actions__comments-count"]')?.textContent || '0';
            
            // Extract post date
            const postDate = doc.querySelector('.feed-shared-actor__sub-description')?.textContent?.trim() ||
                            doc.querySelector('.feed-shared-actor__sub-description')?.textContent?.trim() ||
                            'Recently';
            
            return {
                title: postTitle.substring(0, 100) + (postTitle.length > 100 ? '...' : ''),
                description: postContent?.textContent?.trim().substring(0, 200) + '...' || 'LinkedIn post content',
                image: postImage,
                likes: likes,
                comments: comments,
                date: postDate,
                url: url
            };
            
        } catch (error) {
            console.error('Error scraping LinkedIn post:', error);
            return {
                title: 'LinkedIn Post',
                description: 'Unable to fetch post content. Click to view on LinkedIn.',
                image: '',
                likes: '0',
                comments: '0',
                date: 'Recently',
                url: url
            };
        }
    }

    updateTypewriterTitles(titles) {
        console.log('Updating typewriter titles:', titles);
        
        // Update the global typewriter titles
        window.typewriterTitles = titles;
        
        // Clear the typewriter element
        const typewriterElement = document.getElementById('typewriter-subtitle');
        if (typewriterElement) {
            typewriterElement.textContent = '';
        }
        
        // Restart the typewriter with new titles
        if (window.initTypewriter) {
            console.log('Restarting typewriter with new titles');
            window.initTypewriter();
        } else {
            console.log('Typewriter function not available, creating new one');
            // Create a new typewriter function if the original doesn't exist
            this.createTypewriter(titles);
        }
    }
    
    createTypewriter(titles) {
        const typewriterElement = document.getElementById('typewriter-subtitle');
        if (!typewriterElement || !titles || titles.length === 0) return;
        
        console.log('Creating new typewriter with titles:', titles);
        
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenTitles = 2000;
        
        function type() {
            const currentTitle = titles[titleIndex];
            let typeTimeout = isDeleting ? deleteSpeed : typeSpeed;
            
            if (isDeleting) {
                typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentTitle.length) {
                isDeleting = true;
                typeTimeout = delayBetweenTitles;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeTimeout = 500;
            }
            
            setTimeout(type, typeTimeout);
        }
        
        setTimeout(type, 500);
    }

    updateSettings() {
        if (!this.content.settings) return;
        
        const settings = this.content.settings;
        
        // Update page title
        if (settings.title) {
            document.title = settings.title;
        }
        
        // Update theme
        if (settings.theme) {
            // Remove all theme classes
            document.body.classList.remove('theme-modern', 'theme-elegant', 'theme-creative', 'theme-minimal', 'theme-corporate');
            
            // Add the selected theme class
            document.body.classList.add(`theme-${settings.theme}`);
            
            // Store theme preference
            localStorage.setItem('selected-theme', settings.theme);
        }
        
        // Update CSS variables for colors
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
        }
        if (settings.secondaryColor) {
            document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
        }
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--color-accent', settings.accentColor);
        }
        
        // Update footer if footer data exists
        if (this.content.footer) {
            this.updateFooter();
        }
        
        // Update contact form if contact data exists
        if (this.content.contact) {
            this.updateContactForm();
        }
    }

    updateFooter() {
        console.log('Updating footer with content:', this.content.footer);
        
        // Update footer logo
        const footerLogo = document.querySelector('.footer-left img');
        if (footerLogo) {
            if (this.content.footer && this.content.footer.logo) {
                footerLogo.src = this.content.footer.logo;
            } else {
                // Use default logo if none set in database
                footerLogo.src = 'https://anwe.sh/work/sclogo1.png';
            }
            
            // Handle SVG files properly
            if (this.content.footer && this.content.footer.logo && this.content.footer.logo.includes('svg')) {
                footerLogo.style.filter = 'none';
            }
            
            // Auto-resize large images
            footerLogo.onload = function() {
                const maxHeight = 30;
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
        }
        
        // Update footer description (text, not link)
        const footerDescription = document.querySelector('.footer-left span');
        if (footerDescription && this.content.footer && this.content.footer.description) {
            footerDescription.textContent = this.content.footer.description;
        }
        
        // Update footer links - USE DATABASE LINKS OR DEFAULT LINKS
        const footerLegal = document.querySelector('.footer-legal');
        if (footerLegal) {
            // Clear existing links
            footerLegal.innerHTML = '';
            
            // Add links from the database OR use default links
            if (this.content.footer && this.content.footer.links && this.content.footer.links.length > 0) {
                console.log('Adding footer links from database:', this.content.footer.links);
                this.content.footer.links.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url;
                    linkElement.textContent = link.text;
                    linkElement.target = link.newTab ? '_blank' : '_self';
                    if (link.newTab) {
                        linkElement.rel = 'noopener noreferrer';
                    }
                    footerLegal.appendChild(linkElement);
                });
            }
            
            // Always add the Legal link (even if database links exist)
            const legalLink = document.createElement('a');
            legalLink.href = '#';
            legalLink.textContent = 'Legal';
            legalLink.onclick = (e) => {
                e.preventDefault();
                if (typeof window.openLegalModal === 'function') {
                    window.openLegalModal();
                } else {
                    console.log('openLegalModal function not found');
                }
            };
            footerLegal.appendChild(legalLink);
        }
        
        // Update copyright
        const footerCenter = document.querySelector('.footer-center p');
        if (footerCenter && this.content.footer && this.content.footer.copyright) {
            footerCenter.textContent = this.content.footer.copyright;
        }
        

        
        console.log('Footer updated successfully');
    }
    
    updateContactForm() {
        console.log('Updating contact form with content:', this.content.contact);
        
        const contactForm = document.getElementById('contact-form');
        const contactDetails = document.getElementById('contact-details');
        const contactSection = document.getElementById('contact');
        
        if (!contactForm || !contactDetails) {
            console.log('Contact form or details containers not found');
            return;
        }
        
        const contact = this.content.contact;
        
        // Update contact section header
        if (contactSection && contact.title && contact.subtitle) {
            const sectionHeader = contactSection.querySelector('.section-header');
            if (sectionHeader) {
                const titleElement = sectionHeader.querySelector('.section-title');
                const descriptionElement = sectionHeader.querySelector('.section-description');
                
                if (titleElement) {
                    titleElement.innerHTML = contact.title.replace('Connect', '<span class="gradient-text">Connect</span>');
                }
                if (descriptionElement) {
                    descriptionElement.textContent = contact.subtitle;
                }
            }
        }
        
        // Update contact form based on type
        switch (contact.formType) {
            case 'simple':
                contactForm.innerHTML = this.generateSimpleContactForm(contact.simpleForm);
                break;
            case 'autoresponder':
                contactForm.innerHTML = this.generateAutoresponderContactForm(contact.autoresponderForm);
                break;
            case 'email':
                contactForm.innerHTML = this.generateEmailContactForm(contact.emailForm);
                break;
            case 'google':
                contactForm.innerHTML = this.generateGoogleContactForm(contact.googleForm);
                break;
            default:
                contactForm.innerHTML = this.generateDefaultContactForm();
        }
        
        // Update contact details
        contactDetails.innerHTML = this.generateContactDetails(contact);
        
        console.log('Contact form updated successfully');
    }
    
    generateSimpleContactForm(simpleForm) {
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
    
    generateAutoresponderContactForm(autoresponderForm) {
        const formCode = autoresponderForm.code || '';
        const formMatch = formCode.match(/<form[^>]*>[\s\S]*?<\/form>/i);
        
        if (formMatch) {
            return formMatch[0];
        }
        
        return `
            <form class="contact-form" id="autoresponder-contact-form">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Your Email" required>
                </div>
                <button type="submit" class="btn-primary">Submit</button>
            </form>
        `;
    }
    
    generateEmailContactForm(emailForm) {
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
    
    generateGoogleContactForm(googleForm) {
        const formUrl = googleForm.url || '';
        if (formUrl) {
            return `
                <iframe src="${formUrl}" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0">
                    Loading...
                </iframe>
            `;
        }
        
        return '<p>Please configure a valid Google Form URL in the admin panel.</p>';
    }
    
    generateDefaultContactForm() {
        return `
            <form class="contact-form" id="default-contact-form">
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
    
    generateContactDetails(contact) {
        let detailsHtml = '';
        
        // Email
        if (contact.email) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="email">
                    <div class="contact-detail-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Email</span>
                        <a href="mailto:${contact.email}" class="contact-email">${contact.email}</a>
                    </div>
                </div>
            `;
        }
        
        // Phone
        if (contact.phone) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="phone">
                    <div class="contact-detail-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Phone</span>
                        <a href="tel:${contact.phone}" class="contact-phone">${contact.phone}</a>
                    </div>
                </div>
            `;
        }
        
        // Location
        if (contact.location) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="location">
                    <div class="contact-detail-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Location</span>
                        <span class="contact-location">${contact.location}</span>
                    </div>
                </div>
            `;
        }
        
        // Social media links
        if (contact.linkedin) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="linkedin">
                    <div class="contact-detail-icon">
                        <i class="fab fa-linkedin"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>LinkedIn</span>
                        <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-linkedin">Connect Professionally</a>
                    </div>
                </div>
            `;
        }
        
        if (contact.facebook) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="facebook">
                    <div class="contact-detail-icon">
                        <i class="fab fa-facebook"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Facebook</span>
                        <a href="${contact.facebook}" target="_blank" rel="noopener noreferrer" class="contact-facebook">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        if (contact.twitter) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="twitter">
                    <div class="contact-detail-icon">
                        <i class="fab fa-twitter"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>X (Twitter)</span>
                        <a href="${contact.twitter}" target="_blank" rel="noopener noreferrer" class="contact-twitter">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        if (contact.instagram) {
            detailsHtml += `
                <div class="contact-detail-item" data-type="instagram">
                    <div class="contact-detail-icon">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <div class="contact-detail-text">
                        <span>Instagram</span>
                        <a href="${contact.instagram}" target="_blank" rel="noopener noreferrer" class="contact-instagram">Follow Us</a>
                    </div>
                </div>
            `;
        }
        
        // Custom links
        if (contact.customLinks && contact.customLinks.length > 0) {
            contact.customLinks.forEach(link => {
                detailsHtml += `
                    <div class="contact-detail-item" data-type="custom">
                        <div class="contact-detail-icon">
                            ${link.logo ? `<img src="${link.logo}" alt="${link.text}" style="width: 20px; height: 20px;">` : '<i class="fas fa-link"></i>'}
                        </div>
                        <div class="contact-detail-text">
                            <span>${link.text}</span>
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="contact-custom-link">Visit</a>
                        </div>
                    </div>
                `;
            });
        }
        
        return detailsHtml;
    }

    triggerStatisticsAnimations() {
        console.log('Triggering statistics animations...');
        
        // Find all stat cards
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            // Add stagger delay for animation
            setTimeout(() => {
                // Make the card visible
                card.classList.add('is-visible');
                
                // Trigger count-up animation for the stat number
                const statNumber = card.querySelector('.stat-number[data-count-to]');
                if (statNumber) {
                    this.animateCountUp(statNumber);
                }
            }, index * 200); // Stagger each card by 200ms
        });
    }
}

// Initialize website loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing WebsiteLoader...');
    
    // Set a timeout to ensure page loads even if everything fails
    const timeout = setTimeout(() => {
        console.log('Timeout reached, forcing default content');
        const fallbackLoader = new WebsiteLoader();
        fallbackLoader.content = fallbackLoader.getDefaultContent();
        fallbackLoader.updateWebsite();
    }, 5000); // 5 second timeout
    
    try {
        const websiteLoader = new WebsiteLoader();
        console.log('WebsiteLoader created:', websiteLoader);
        
        await websiteLoader.init();
        console.log('WebsiteLoader initialized successfully');
        
        // Clear timeout since we succeeded
        clearTimeout(timeout);
        
        // Make refresh function globally accessible
        window.refreshWebsiteContent = () => websiteLoader.refreshContent();
        window.websiteLoader = websiteLoader; // Make it globally accessible for admin panel
        
        // Listen for localStorage changes from admin panel
        window.addEventListener('storage', function(e) {
            if (e.key === 'websiteData') {
                console.log('Storage updated, refreshing website...');
                try {
                    const newData = JSON.parse(e.newValue);
                    websiteLoader.content = newData;
                    websiteLoader.updateWebsite();
                } catch (error) {
                    console.error('Error parsing updated website data:', error);
                }
            }
        });
        
        // Theme change handler
        window.addEventListener('message', function(event) {
            if (event.data.type === 'CHANGE_THEME') {
                changeTheme(event.data.theme);
            }
            
                    // Handle preview updates from admin panel
        if (event.data.type === 'UPDATE_WEBSITE') {
            console.log('Received preview update:', event.data.data);
            websiteLoader.content = event.data.data;
            websiteLoader.updateWebsite();
        }
        
        // Handle localStorage updates from admin panel
        if (event.data.type === 'STORAGE_UPDATED') {
            console.log('Received localStorage update');
            const storedData = localStorage.getItem('websiteData');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    websiteLoader.content = parsedData;
                    websiteLoader.updateWebsite();
                } catch (error) {
                    console.error('Error parsing stored website data:', error);
                }
            }
        }
        });

        function changeTheme(themeName) {
            // Remove all theme classes
            document.body.classList.remove('theme-modern', 'theme-elegant', 'theme-creative', 'theme-minimal', 'theme-corporate');
            
            // Add the new theme class
            document.body.classList.add(`theme-${themeName}`);
            
            // Store theme preference
            localStorage.setItem('selected-theme', themeName);
            
            // Re-trigger animations for the new theme
            setTimeout(() => {
                if (websiteLoader.triggerSkillsAnimations) {
                    websiteLoader.triggerSkillsAnimations();
                }
            }, 100);
        }
        
        console.log('Website initialization complete');
    } catch (error) {
        console.error('Error during website initialization:', error);
        // Clear timeout and force default content
        clearTimeout(timeout);
        const fallbackLoader = new WebsiteLoader();
        fallbackLoader.content = fallbackLoader.getDefaultContent();
        fallbackLoader.updateWebsite();
    }
});

// Handle messages from admin panel (for preview functionality)
window.addEventListener('message', function(event) {
    if (event.data.type === 'REQUEST_WEBSITE_DATA') {
        // Send current website data back to admin panel
        if (window.websiteLoader) {
            event.source.postMessage({
                type: 'WEBSITE_DATA',
                data: window.websiteLoader.content
            }, '*');
        }
    }
});