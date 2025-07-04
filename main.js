(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debounceDelay: 16,
        animationDelay: 100,
        messageTimeout: 5000,
        scrollOffset: 100,
        breakpoints: {
            mobile: 768,
            tablet: 1024
        }
    };

    // State management
    const state = {
        currentImageIndex: 0,
        isModalOpen: false,
        isMobileMenuOpen: false,
        visibleImages: [],
        animatedElements: new Set()
    };

    // Cache DOM elements
    const elements = {};

    function cacheElements() {
        elements.hamburger = document.querySelector('.hamburger');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.navLinks = document.querySelectorAll('.nav-link');
        elements.navbar = document.querySelector('.navbar');
        elements.sections = document.querySelectorAll('section[id]');
        elements.filterBtns = document.querySelectorAll('.filter-btn');
        elements.galleryItems = document.querySelectorAll('.gallery-item');
        elements.modal = document.getElementById('imageModal');
        elements.modalImg = document.getElementById('modalImage');
        elements.modalCaption = document.querySelector('.modal-caption');
        elements.modalClose = document.querySelector('.modal-close');
        elements.contactForm = document.querySelector('.contact-form');
        elements.heroStats = document.querySelector('.hero-stats');
    }

    // Initialize application
    function init() {
        try {
            cacheElements();
            initMobileMenu();
            initSmoothScrolling();
            initNavbarEffects();
            initGallery();
            initContactForm();
            initAnimations();
            initLazyLoading();
            initAccessibility();
            initTouchGestures();
            
            // Set initial state
            updateVisibleImages();
            
            console.log('Website initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // Enhanced mobile menu
    function initMobileMenu() {
        if (!elements.hamburger || !elements.navMenu) return;

        const toggleMenu = () => {
            const isActive = elements.hamburger.classList.toggle('active');
            elements.navMenu.classList.toggle('active', isActive);
            state.isMobileMenuOpen = isActive;
            
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Update ARIA attributes
            elements.hamburger.setAttribute('aria-expanded', isActive);
            elements.navMenu.setAttribute('aria-hidden', !isActive);
        };

        const closeMenu = () => {
            elements.hamburger.classList.remove('active');
            elements.navMenu.classList.remove('active');
            state.isMobileMenuOpen = false;
            document.body.style.overflow = '';
            
            elements.hamburger.setAttribute('aria-expanded', 'false');
            elements.navMenu.setAttribute('aria-hidden', 'true');
        };

        elements.hamburger.addEventListener('click', toggleMenu);

        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
                updateActiveNavLink(link);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!elements.hamburger.contains(e.target) && 
                !elements.navMenu.contains(e.target) && 
                state.isMobileMenuOpen) {
                closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                closeMenu();
            }
        });
    }

    function updateActiveNavLink(activeLink) {
        elements.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Enhanced smooth scrolling
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = elements.navbar?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced navbar effects
    function initNavbarEffects() {
        if (!elements.navbar) return;

        let ticking = false;

        const updateNavbar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling
            elements.navbar.classList.toggle('scrolled', scrollTop > 50);
            
            // Update active navigation
            updateActiveNavigation(scrollTop);
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function updateActiveNavigation(scrollTop) {
        let current = '';
        
        elements.sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset;
            const sectionHeight = section.clientHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced gallery
    function initGallery() {
        if (!elements.galleryItems.length) return;

        initGalleryFilters();
        initGalleryModal();
        setupGalleryItems();
    }

    function initGalleryFilters() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active filter
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items with staggered animation
                filterGalleryItems(filter);
                updateVisibleImages();
            });
        });
    }

    function filterGalleryItems(filter) {
        elements.galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    function initGalleryModal() {
        if (!elements.modal) return;

        const closeModal = () => {
            elements.modal.classList.remove('show');
            setTimeout(() => {
                elements.modal.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
            state.isModalOpen = false;
        };

        // Event listeners
        elements.modalClose?.addEventListener('click', closeModal);
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (!state.isModalOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    changeImage(-1);
                    break;
                case 'ArrowRight':
                    changeImage(1);
                    break;
            }
        });

        // Expose to global scope
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.changeImage = changeImage;
    }

    function setupGalleryItems() {
        elements.galleryItems.forEach((item, index) => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.3s ease';
            
            // Add keyboard support
            const viewBtn = item.querySelector('.view-btn');
            if (viewBtn) {
                viewBtn.setAttribute('tabindex', '0');
                viewBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(viewBtn);
                    }
                });
            }
        });
    }

    function updateVisibleImages() {
        state.visibleImages = Array.from(elements.galleryItems).filter(item => 
            item.style.display !== 'none'
        );
    }

    // Modal functions
    function openModal(button) {
        const galleryItem = button.closest('.gallery-item');
        const img = galleryItem.querySelector('img');
        const title = galleryItem.querySelector('h4')?.textContent || '';
        const description = galleryItem.querySelector('p')?.textContent || '';
        
        if (!elements.modal || !elements.modalImg || !elements.modalCaption) return;
        
        elements.modal.style.display = 'block';
        requestAnimationFrame(() => {
            elements.modal.classList.add('show');
        });
        
        elements.modalImg.src = img.src;
        elements.modalImg.alt = img.alt;
        elements.modalCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
        
        state.currentImageIndex = state.visibleImages.indexOf(galleryItem);
        state.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }

    function changeImage(direction) {
        if (state.visibleImages.length === 0) return;
        
        state.currentImageIndex += direction;
        
        if (state.currentImageIndex >= state.visibleImages.length) {
            state.currentImageIndex = 0;
        }
        if (state.currentImageIndex < 0) {
            state.currentImageIndex = state.visibleImages.length - 1;
        }
        
        const newItem = state.visibleImages[state.currentImageIndex];
        const img = newItem.querySelector('img');
        const title = newItem.querySelector('h4')?.textContent || '';
        const description = newItem.querySelector('p')?.textContent || '';
        
        if (elements.modalImg && elements.modalCaption) {
            elements.modalImg.src = img.src;
            elements.modalImg.alt = img.alt;
            elements.modalCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
        }
    }

    // Enhanced contact form
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', handleFormSubmit);

        const inputs = elements.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (validateForm(elements.contactForm)) {
            submitForm(elements.contactForm);
        }
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: var(--error-color); font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorDiv);
    }

    function submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', data);
            showMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            
            trackEvent('contact_form_submit', { service: data.service });
        }, 2000);
    }

    // Enhanced animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        const statsObserver = new IntersectionObserver(handleStatsIntersection, observerOptions);

        // Observe elements
        const animateElements = document.querySelectorAll('.about, .gallery, .contact, .feature-item, .gallery-item, .contact-item');
        animateElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        if (elements.heroStats) {
            statsObserver.observe(elements.heroStats);
        }
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.animatedElements.has(entry.target)) {
                entry.target.classList.add('visible');
                state.animatedElements.add(entry.target);
                
                // Stagger child animations
                const children = entry.target.querySelectorAll('.feature-item, .gallery-item, .contact-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * CONFIG.animationDelay);
                });
            }
        });
    }

    function handleStatsIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => animateCounter(stat));
                entry.target.observer?.unobserve(entry.target);
            }
        });
    }

    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 40);
    }

    // Accessibility enhancements
    function initAccessibility() {
        // Add ARIA labels where missing
        const hamburger = elements.hamburger;
        if (hamburger) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        if (elements.navMenu) {
            elements.navMenu.setAttribute('aria-hidden', 'true');
        }

        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Enhanced lazy loading
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Enhanced touch gestures
    function initTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY || !state.isModalOpen) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    changeImage(1); // Swipe left - next image
                } else {
                    changeImage(-1); // Swipe right - previous image
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }

    // Utility functions
    function showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.message-popup');
        if (existingMessage) existingMessage.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `message-popup message-${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        messageEl.innerHTML = `<span class="message-icon">${icon}</span><span>${message}</span>`;
        
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--border-radius)',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform var(--transition-base)',
            backgroundColor: type === 'error' ? 'var(--error-color)' : 
                           type === 'success' ? 'var(--success-color)' : 
                           'var(--primary-color)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '400px'
        });

        document.body.appendChild(messageEl);

        requestAnimationFrame(() => {
            messageEl.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }, CONFIG.messageTimeout);
    }

    function trackEvent(eventName, parameters = {}) {
        console.log('Event tracked:', eventName, parameters);
        
        // Add analytics integration here
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for global access
    window.BusinessWebsite = {
        init,
        showMessage,
        trackEvent,
        state: () => ({ ...state }) // Return a copy of state
    };

})();
