// Enhanced Website Controller with improved error handling and accessibility
import { ErrorHandler, ValidationRules } from './errorHandler.js';

export class WebsiteController {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.slideInterval = null;
    this.isInitialized = false;
    this.observers = new Map();
    this.eventListeners = new Map();
    
    // Bind methods to maintain context
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize all components
      await this.initializeComponents();
      this.setupEventListeners();
      this.setupAccessibility();
      
      this.isInitialized = true;
      console.log('Website Controller initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Website Controller:', error);
      ErrorHandler.handleNetworkError(error);
    }
  }

  async initializeComponents() {
    // Initialize components in order of priority
    this.setupMobileNavigation();
    this.setupSmoothScrolling();
    this.setupScrollNavbar();
    this.setupContactForm();
    this.setupIntersectionObserver();
    this.setupTestimonialSlider();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
    // Global event listeners with cleanup tracking
    const eventOptions = { passive: true };
    
    window.addEventListener('resize', this.handleResize, eventOptions);
    window.addEventListener('scroll', this.handleScroll, eventOptions);
    
    // Track listeners for cleanup
    this.eventListeners.set('resize', this.handleResize);
    this.eventListeners.set('scroll', this.handleScroll);
    
    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSlideshow();
      } else if (this.isInitialized) {
        this.startSlideshow();
      }
    });
  }

  setupAccessibility() {
    // Enhanced focus management
    this.setupFocusTrap();
    this.setupReducedMotion();
    this.announcePageLoad();
  }

  setupFocusTrap() {
    // Trap focus within mobile menu when open
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      this.pauseSlideshow(); // Don't auto-advance testimonials
    }
    
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        this.pauseSlideshow();
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
        this.startSlideshow();
      }
    });
  }

  announcePageLoad() {
    // Announce page load to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Page loaded. Midwest Climate Solutions website ready.';
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => announcement.remove(), 3000);
  }

  setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;

    // Enhanced hamburger click handler
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('-translate-x-full')) {
        this.closeMobileMenu();
        hamburger.focus(); // Return focus to hamburger
      }
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;
    
    const isOpen = !mobileMenu.classList.contains('-translate-x-full');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenu.classList.remove('-translate-x-full');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    
    // Focus first link in menu
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;
    
    mobileMenu.classList.add('-translate-x-full');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling with better performance
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          // Calculate offset accounting for fixed navbar
          const navHeight = document.querySelector('header')?.offsetHeight || 80;
          const targetPosition = target.offsetTop - navHeight;
          
          // Smooth scroll with intersection observer for completion
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
          
          // Announce navigation to screen readers
          this.announceNavigation(target.id);
        }
      });
    });
  }

  announceNavigation(sectionId) {
    const sectionNames = {
      home: 'Home section',
      services: 'Services section',
      projects: 'Projects section', 
      about: 'About section',
      contact: 'Contact section'
    };
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigated to ${sectionNames[sectionId] || sectionId}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 2000);
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Skip links activation
      if (e.key === 'Tab' && !e.shiftKey && e.target === document.body) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
          skipLink.focus();
        }
      }
    });
  }

  setupContactForm() {
    const form = document.querySelector('form[name="hvac-contact"]');
    if (!form) return;

    // Enhanced form handling with better validation
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission(form);
    });
    
    // Real-time validation with debouncing
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      let timeoutId;
      
      input.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => this.validateField(input), 300);
      });
      
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  async handleFormSubmission(form) {
    try {
      // Show loading state
      const loadingElement = ErrorHandler.showLoading(form.parentElement, 'Sending your message...');
      
      // Validate form
      if (!this.validateForm(form)) {
        ErrorHandler.hideLoading(loadingElement);
        return;
      }
      
      // Prepare form data
      const formData = new FormData(form);
      
      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      ErrorHandler.hideLoading(loadingElement);
      
      if (response.ok) {
        ErrorHandler.showSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
        this.resetForm(form);
      } else {
        throw new Error(`Form submission failed with status ${response.status}`);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      ErrorHandler.handleNetworkError(error);
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const rules = this.getValidationRules(field);
    return ErrorHandler.validateField(field, rules);
  }

  getValidationRules(field) {
    const rules = [];
    
    if (field.hasAttribute('required')) {
      rules.push(ValidationRules.required());
    }
    
    if (field.type === 'email') {
      rules.push(ValidationRules.email());
    }
    
    if (field.type === 'tel') {
      rules.push(ValidationRules.phone());
    }
    
    if (field.name === 'message') {
      rules.push(ValidationRules.minLength(10, 'Message must be at least 10 characters'));
    }
    
    return rules;
  }

  resetForm(form) {
    form.reset();
    
    // Clear validation states
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.classList.remove('border-red-500', 'border-green-500', 'bg-red-50', 'bg-green-50');
    });
    
    // Remove error messages
    form.querySelectorAll('.error-message').forEach(msg => msg.remove());
  }

  setupScrollNavbar() {
    let ticking = false;
    
    this.handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  updateNavbar() {
    const navbar = document.querySelector('header');
    if (!navbar) return;

    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-lg');
      navbar.classList.remove('bg-transparent');
      
      // Update navigation link colors for better contrast
      navbar.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-white', 'hover:text-orange-400');
        link.classList.add('text-gray-800', 'hover:text-blue-600');
      });
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-lg');
      navbar.classList.add('bg-transparent');
      
      // Restore original colors
      navbar.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-gray-800', 'hover:text-blue-600');
        link.classList.add('text-white', 'hover:text-orange-400');
      });
    }
  }

  setupIntersectionObserver() {
    // More sophisticated intersection observer with stagger animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animations for better visual effect
          setTimeout(() => {
            entry.target.classList.add('animate-fade-in-up');
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.service-card, .project-card, .about-content, .contact-content'
    );
    
    animatedElements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-8');
      observer.observe(el);
    });
    
    this.observers.set('intersection', observer);
  }

  setupTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('#slider-nav .dot');
    
    if (!slider || dots.length === 0) return;

    // Initialize slider
    this.showSlide(0);
    
    // Dot navigation with keyboard support
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.showSlide(index));
      
      // Keyboard support for dots
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showSlide(index);
        }
      });
    });

    // Auto-advance with pause on hover and focus
    this.startSlideshow();
    
    slider.addEventListener('mouseenter', () => this.pauseSlideshow());
    slider.addEventListener('mouseleave', () => this.startSlideshow());
    slider.addEventListener('focusin', () => this.pauseSlideshow());
    slider.addEventListener('focusout', () => this.startSlideshow());
  }

  showSlide(index) {
    const slider = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('#slider-nav .dot');
    
    if (!slider || !dots.length) return;

    // Smooth transition
    slider.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dot states
    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle('bg-orange-500', isActive);
      dot.classList.toggle('opacity-100', isActive);
      dot.classList.toggle('bg-white/50', !isActive);
      dot.classList.toggle('opacity-50', !isActive);
      dot.setAttribute('aria-pressed', isActive.toString());
    });
    
    // Announce slide change to screen readers
    const testimonialCards = slider.querySelectorAll('.testimonial-card');
    if (testimonialCards[index]) {
      const cite = testimonialCards[index].querySelector('cite');
      if (cite) {
        this.announceSlideChange(cite.textContent, index + 1, this.totalSlides);
      }
    }
    
    this.currentSlide = index;
  }

  announceSlideChange(author, current, total) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Showing testimonial ${current} of ${total} from ${author}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 2000);
  }

  startSlideshow() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.pauseSlideshow();
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(this.currentSlide);
      }, 6000);
    }
  }

  pauseSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  handleResize() {
    // Handle responsive changes
    this.updateNavbar();
  }

  // Cleanup method for proper memory management
  destroy() {
    // Clear intervals
    this.pauseSlideshow();
    
    // Remove event listeners
    this.eventListeners.forEach((listener, event) => {
      window.removeEventListener(event, listener);
    });
    
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Clear maps
    this.eventListeners.clear();
    this.observers.clear();
    
    this.isInitialized = false;
    console.log('Website Controller destroyed');
  }
}

// Initialize when DOM is loaded
let websiteController;

document.addEventListener('DOMContentLoaded', () => {
  websiteController = new WebsiteController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (websiteController) {
    websiteController.destroy();
  }
});

export default WebsiteController;
