// Analytics and tracking utilities
export class AnalyticsTracker {
  constructor() {
    this.isGALoaded = typeof gtag !== 'undefined';
    this.isClarityLoaded = typeof clarity !== 'undefined';
    this.events = [];
    this.setupEventTracking();
  }

  // Core tracking methods
  trackEvent(eventName, parameters = {}) {
    const event = {
      name: eventName,
      parameters: {
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
        ...parameters
      }
    };

    // Store event for offline tracking
    this.events.push(event);

    // Send to Google Analytics
    if (this.isGALoaded) {
      gtag('event', eventName, event.parameters);
    }

    // Send to Microsoft Clarity
    if (this.isClarityLoaded) {
      clarity('event', eventName);
    }

    console.log('Analytics Event:', event);
  }

  // Business-specific tracking methods
  trackFormSubmission(formType, success = true, details = {}) {
    this.trackEvent('form_submission', {
      form_type: formType,
      success: success,
      event_category: 'lead_generation',
      ...details
    });
  }

  trackPhoneCall(location = 'unknown') {
    this.trackEvent('phone_call_intent', {
      contact_method: 'phone',
      location: location,
      event_category: 'contact',
      value: 1
    });
  }

  trackEmailClick(location = 'unknown') {
    this.trackEvent('email_click', {
      contact_method: 'email',
      location: location,
      event_category: 'contact'
    });
  }

  trackServiceInterest(serviceName, action = 'view') {
    this.trackEvent('service_interest', {
      service_name: serviceName,
      action: action,
      event_category: 'services'
    });
  }

  trackScrollDepth(depth) {
    // Only track significant scroll milestones
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(depth)) {
      this.trackEvent('scroll_depth', {
        scroll_depth: depth,
        event_category: 'engagement'
      });
    }
  }

  trackTimeOnPage() {
    const startTime = performance.now();
    
    const trackSession = () => {
      const timeSpent = Math.round((performance.now() - startTime) / 1000);
      
      // Track engagement milestones
      if (timeSpent === 30 || timeSpent === 60 || timeSpent === 120) {
        this.trackEvent('time_engagement', {
          time_spent: timeSpent,
          event_category: 'engagement'
        });
      }
    };

    // Track time spent periodically
    setInterval(trackSession, 30000);
    
    // Track when leaving page
    window.addEventListener('beforeunload', trackSession);
  }

  trackError(errorType, errorMessage, location = '') {
    this.trackEvent('javascript_error', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Limit length
      location: location,
      event_category: 'errors'
    });
  }

  trackPerformance() {
    // Track Core Web Vitals
    if ('web-vital' in window) return;

    window.addEventListener('load', () => {
      // Track load time
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      this.trackEvent('page_load_time', {
        load_time: Math.round(loadTime),
        event_category: 'performance'
      });

      // Track largest contentful paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.trackEvent('largest_contentful_paint', {
          lcp_time: Math.round(lastEntry.startTime),
          event_category: 'performance'
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track cumulative layout shift
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        
        entryList.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.trackEvent('cumulative_layout_shift', {
          cls_value: Math.round(clsValue * 1000) / 1000,
          event_category: 'performance'
        });
      }).observe({ entryTypes: ['layout-shift'] });
    });
  }

  setupEventTracking() {
    // Auto-track common events
    this.setupScrollTracking();
    this.setupLinkTracking();
    this.setupFormTracking();
    this.setupErrorTracking();
    this.trackTimeOnPage();
    this.trackPerformance();
  }

  setupScrollTracking() {
    let scrollDepthTracked = new Set();
    let ticking = false;

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
          this.trackScrollDepth(milestone);
          scrollDepthTracked.add(milestone);
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(trackScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  setupLinkTracking() {
    // Track external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Track phone links
      if (href.startsWith('tel:')) {
        this.trackPhoneCall(this.getLinkLocation(link));
        return;
      }

      // Track email links
      if (href.startsWith('mailto:')) {
        this.trackEmailClick(this.getLinkLocation(link));
        return;
      }

      // Track external links
      if (this.isExternalLink(href)) {
        this.trackEvent('external_link_click', {
          link_url: href,
          link_text: link.textContent.trim().substring(0, 50),
          event_category: 'outbound'
        });
      }

      // Track internal navigation
      if (href.startsWith('#')) {
        this.trackEvent('internal_navigation', {
          section: href.substring(1),
          event_category: 'navigation'
        });
      }
    });
  }

  setupFormTracking() {
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form');
      if (!form) return;

      const formName = form.getAttribute('name') || 'unknown_form';
      
      // Track form start (if not already tracked)
      this.trackEvent('form_start', {
        form_name: formName,
        event_category: 'lead_generation'
      });
    });

    // Track form field interactions
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        const form = e.target.closest('form');
        const formName = form?.getAttribute('name') || 'unknown_form';
        
        this.trackEvent('form_field_focus', {
          form_name: formName,
          field_name: e.target.name || e.target.id,
          event_category: 'form_interaction'
        });
      }
    }, true);
  }

  setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackError('javascript', e.message, e.filename);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError('promise_rejection', e.reason.toString());
    });
  }

  getLinkLocation(link) {
    // Determine where the link is located on the page
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (header?.contains(link)) return 'header';
    if (footer?.contains(link)) return 'footer';
    
    // Check sections
    const section = link.closest('section');
    if (section) {
      return section.id || 'content';
    }
    
    return 'unknown';
  }

  isExternalLink(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  // Heatmap and user behavior tracking
  trackUserBehavior() {
    // Track mouse movement patterns (throttled)
    let mouseTrackingEnabled = false;
    let mouseMovements = [];
    
    const startMouseTracking = () => {
      if (mouseTrackingEnabled) return;
      mouseTrackingEnabled = true;
      
      const trackMouse = (e) => {
        mouseMovements.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
        
        // Limit stored movements
        if (mouseMovements.length > 100) {
          mouseMovements = mouseMovements.slice(-50);
        }
      };
      
      document.addEventListener('mousemove', trackMouse, { passive: true });
      
      // Stop tracking after 30 seconds
      setTimeout(() => {
        document.removeEventListener('mousemove', trackMouse);
        mouseTrackingEnabled = false;
      }, 30000);
    };
    
    // Start tracking on first interaction
    document.addEventListener('click', startMouseTracking, { once: true });
  }

  // Privacy-compliant tracking
  respectPrivacy() {
    // Check for Do Not Track
    if (navigator.doNotTrack === '1') {
      console.log('Analytics: User has Do Not Track enabled, limiting tracking');
      return false;
    }
    
    // Check for reduced data preferences
    if (navigator.connection?.saveData) {
      console.log('Analytics: User has data saver enabled, limiting tracking');
      return false;
    }
    
    return true;
  }

  // Export data for analysis
  exportData() {
    return {
      events: this.events,
      session: {
        start_time: this.sessionStart,
        page_views: this.pageViews,
        user_agent: navigator.userAgent,
        screen_size: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      }
    };
  }
}

// Initialize analytics
const analytics = new AnalyticsTracker();

// Export for global use
window.analytics = analytics;
export default AnalyticsTracker;
