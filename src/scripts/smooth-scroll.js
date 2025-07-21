/**
 * Smooth Scroll Navigation with Active States
 */

class SmoothScrollNav {
  constructor() {
    this.sections = [];
    this.navLinks = [];
    this.currentSection = '';
    this.isScrolling = false;
    this.scrollOffset = 80; // Offset for fixed header
    
    this.init();
  }

  init() {
    this.setupSections();
    this.setupNavigation();
    this.setupScrollHandler();
    this.setupClickHandlers();
    this.updateActiveSection();
  }

  setupSections() {
    // Find all sections with IDs
    this.sections = Array.from(document.querySelectorAll('section[id]')).map(section => ({
      id: section.id,
      element: section,
      offset: section.offsetTop - this.scrollOffset,
      height: section.offsetHeight
    }));
  }

  setupNavigation() {
    // Find all navigation links
    this.navLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(link => {
      const href = link.getAttribute('href');
      return href !== '#' && this.sections.some(section => `#${section.id}` === href);
    });
  }

  setupScrollHandler() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking && !this.isScrolling) {
        requestAnimationFrame(() => {
          this.updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Update section offsets on resize
    window.addEventListener('resize', this.debounce(() => {
      this.setupSections();
    }, 250));
  }

  setupClickHandlers() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  scrollToSection(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return;

    this.isScrolling = true;
    
    // Smooth scroll to section
    window.scrollTo({
      top: section.offset,
      behavior: 'smooth'
    });

    // Update active state immediately
    this.setActiveSection(sectionId);

    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  updateActiveSection() {
    const scrollPosition = window.pageYOffset;
    let activeSection = this.sections[0]?.id || '';

    // Find the current section based on scroll position
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (scrollPosition >= section.offset) {
        activeSection = section.id;
        break;
      }
    }

    // Update active section if changed
    if (activeSection !== this.currentSection) {
      this.setActiveSection(activeSection);
    }
  }

  setActiveSection(sectionId) {
    this.currentSection = sectionId;

    // Update navigation links
    this.navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      
      link.classList.toggle('active', isActive);
      
      // Add visual indicator
      if (isActive) {
        link.classList.add('text-brand-primary-600', 'font-semibold');
        link.classList.remove('text-gray-700', 'dark:text-gray-300');
      } else {
        link.classList.remove('text-brand-primary-600', 'font-semibold');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
      }
    });

    // Update progress indicator if it exists
    this.updateScrollProgress();
  }

  updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    
    progressBar.style.transform = `scaleX(${Math.min(progress / 100, 1)})`;
  }

  // Utility function for debouncing
  debounce(func, wait) {
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

  // Add scroll spy animation for elements
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach(element => {
      element.classList.add('opacity-0', 'translate-y-8');
      observer.observe(element);
    });
  }

  // Initialize scroll animations
  initAnimations() {
    this.setupScrollAnimations();
  }
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const smoothNav = new SmoothScrollNav();
    smoothNav.initAnimations();
  });
}

// For module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmoothScrollNav;
}
