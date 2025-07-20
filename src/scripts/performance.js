/**
 * Performance monitoring and optimization utilities
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = 'performance' in window && window.performance.mark;
    
    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  initializeMonitoring() {
    // Mark the start of our monitoring
    this.mark('monitoring-start');

    // Monitor Core Web Vitals
    this.monitorWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor navigation timing
    this.monitorNavigationTiming();
  }

  mark(name) {
    if (this.isEnabled) {
      window.performance.mark(name);
    }
  }

  measure(name, startMark, endMark = undefined) {
    if (this.isEnabled) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        this.metrics.set(name, measure.duration);
        return measure.duration;
      } catch (error) {
        console.warn(`Performance measurement failed for ${name}:`, error);
        return null;
      }
    }
    return null;
  }

  monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              this.metrics.set('lcp', entry.startTime);
              
              // Send to analytics if LCP is poor (> 2.5s)
              if (entry.startTime > 2500) {
                this.reportMetric('lcp_poor', entry.startTime);
              }
            }
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        console.warn('LCP monitoring failed:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.set('fid', entry.processingStart - entry.startTime);
            
            // Send to analytics if FID is poor (> 100ms)
            if (entry.processingStart - entry.startTime > 100) {
              this.reportMetric('fid_poor', entry.processingStart - entry.startTime);
            }
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        console.warn('FID monitoring failed:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.set('cls', clsValue);
          
          // Send to analytics if CLS is poor (> 0.1)
          if (clsValue > 0.1) {
            this.reportMetric('cls_poor', clsValue);
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        console.warn('CLS monitoring failed:', error);
      }
    }
  }

  monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Monitor slow resources (> 3s)
            if (entry.duration > 3000) {
              this.reportMetric('slow_resource', {
                name: entry.name,
                duration: entry.duration,
                type: entry.initiatorType
              });
            }
          }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource monitoring failed:', error);
      }
    }
  }

  monitorNavigationTiming() {
    if (this.isEnabled) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = window.performance.getEntriesByType('navigation')[0];
          if (navigation) {
            this.metrics.set('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            this.metrics.set('load_complete', navigation.loadEventEnd - navigation.loadEventStart);
            this.metrics.set('first_byte', navigation.responseStart - navigation.requestStart);
            
            // Report slow navigation (> 5s)
            const totalTime = navigation.loadEventEnd - navigation.navigationStart;
            if (totalTime > 5000) {
              this.reportMetric('slow_navigation', totalTime);
            }
          }
        }, 0);
      });
    }
  }

  reportMetric(name, value) {
    // Send to analytics
    if (window.analytics && typeof window.analytics.trackEvent === 'function') {
      window.analytics.trackEvent('Performance', name, value);
    }
    
    // Log for debugging in development
    if (import.meta.env.DEV) {
      console.log(`Performance metric - ${name}:`, value);
    }
  }

  getMetrics() {
    return new Map(this.metrics);
  }

  getMetric(name) {
    return this.metrics.get(name);
  }

  cleanup() {
    // Disconnect all observers
    for (const [name, observer] of this.observers) {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn(`Failed to disconnect observer ${name}:`, error);
      }
    }
    this.observers.clear();
  }

  // Memory usage monitoring (if available)
  getMemoryUsage() {
    if ('memory' in window.performance) {
      return {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        limit: window.performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Check if performance is degraded
  isPerformanceDegraded() {
    const lcp = this.getMetric('lcp');
    const fid = this.getMetric('fid');
    const cls = this.getMetric('cls');
    
    return (lcp && lcp > 2500) || 
           (fid && fid > 100) || 
           (cls && cls > 0.1);
  }
}

// Create and export a singleton instance
export const performanceMonitor = new PerformanceMonitor();
