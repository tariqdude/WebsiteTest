// Error handling and validation utilities
export class ErrorHandler {
  static showError(message, container = document.body) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md transform transition-all duration-300';
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle mr-3 text-red-500"></i>
        <div class="flex-1">
          <strong class="font-semibold">Error:</strong>
          <p class="mt-1">${message}</p>
        </div>
        <button class="ml-4 text-red-500 hover:text-red-700 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    container.appendChild(errorDiv);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.transform = 'translateX(100%)';
        setTimeout(() => errorDiv.remove(), 300);
      }
    }, 6000);
    
    return errorDiv;
  }
  
  static showSuccess(message, container = document.body) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md transform transition-all duration-300';
    successDiv.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-3 text-green-500"></i>
        <div class="flex-1">
          <strong class="font-semibold">Success:</strong>
          <p class="mt-1">${message}</p>
        </div>
        <button class="ml-4 text-green-500 hover:text-green-700 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    container.appendChild(successDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => successDiv.remove(), 300);
      }
    }, 5000);
    
    return successDiv;
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
