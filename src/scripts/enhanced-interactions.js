// Enhanced Mobile and Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all enhancements
  initMobileMenu();
  initScrollAnimations();
  initSmoothScrolling();
  initFormEnhancements();
  initGoogleMaps();
  initPerformanceOptimizations();
  initAccessibilityFeatures();
});

// Enhanced Mobile Menu with Better Animation
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileMenuItems = document.querySelectorAll('[data-mobile-menu-item]');
  const body = document.body;
  
  if (!mobileMenuToggle || !mobileMenu) return;
  
  let isMenuOpen = false;
  
  mobileMenuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isMenuOpen = !isMenuOpen;
    
    // Toggle menu state
    mobileMenu.classList.toggle('open', isMenuOpen);
    mobileMenuToggle.classList.toggle('open', isMenuOpen);
    body.classList.toggle('menu-open', isMenuOpen);
    
    // Update ARIA attributes
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
    mobileMenu.setAttribute('aria-hidden', !isMenuOpen);
    
    // Animate menu items
    if (isMenuOpen) {
      mobileMenuItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.transform = 'translateX(0)';
          item.style.opacity = '1';
        }, index * 50);
      });
    } else {
      mobileMenuItems.forEach((item) => {
        item.style.transform = 'translateX(-20px)';
        item.style.opacity = '0';
      });
    }
  });
  
  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  });
  
  // Close menu when clicking on menu links
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
  
  function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenuToggle.classList.remove('open');
    body.classList.remove('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    
    mobileMenuItems.forEach((item) => {
      item.style.transform = 'translateX(-20px)';
      item.style.opacity = '0';
    });
  }
}

// Enhanced Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (!animatedElements.length) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Enhanced Smooth Scrolling with Offset
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, href);
    });
  });
}

// Form Enhancements
function initFormEnhancements() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Add floating label effect
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add focus/blur animations
      input.addEventListener('focus', function() {
        this.parentElement?.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement?.classList.remove('focused');
        }
      });
      
      // Validate on input
      input.addEventListener('input', function() {
        validateField(this);
      });
    });
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        handleFormSubmission(this);
      }
    });
  });
}

// Field Validation
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = '';
  
  // Remove existing validation classes
  field.classList.remove('valid', 'invalid');
  
  // Required field check
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'This field is required';
  }
  
  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 10) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  
  // Apply validation styling
  field.classList.add(isValid ? 'valid' : 'invalid');
  
  // Show/hide validation message
  let messageElement = field.parentElement?.querySelector('.validation-message');
  if (!messageElement && !isValid) {
    messageElement = document.createElement('div');
    messageElement.className = 'validation-message text-red-500 text-sm mt-2';
    field.parentElement?.appendChild(messageElement);
  }
  
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.display = isValid ? 'none' : 'block';
  }
  
  return isValid;
}

// Form Validation
function validateForm(form) {
  const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isFormValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });
  
  return isFormValid;
}

// Form Submission Handler
function handleFormSubmission(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent;
  
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  }
  
  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    // Show success message
    showNotification('Message sent successfully! We\'ll contact you within 2 hours.', 'success');
    form.reset();
    
    // Reset form validation states
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.classList.remove('valid', 'invalid', 'focused');
      const message = field.parentElement?.querySelector('.validation-message');
      if (message) message.style.display = 'none';
    });
    
    // Reset submit button
    if (submitButton && originalText) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }, 2000);
}

// Google Maps Integration
function initGoogleMaps() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  // Initialize map when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadGoogleMap();
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(mapElement);
}

function loadGoogleMap() {
  // Replace with actual Google Maps API key and implementation
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  // For now, create a clickable placeholder that opens Google Maps
  mapElement.innerHTML = `
    <div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all duration-300"
         onclick="window.open('https://maps.google.com/?q=123+Construction+Avenue+Builder+City', '_blank')">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
          <i class="fas fa-map-marker-alt text-white text-2xl"></i>
        </div>
        <h5 class="font-bold text-gray-800 mb-2">ProBuild Construction</h5>
        <p class="text-gray-600">123 Construction Avenue</p>
        <p class="text-gray-600 mb-4">Builder City, BC 12345</p>
        <div class="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300">
          <i class="fas fa-directions mr-2"></i>Get Directions
        </div>
      </div>
    </div>
  `;
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  if (images.length) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Preload critical resources
  const criticalLinks = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
  ];
  
  criticalLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Accessibility Enhancements
function initAccessibilityFeatures() {
  // Add skip link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Keyboard navigation for mobile menu
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
  
  // Focus management for modals/menus
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modal = document.querySelector('.mobile-menu.open');
      
      if (modal) {
        const focusables = modal.querySelectorAll(focusableElements);
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];
        
        if (e.shiftKey && document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${
        type === 'success' ? 'fa-check-circle' : 
        type === 'error' ? 'fa-exclamation-circle' : 
        'fa-info-circle'
      } mr-3"></i>
      <span>${message}</span>
      <button class="ml-4 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Utility function for debouncing
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

// Add scroll-based header behavior
window.addEventListener('scroll', debounce(() => {
  const header = document.querySelector('nav');
  if (header) {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}, 10));
