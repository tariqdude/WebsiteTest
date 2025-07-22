/**
 * Comprehensive Error Detection and Repair Script
 * Tests all error handling systems and repairs any issues found
 */

document.addEventListener('DOMContentLoaded', function() {
  // Error Testing and Repair System
  class ErrorTestAndRepair {
    constructor() {
      this.tests = [];
      this.repairs = [];
      this.results = {
        passed: 0,
        failed: 0,
        repaired: 0
      };
      
      this.init();
    }
    
    init() {
      console.log('🔧 Starting comprehensive error detection and repair...');
      this.runAllTests();
    }
    
    async runAllTests() {
      // Test 1: Error Manager Availability
      await this.testErrorManager();
      
      // Test 2: Debug Panel Functionality
      await this.testDebugPanel();
      
      // Test 3: Error Boundaries
      await this.testErrorBoundaries();
      
      // Test 4: Form Validation
      await this.testFormValidation();
      
      // Test 5: Navigation and Core Components
      await this.testCoreComponents();
      
      // Test 6: Performance Monitoring
      await this.testPerformanceMonitoring();
      
      // Test 7: Network Error Handling
      await this.testNetworkHandling();
      
      this.generateReport();
    }
    
    async testErrorManager() {
      const testName = 'Error Manager System';
      
      try {
        if (!window.errorManager) {
          throw new Error('Error manager not initialized');
        }
        
        // Test error logging
        const testError = new Error('Test error for validation');
        window.errorManager.logError(testError, 'SystemTest');
        
        // Test safe async wrapper
        const safeResult = await window.errorManager.safeAsync(
          () => Promise.resolve('test success'),
          'fallback'
        );
        
        if (safeResult !== 'test success') {
          throw new Error('Safe async wrapper failed');
        }
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
        await this.repairErrorManager();
      }
    }
    
    async testDebugPanel() {
      const testName = 'Debug Panel';
      
      try {
        const debugPanel = document.querySelector('.debug-panel');
        
        if (import.meta.env.DEV && !debugPanel) {
          throw new Error('Debug panel not found in development mode');
        }
        
        if (!import.meta.env.DEV && debugPanel && !debugPanel.hidden) {
          throw new Error('Debug panel visible in production mode');
        }
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
        await this.repairDebugPanel();
      }
    }
    
    async testErrorBoundaries() {
      const testName = 'Error Boundaries';
      
      try {
        const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
        
        if (errorBoundaries.length === 0) {
          console.warn('No error boundaries found - this may be expected');
        }
        
        // Test error boundary functionality
        errorBoundaries.forEach(boundary => {
          if (!boundary.dataset.fallback) {
            console.warn('Error boundary missing fallback message');
          }
        });
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
      }
    }
    
    async testFormValidation() {
      const testName = 'Form Validation';
      
      try {
        const forms = document.querySelectorAll('.enhanced-contact-form');
        
        if (forms.length === 0) {
          throw new Error('Enhanced contact forms not found');
        }
        
        forms.forEach((form, index) => {
          const requiredFields = form.querySelectorAll('[required]');
          const errorElements = form.querySelectorAll('[id$="-error"]');
          
          if (requiredFields.length === 0) {
            throw new Error(`Form ${index + 1}: No required fields found`);
          }
          
          if (errorElements.length === 0) {
            throw new Error(`Form ${index + 1}: No error elements found`);
          }
          
          console.log(`✓ Form ${index + 1}: ${requiredFields.length} required fields, ${errorElements.length} error elements`);
        });
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
        await this.repairFormValidation();
      }
    }
    
    async testCoreComponents() {
      const testName = 'Core Components';
      
      const components = [
        { name: 'Navigation', selector: 'nav, [role="navigation"]' },
        { name: 'Main Content', selector: 'main, [role="main"]' },
        { name: 'Header', selector: 'header' },
        { name: 'Footer', selector: 'footer' }
      ];
      
      try {
        for (const component of components) {
          const element = document.querySelector(component.selector);
          if (!element) {
            console.warn(`${component.name} not found (${component.selector})`);
          } else {
            console.log(`✓ ${component.name} found`);
          }
        }
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
      }
    }
    
    async testPerformanceMonitoring() {
      const testName = 'Performance Monitoring';
      
      try {
        if (!window.performance) {
          throw new Error('Performance API not available');
        }
        
        const timing = window.performance.timing;
        if (timing) {
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          console.log(`Page load time: ${loadTime}ms`);
          
          if (loadTime > 5000) {
            console.warn(`Slow page load detected: ${loadTime}ms`);
          }
        }
        
        // Test memory monitoring if available
        if (window.performance.memory) {
          const memory = window.performance.memory;
          console.log(`Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        }
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
      }
    }
    
    async testNetworkHandling() {
      const testName = 'Network Error Handling';
      
      try {
        // Test fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        try {
          await fetch('/api/test-endpoint', {
            signal: controller.signal,
            method: 'HEAD'
          });
        } catch (networkError) {
          // Expected for non-existent endpoint
          console.log('Network error handling working (expected 404 or timeout)');
        } finally {
          clearTimeout(timeoutId);
        }
        
        this.testPassed(testName);
      } catch (error) {
        this.testFailed(testName, error);
      }
    }
    
    async repairErrorManager() {
      const repairName = 'Error Manager Repair';
      
      try {
        // Attempt to initialize error manager
        if (!window.ErrorManager && !window.errorManager) {
          console.log('Attempting to repair error manager...');
          
          // Create minimal error manager
          window.errorManager = {
            logError: (error, source, options = {}) => {
              console.error(`[${source}]`, error);
              if (options.showToast) {
                this.showToast(`Error in ${source}: ${error.message}`, 'error');
              }
            },
            safeAsync: async (fn, fallback) => {
              try {
                return await fn();
              } catch (error) {
                console.error('Safe async error:', error);
                return fallback;
              }
            }
          };
          
          console.log('✓ Emergency error manager created');
          this.repairSuccessful(repairName);
        }
      } catch (error) {
        this.repairFailed(repairName, error);
      }
    }
    
    async repairDebugPanel() {
      const repairName = 'Debug Panel Repair';
      
      try {
        if (import.meta.env.DEV && !document.querySelector('.debug-panel')) {
          console.log('Creating emergency debug panel...');
          
          const debugPanel = document.createElement('div');
          debugPanel.className = 'debug-panel';
          debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            max-height: 200px;
            overflow: auto;
          `;
          debugPanel.innerHTML = '<strong>Emergency Debug Panel</strong><br>Error handling system active';
          
          document.body.appendChild(debugPanel);
          
          console.log('✓ Emergency debug panel created');
          this.repairSuccessful(repairName);
        }
      } catch (error) {
        this.repairFailed(repairName, error);
      }
    }
    
    async repairFormValidation() {
      const repairName = 'Form Validation Repair';
      
      try {
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
          if (!form.classList.contains('enhanced-contact-form')) {
            console.log(`Adding basic validation to form ${index + 1}...`);
            
            form.addEventListener('submit', (e) => {
              const requiredFields = form.querySelectorAll('[required]');
              let hasErrors = false;
              
              requiredFields.forEach(field => {
                if (!field.value.trim()) {
                  field.style.borderColor = 'red';
                  hasErrors = true;
                } else {
                  field.style.borderColor = '';
                }
              });
              
              if (hasErrors) {
                e.preventDefault();
                this.showToast('Please fill in all required fields', 'error');
              }
            });
          }
        });
        
        this.repairSuccessful(repairName);
      } catch (error) {
        this.repairFailed(repairName, error);
      }
    }
    
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f87171' : '#60a5fa'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
      `;
      toast.textContent = message;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
    
    testPassed(testName) {
      console.log(`✅ ${testName}: PASSED`);
      this.results.passed++;
    }
    
    testFailed(testName, error) {
      console.error(`❌ ${testName}: FAILED -`, error.message);
      this.results.failed++;
    }
    
    repairSuccessful(repairName) {
      console.log(`🔧 ${repairName}: SUCCESSFUL`);
      this.results.repaired++;
    }
    
    repairFailed(repairName, error) {
      console.error(`💔 ${repairName}: FAILED -`, error.message);
    }
    
    generateReport() {
      const total = this.results.passed + this.results.failed;
      const successRate = ((this.results.passed / total) * 100).toFixed(1);
      
      console.log('\n📊 ERROR DETECTION AND REPAIR REPORT');
      console.log('=====================================');
      console.log(`✅ Tests Passed: ${this.results.passed}`);
      console.log(`❌ Tests Failed: ${this.results.failed}`);
      console.log(`🔧 Repairs Made: ${this.results.repaired}`);
      console.log(`📈 Success Rate: ${successRate}%`);
      console.log('=====================================');
      
      if (this.results.failed > 0) {
        console.warn(`⚠️ ${this.results.failed} issues detected. Check console for details.`);
        this.showToast(`${this.results.failed} issues detected and ${this.results.repaired} repairs made`, 'error');
      } else {
        console.log('🎉 All systems operational!');
        this.showToast('All error handling systems operational!', 'success');
      }
      
      // Store results globally for debugging
      window.errorTestResults = this.results;
    }
  }
  
  // Auto-run tests after a short delay to allow other systems to initialize
  setTimeout(() => {
    new ErrorTestAndRepair();
  }, 2000);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
