/**
 * Form Validation and Submission Handler
 */

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.errors = {};
    this.isSubmitting = false;
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const { name, value, type, required } = field;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearFieldError(field);

    // Required field validation
    if (required && !value.trim()) {
      errorMessage = 'This field is required';
      isValid = false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        errorMessage = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    // Name validation (no numbers or special chars except hyphens and apostrophes)
    if ((name === 'first-name' || name === 'last-name') && value) {
      const nameRegex = /^[a-zA-Z\s\-']+$/;
      if (!nameRegex.test(value)) {
        errorMessage = 'Please enter a valid name';
        isValid = false;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
      this.errors[name] = errorMessage;
    } else {
      delete this.errors[name];
    }

    return isValid;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  showFieldError(field, message) {
    field.classList.add('border-red-500', 'focus:ring-red-500');
    field.classList.remove('border-gray-300', 'focus:ring-brand-primary');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove('border-red-500', 'focus:ring-red-500');
    field.classList.add('border-gray-300', 'focus:ring-brand-primary');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  showSubmissionState(isSubmitting) {
    const button = this.form.querySelector('button[type="submit"]');
    if (!button) return;
    
    const buttonText = button.querySelector('.button-text') || button;
    let spinner = button.querySelector('.spinner');

    if (isSubmitting) {
      button.disabled = true;
      button.classList.add('opacity-75', 'cursor-not-allowed');
      
      if (!spinner) {
        const spinnerEl = document.createElement('div');
        spinnerEl.className = 'spinner animate-spin -ml-1 mr-2 h-4 w-4 text-white';
        spinnerEl.innerHTML = '<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        button.insertBefore(spinnerEl, buttonText);
      }
      
      buttonText.textContent = 'Sending...';
    } else {
      button.disabled = false;
      button.classList.remove('opacity-75', 'cursor-not-allowed');
      
      spinner = button.querySelector('.spinner');
      if (spinner) {
        spinner.remove();
      }
      
      buttonText.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
    }
  }

  showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.form-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `form-toast fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`;
    
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    if (!this.validateForm()) {
      this.showToast('Please fix the errors below', 'error');
      return;
    }

    this.isSubmitting = true;
    this.showSubmissionState(true);

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      // Simulate API call (replace with actual endpoint)
      const response = await this.submitForm(data);

      if (response.ok) {
        this.showToast('Thank you! Your message has been sent successfully.');
        this.form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.showSubmissionState(false);
    }
  }

  async submitForm(data) {
    // Replace this with your actual form submission logic
    console.log('Form data:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful submission (replace with actual logic)
    return { ok: true };
  }
}

// Initialize form validation when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('#contact-form');
  });
}

// For module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}
