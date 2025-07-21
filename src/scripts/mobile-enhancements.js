/**
 * Mobile Experience Enhancements
 */

class MobileEnhancements {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isTouch = 'ontouchstart' in window;
    this.viewport = this.getViewport();
    
    if (this.isMobile || this.isTouch) {
      this.init();
    }
  }

  init() {
    this.setupTouchGestures();
    this.setupMobileNavigation();
    this.setupMobileFormOptimizations();
    this.setupTouchFeedback();
    this.setupMobileSpecificStyles();
    this.setupViewportHandler();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  setupTouchGestures() {
    let startX, startY, startTime;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Swipe detection
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    }, { passive: true });
  }

  handleSwipeRight() {
    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      this.closeMobileMenu();
    }
  }

  handleSwipeLeft() {
    // Open mobile menu if closed
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('open')) {
      this.openMobileMenu();
    }
  }

  setupMobileNavigation() {
    // Mobile menu toggle
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Close menu on nav link click
      const navLinks = mobileMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    if (mobileMenu) {
      const isOpen = mobileMenu.classList.contains('open');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      document.body.classList.add('menu-open');
      
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'true');
      }
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
      }
    }
  }

  setupMobileFormOptimizations() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        // Add mobile-specific attributes
        if (input.type === 'email') {
          input.setAttribute('autocomplete', 'email');
          input.setAttribute('inputmode', 'email');
        }
        
        if (input.type === 'tel') {
          input.setAttribute('autocomplete', 'tel');
          input.setAttribute('inputmode', 'tel');
        }
        
        if (input.name && input.name.includes('name')) {
          input.setAttribute('autocomplete', input.name);
          input.setAttribute('inputmode', 'text');
        }

        // Handle viewport changes on focus (iOS)
        input.addEventListener('focus', () => {
          if (this.isIOS()) {
            setTimeout(() => {
              input.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }, 300);
          }
        });
      });
    });
  }

  setupTouchFeedback() {
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    const links = document.querySelectorAll('a');
    
    [...buttons, ...links].forEach(element => {
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });

      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });

      element.addEventListener('touchcancel', () => {
        element.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  setupMobileSpecificStyles() {
    // Add mobile-specific CSS classes
    document.documentElement.classList.add(
      this.isMobile ? 'mobile' : 'desktop',
      this.isTouch ? 'touch' : 'no-touch'
    );

    // Add device-specific classes
    if (this.isIOS()) {
      document.documentElement.classList.add('ios');
    }
    
    if (this.isAndroid()) {
      document.documentElement.classList.add('android');
    }
  }

  setupViewportHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        this.viewport = this.getViewport();
        this.handleViewportChange();
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.viewport = this.getViewport();
        this.handleOrientationChange();
      }, 100);
    });
  }

  handleViewportChange() {
    // Update mobile detection based on new viewport
    const wasMobile = this.isMobile;
    this.isMobile = this.detectMobile();
    
    if (wasMobile !== this.isMobile) {
      // Device type changed, reinitialize
      this.setupMobileSpecificStyles();
    }
  }

  handleOrientationChange() {
    // Close mobile menu on orientation change
    this.closeMobileMenu();
    
    // Recalculate scroll positions for smooth scroll
    if (window.smoothNav) {
      window.smoothNav.setupSections();
    }
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  // Utility methods for other components
  isMobileDevice() {
    return this.isMobile;
  }

  isTouchDevice() {
    return this.isTouch;
  }

  getViewportSize() {
    return this.viewport;
  }
}

// Initialize mobile enhancements
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileEnhancements = new MobileEnhancements();
  });
}

// For module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileEnhancements;
}
