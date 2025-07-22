/**
 * Advanced Validation System
 * Provides bulletproof form validation with detailed error reporting
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  field?: string;
}

export interface FieldValidation extends ValidationResult {
  field: string;
  value: any;
  sanitizedValue?: any;
}

export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();
  private customMessages: Map<string, string> = new Map();

  /**
   * Add validation rules for a field
   */
  addField(fieldName: string, rules: ValidationRule[]): void {
    this.rules.set(fieldName, rules);
  }

  /**
   * Set custom error message for a field
   */
  setMessage(fieldName: string, message: string): void {
    this.customMessages.set(fieldName, message);
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: any): FieldValidation {
    const rules = this.rules.get(fieldName) || [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    // Basic sanitization
    if (typeof value === 'string') {
      sanitizedValue = value.trim();
    }

    // Apply validation rules
    for (const rule of rules) {
      const error = this.applyRule(fieldName, sanitizedValue, rule);
      if (error) {
        errors.push(error);
      }
    }

    // Add warnings for common issues
    if (typeof sanitizedValue === 'string') {
      if (sanitizedValue !== value) {
        warnings.push('Leading/trailing spaces were removed');
      }
      
      if (sanitizedValue.length > 0 && sanitizedValue === sanitizedValue.toLowerCase() && /[a-zA-Z]/.test(sanitizedValue)) {
        warnings.push('Consider proper capitalization');
      }
    }

    return {
      field: fieldName,
      value,
      sanitizedValue,
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate entire form
   */
  validateForm(formData: FormData | Record<string, any>): ValidationResult & { fields: FieldValidation[] } {
    const data = formData instanceof FormData ? this.formDataToObject(formData) : formData;
    const fieldResults: FieldValidation[] = [];
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validate each field with rules
    for (const [fieldName] of this.rules) {
      const fieldResult = this.validateField(fieldName, data[fieldName]);
      fieldResults.push(fieldResult);
      allErrors.push(...fieldResult.errors);
      allWarnings.push(...fieldResult.warnings);
    }

    // Cross-field validation
    const crossFieldErrors = this.validateCrossField(data);
    allErrors.push(...crossFieldErrors);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      fields: fieldResults
    };
  }

  /**
   * Apply a single validation rule
   */
  private applyRule(fieldName: string, value: any, rule: ValidationRule): string | null {
    const customMessage = this.customMessages.get(fieldName);

    // Required validation
    if (rule.required && this.isEmpty(value)) {
      return customMessage || rule.message || `${this.fieldDisplayName(fieldName)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value)) {
      return null;
    }

    // String-based validations
    if (typeof value === 'string') {
      // Minimum length
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${this.fieldDisplayName(fieldName)} must be at least ${rule.minLength} characters`;
      }

      // Maximum length
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${this.fieldDisplayName(fieldName)} must not exceed ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${this.fieldDisplayName(fieldName)} format is invalid`;
      }

      // Email validation
      if (rule.email && !this.isValidEmail(value)) {
        return rule.message || `${this.fieldDisplayName(fieldName)} must be a valid email address`;
      }

      // Phone validation
      if (rule.phone && !this.isValidPhone(value)) {
        return rule.message || `${this.fieldDisplayName(fieldName)} must be a valid phone number`;
      }

      // URL validation
      if (rule.url && !this.isValidUrl(value)) {
        return rule.message || `${this.fieldDisplayName(fieldName)} must be a valid URL`;
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  /**
   * Cross-field validation (e.g., password confirmation)
   */
  private validateCrossField(data: Record<string, any>): string[] {
    const errors: string[] = [];

    // Password confirmation
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errors.push('Password confirmation does not match');
    }

    // Date range validation
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) {
        errors.push('End date must be after start date');
      }
    }

    return errors;
  }

  /**
   * Check if value is empty
   */
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Convert field name to display name
   */
  private fieldDisplayName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation (flexible format)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)\.]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * URL validation
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert FormData to plain object
   */
  private formDataToObject(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

/**
 * Pre-configured validators for common use cases
 */
export const CommonValidators = {
  /**
   * Contact form validator
   */
  contactForm(): FormValidator {
    const validator = new FormValidator();
    
    validator.addField('firstName', [
      { required: true, minLength: 2, maxLength: 50 }
    ]);
    
    validator.addField('lastName', [
      { required: true, minLength: 2, maxLength: 50 }
    ]);
    
    validator.addField('email', [
      { required: true, email: true, maxLength: 254 }
    ]);
    
    validator.addField('phone', [
      { phone: true }
    ]);
    
    validator.addField('message', [
      { required: true, minLength: 10, maxLength: 1000 }
    ]);

    return validator;
  },

  /**
   * Newsletter signup validator
   */
  newsletter(): FormValidator {
    const validator = new FormValidator();
    
    validator.addField('email', [
      { required: true, email: true, maxLength: 254 }
    ]);
    
    validator.addField('name', [
      { minLength: 2, maxLength: 100 }
    ]);

    return validator;
  },

  /**
   * User registration validator
   */
  registration(): FormValidator {
    const validator = new FormValidator();
    
    validator.addField('username', [
      { required: true, minLength: 3, maxLength: 20, pattern: /^[a-zA-Z0-9_]+$/ }
    ]);
    
    validator.addField('email', [
      { required: true, email: true, maxLength: 254 }
    ]);
    
    validator.addField('password', [
      { required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ }
    ]);
    
    validator.addField('confirmPassword', [
      { required: true }
    ]);

    return validator;
  }
};

/**
 * Real-time validation helper for forms
 */
export class RealTimeValidator {
  private validator: FormValidator;
  private form: HTMLFormElement;
  private debounceMs: number;
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(form: HTMLFormElement, validator: FormValidator, debounceMs = 300) {
    this.form = form;
    this.validator = validator;
    this.debounceMs = debounceMs;
    this.initialize();
  }

  private initialize(): void {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      const fieldName = (input as HTMLInputElement).name;
      if (!fieldName) return;

      // Real-time validation on input
      input.addEventListener('input', () => {
        this.debounceValidation(fieldName);
      });

      // Immediate validation on blur
      input.addEventListener('blur', () => {
        this.validateFieldImmediate(fieldName);
      });
    });

    // Form submission validation
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateFormSubmission();
    });
  }

  private debounceValidation(fieldName: string): void {
    const existingTimer = this.debounceTimers.get(fieldName);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.validateFieldImmediate(fieldName);
    }, this.debounceMs);

    this.debounceTimers.set(fieldName, timer);
  }

  private validateFieldImmediate(fieldName: string): void {
    const formData = new FormData(this.form);
    const result = this.validator.validateField(fieldName, formData.get(fieldName));
    this.displayFieldValidation(result);
  }

  private validateFormSubmission(): void {
    const formData = new FormData(this.form);
    const result = this.validator.validateForm(formData);
    
    // Display all field errors
    result.fields.forEach(fieldResult => {
      this.displayFieldValidation(fieldResult);
    });

    // Show summary if there are errors
    if (!result.isValid) {
      this.showValidationSummary(result);
    } else {
      this.handleValidForm(formData);
    }
  }

  private displayFieldValidation(result: FieldValidation): void {
    const field = this.form.querySelector(`[name="${result.field}"]`) as HTMLElement;
    if (!field) return;

    const fieldGroup = field.closest('.form-group') || field.parentElement;
    const errorContainer = fieldGroup?.querySelector('.field-error') || this.createErrorContainer(field);

    // Update field styling
    field.classList.toggle('border-red-500', !result.isValid);
    field.classList.toggle('border-green-500', result.isValid && result.value);

    // Update error messages
    if (errorContainer) {
      if (result.errors.length > 0) {
        errorContainer.textContent = result.errors[0];
        errorContainer.classList.remove('hidden');
      } else {
        errorContainer.classList.add('hidden');
      }
    }
  }

  private createErrorContainer(field: HTMLElement): HTMLElement {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-600 text-sm mt-1 hidden';
    field.parentElement?.appendChild(errorDiv);
    return errorDiv;
  }

  private showValidationSummary(result: ValidationResult): void {
    // Remove existing summary
    const existingSummary = this.form.querySelector('.validation-summary');
    existingSummary?.remove();

    // Create summary
    const summary = document.createElement('div');
    summary.className = 'validation-summary bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4';
    summary.innerHTML = `
      <div class="flex items-center mb-2">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <strong>Please correct the following errors:</strong>
      </div>
      <ul class="list-disc list-inside text-sm space-y-1">
        ${result.errors.map(error => `<li>${error}</li>`).join('')}
      </ul>
    `;

    this.form.insertBefore(summary, this.form.firstChild);
    summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private handleValidForm(formData: FormData): void {
    // Emit custom event for successful validation
    this.form.dispatchEvent(new CustomEvent('form-validated', {
      detail: { formData }
    }));

    // Default form submission if no custom handler
    if (!this.form.hasAttribute('data-handled')) {
      console.log('Form validated successfully:', formData);
    }
  }
}
