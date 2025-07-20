// Enhanced error handling and validation utilities
export class ErrorHandler {
  static notificationQueue = [];
  static maxNotifications = 3;

  static showError(message, container = document.body) {
    return this.showNotification(message, 'error', container);
  }
  
  static showSuccess(message, container = document.body) {
    return this.showNotification(message, 'success', container);
  }

  static showNotification(message, type = 'info', container = document.body) {
    // Prevent notification spam
    if (this.notificationQueue.length >= this.maxNotifications) {
      const oldest = this.notificationQueue.shift();
      if (oldest && oldest.parentNode) {
        oldest.remove();
      }
    }

    const typeConfig = {
      error: {
        icon: 'fas fa-exclamation-triangle',
        bgClass: 'bg-error-50 border-error-200 text-error-700',
        iconClass: 'text-error-500',
        buttonClass: 'text-error-500 hover:text-error-700'
      },
      success: {
        icon: 'fas fa-check-circle',
        bgClass: 'bg-success-50 border-success-200 text-success-700',
        iconClass: 'text-success-500',
        buttonClass: 'text-success-500 hover:text-success-700'
      },
      info: {
        icon: 'fas fa-info-circle',
        bgClass: 'bg-primary-50 border-primary-200 text-primary-700',
        iconClass: 'text-primary-500',
        buttonClass: 'text-primary-500 hover:text-primary-700'
      }
    };

    const config = typeConfig[type] || typeConfig.info;
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed top-4 right-4 ${config.bgClass} border px-4 py-3 rounded-lg shadow-lg z-50 max-w-md transform transition-all duration-300 animate-fade-in-down`;
    
    // Use document.createDocumentFragment() for better performance
    const fragment = document.createDocumentFragment();
    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex items-center';
    
    flexContainer.innerHTML = `
      <i class="${config.icon} mr-3 ${config.iconClass}"></i>
      <div class="flex-1">
        <strong class="font-semibold capitalize">${type}:</strong>
        <p class="mt-1">${message}</p>
      </div>
      <button class="ml-4 ${config.buttonClass} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const closeButton = flexContainer.querySelector('button');
    closeButton.addEventListener('click', () => this.removeNotification(notificationDiv));
    
    notificationDiv.appendChild(flexContainer);
    container.appendChild(notificationDiv);
    this.notificationQueue.push(notificationDiv);
    
    // Auto-remove with different timeouts based on type
    const timeout = type === 'error' ? 8000 : 5000;
    setTimeout(() => this.removeNotification(notificationDiv), timeout);
    
    return notificationDiv;
  }

  static removeNotification(element) {
    if (element && element.parentNode) {
      element.style.transform = 'translateX(100%)';
      element.style.opacity = '0';
      setTimeout(() => {
        if (element.parentNode) {
          element.remove();
          const index = this.notificationQueue.indexOf(element);
          if (index > -1) {
            this.notificationQueue.splice(index, 1);
          }
        }
      }, 300);
    }
  }
  
  static showLoading(container, message = 'Loading...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-40 rounded-lg';
    loadingDiv.innerHTML = `
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-600 font-medium">${message}</p>
    `;
    
    container.style.position = 'relative';
    container.appendChild(loadingDiv);
    
    return loadingDiv;
  }
  
  static hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.style.opacity = '0';
      setTimeout(() => loadingElement.remove(), 300);
    }
  }
  
  // Network error handling
  static handleNetworkError(error) {
    console.error('Network Error:', error);
    
    if (!navigator.onLine) {
      this.showError('You appear to be offline. Please check your internet connection and try again.');
    } else if (error.name === 'AbortError') {
      this.showError('Request was cancelled. Please try again.');
    } else if (error.message.includes('fetch')) {
      this.showError('Unable to connect to the server. Please check your connection and try again.');
    } else {
      this.showError('An unexpected error occurred. Please try again or contact support.');
    }
  }
  
  // Form validation utilities
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  static validatePhone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/\D/g, ''));
  }
  
  static validateRequired(value) {
    return value && value.toString().trim().length > 0;
  }
  
  // Field-specific validation with visual feedback
  static validateField(field, rules = []) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous states
    field.classList.remove('border-red-500', 'border-green-500', 'bg-red-50', 'bg-green-50');
    
    // Remove existing error messages
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Apply validation rules
    for (const rule of rules) {
      if (!rule.test(value)) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
    }
    
    if (!isValid) {
      field.classList.add('border-red-500', 'bg-red-50');
      
      // Add error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-red-600 text-sm mt-1 flex items-center';
      errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${errorMessage}`;
      field.parentNode.appendChild(errorDiv);
    } else if (value) {
      field.classList.add('border-green-500', 'bg-green-50');
    }
    
    return isValid;
  }
}

// Enhanced form validation rules
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    test: (value) => ErrorHandler.validateRequired(value),
    message
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    test: (value) => !value || ErrorHandler.validateEmail(value),
    message
  }),
  
  phone: (message = 'Please enter a valid phone number') => ({
    test: (value) => !value || ErrorHandler.validatePhone(value),
    message
  }),
  
  minLength: (min, message) => ({
    test: (value) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max, message) => ({
    test: (value) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`
  })
};
