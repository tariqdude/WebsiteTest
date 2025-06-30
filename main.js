document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initNavbarEffects();
    initGallery();
    initContactForm();
    initAnimations();
    initLazyLoading();
});

// Mobile menu functionality - Enhanced
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth scrolling - Enhanced
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar effects - Enhanced
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollTop = 0;

    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Update active navigation link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        lastScrollTop = scrollTop;
    }, 16));
}

// Gallery functionality - Enhanced
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    let currentImageIndex = 0;
    let visibleImages = [];

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items with animation
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
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
            
            updateVisibleImages();
        });
    });

    // Update visible images array
    function updateVisibleImages() {
        visibleImages = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
    }

    // Initialize visible images
    updateVisibleImages();

    // Modal functionality
    if (modal && modalImg && modalCaption && closeBtn) {
        // Close modal events
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
            if (e.key === 'ArrowLeft' && modal.style.display === 'block') {
                changeImage(-1);
            }
            if (e.key === 'ArrowRight' && modal.style.display === 'block') {
                changeImage(1);
            }
        });
    }

    // Initialize gallery items
    galleryItems.forEach((item, index) => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.transition = 'all 0.3s ease';
    });
}

// Modal functions - Global scope for onclick handlers
window.openModal = function(button) {
    const galleryItem = button.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('h4').textContent;
    const description = galleryItem.querySelector('p').textContent;
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    
    if (modal && modalImg && modalCaption) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
        
        // Update current image index
        const visibleImages = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
            item.style.display !== 'none'
        );
        currentImageIndex = visibleImages.indexOf(galleryItem);
        
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.changeImage = function(direction) {
    const visibleImages = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
        item.style.display !== 'none'
    );
    
    currentImageIndex += direction;
    
    if (currentImageIndex >= visibleImages.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = visibleImages.length - 1;
    
    const newItem = visibleImages[currentImageIndex];
    const img = newItem.querySelector('img');
    const title = newItem.querySelector('h4').textContent;
    const description = newItem.querySelector('p').textContent;
    
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    
    if (modalImg && modalCaption) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
    }
};

// Contact form - Enhanced
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitForm(this);
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
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

    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate form submission (replace with actual API call)
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate API delay
    setTimeout(() => {
        console.log('Form submitted:', data);
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Track form submission
        trackEvent('contact_form_submit', { service: data.service });
    }, 2000);
}

// Animation on scroll - Enhanced
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animation for child elements
                const children = entry.target.querySelectorAll('.feature-item, .gallery-item, .contact-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about, .gallery, .contact, .feature-item, .gallery-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stats counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    animateCounter(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
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

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
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
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-popup message-${type}`;
    
    // Add icon based on type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    messageEl.innerHTML = `<span class="message-icon">${icon}</span><span>${message}</span>`;
    
    // Style the message
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
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '400px'
    });

    document.body.appendChild(messageEl);

    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, 5000);
}

function trackEvent(eventName, parameters = {}) {
    // Add analytics tracking here
    console.log('Event tracked:', eventName, parameters);
    
    // Example: Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, parameters);
    // }
}

// Performance optimization
let currentImageIndex = 0;

// Initialize touch gestures for mobile
function initTouchGestures() {
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Only trigger if modal is open
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === 'block') {
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    changeImage(1); // Swipe left - next image
                } else {
                    changeImage(-1); // Swipe right - previous image
                }
            }
        }

        startX = 0;
        startY = 0;
    }, { passive: true });
}

// Initialize touch gestures
initTouchGestures();

// Export functions for global access
window.BusinessWebsite = {
    openModal: window.openModal,
    closeModal: window.closeModal,
    changeImage: window.changeImage,
    showMessage,
    trackEvent,
    validateForm,
    submitForm
};
