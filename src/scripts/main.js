// Main JavaScript functionality for Midwest Climate Solutions website
class WebsiteController {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.slideInterval = null;
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupSmoothScrolling();
    this.setupContactForm();
    this.setupScrollNavbar();
    this.setupIntersectionObserver();
    this.setupTestimonialSlider();
  }

  // Mobile navigation functionality
  setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('-translate-x-full');
      
      if (isOpen) {
        mobileMenu.classList.add('-translate-x-full');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('-translate-x-full');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('-translate-x-full');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('-translate-x-full');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Enhanced contact form with validation
  setupContactForm() {
    const form = document.querySelector('#contact form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || '';
      const email = formData.get('email')?.toString().trim() || '';
      const message = formData.get('message')?.toString().trim() || '';
      
      const errors = this.validateForm({ name, email, message });
      
      if (errors.length === 0) {
        this.submitForm(form, { name, email, message });
      } else {
        this.showFormErrors(errors);
      }
    });
  }

  validateForm({ name, email, message }) {
    const errors = [];
    
    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format');
    if (!message) errors.push('Message is required');
    
    return errors;
  }

  showFormErrors(errors) {
    const existingError = document.querySelector('.form-error');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
      <strong>Please fix the following errors:</strong>
      <ul class="list-disc list-inside mt-2">
        ${errors.map(error => `<li>${error}</li>`).join('')}
      </ul>
    `;
    
    const form = document.querySelector('#contact form');
    form?.prepend(errorDiv);
  }

  submitForm(form, data) {
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      this.showSuccessMessage();
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }

  showSuccessMessage() {
    const existingMessages = document.querySelectorAll('.form-error, .form-success');
    existingMessages.forEach(msg => msg.remove());

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
    successDiv.innerHTML = `
      <strong>Success!</strong> Thank you for your message. We'll get back to you soon.
    `;
    
    const form = document.querySelector('#contact form');
    form?.prepend(successDiv);
    
    setTimeout(() => successDiv.remove(), 5000);
  }

  // Dynamic navbar background on scroll
  setupScrollNavbar() {
    let ticking = false;
    
    const updateNavbar = () => {
      const navbar = document.querySelector('header');
      if (!navbar) return;

      if (window.scrollY > 50) {
        navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.add('bg-transparent');
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  // Intersection Observer for animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('animate-fade-in-up');
          observer.unobserve(element);
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
  }

  // Testimonial slider functionality
  setupTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('#slider-nav .dot');
    
    if (!slider || dots.length === 0) return;

    // Initialize slider
    this.showSlide(0);
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.showSlide(index));
    });

    // Auto-advance slider
    this.startSlideshow();
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => this.pauseSlideshow());
    slider.addEventListener('mouseleave', () => this.startSlideshow());
  }

  showSlide(index) {
    const slider = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('#slider-nav .dot');
    
    if (!slider || !dots.length) return;

    slider.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.classList.toggle('bg-orange-500', i === index);
      dot.classList.toggle('opacity-100', i === index);
      dot.classList.toggle('bg-white', i !== index);
      dot.classList.toggle('opacity-50', i !== index);
    });
    
    this.currentSlide = index;
  }

  startSlideshow() {
    this.pauseSlideshow(); // Clear existing interval
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.showSlide(this.currentSlide);
    }, 6000);
  }

  pauseSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteController();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  const controller = window.websiteController;
  if (document.hidden && controller) {
    controller.pauseSlideshow();
  } else if (controller) {
    controller.startSlideshow();
  }
});
