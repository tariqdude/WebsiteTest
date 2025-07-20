// Main application entry point
import { WebsiteController } from './websiteController.js';
import { ErrorHandler } from './errorHandler.js';
import { Analytics } from './analytics.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize error handler first
    const errorHandler = new ErrorHandler();
    
    // Initialize analytics
    const analytics = new Analytics();
    
    // Initialize main website controller
    const websiteController = new WebsiteController();
    await websiteController.init();
    
    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Fallback error handling
    const errorEvent = new CustomEvent('app:error', {
      detail: { error, context: 'Application initialization' }
    });
    document.dispatchEvent(errorEvent);
  }
});

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Export for potential external use
export { WebsiteController, ErrorHandler, Analytics };
