/**
 * Enhanced Form Types for Advanced Form Components
 * 
 * Specialized types for React Hook Form, Zod validation,
 * and multi-framework form support.
 * 
 * @version 1.0.0
 */

import type { 
  FormFieldType, 
  FormFieldValidation, 
  FormFieldOption, 
  FormField 
} from './index';

// =============================================================================
// ENHANCED FORM TYPES
// =============================================================================

// Advanced form configuration
export interface FormConfig {
  title?: string;
  description?: string;
  submitText?: string;
  resetText?: string;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  shouldUseNativeValidation?: boolean;
}

// Form step for multi-step forms
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: Record<string, unknown>;
  optional?: boolean;
}

// Multi-step form configuration
export interface MultiStepFormConfig extends FormConfig {
  steps: FormStep[];
  allowStepSkipping?: boolean;
  showProgress?: boolean;
  progressType?: 'steps' | 'percentage' | 'bar';
}

// Form submission result
export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
  timestamp: Date;
  duration?: number;
}

// Advanced validation rules
export interface AdvancedValidation extends FormFieldValidation {
  asyncValidator?: (value: unknown) => Promise<boolean | string>;
  dependsOn?: string[]; // Other field names this validation depends on
  skipValidation?: (formData: Record<string, unknown>) => boolean;
}

// Enhanced form field with advanced features
export interface AdvancedFormField extends Omit<FormField, 'validation'> {
  validation?: AdvancedValidation;
  conditional?: {
    field: string;
    value: unknown;
    operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  };
  formatting?: {
    mask?: string;
    transform?: (value: string) => string;
  };
  helpText?: string;
  group?: string; // For grouping related fields
}

// File upload specific types
export interface FileUploadField extends AdvancedFormField {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  preview?: boolean;
}

// Select field with search/async options
export interface SelectField extends AdvancedFormField {
  type: 'select';
  searchable?: boolean;
  loadOptions?: (inputValue: string) => Promise<FormFieldOption[]>;
  isLoading?: boolean;
  noOptionsMessage?: string;
}

// Form field union type
export type EnhancedFormField = AdvancedFormField | FileUploadField | SelectField;

// Form state for complex forms
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
  currentStep?: number;
  totalSteps?: number;
}

// Form actions for state management
export type FormAction<T = Record<string, unknown>> =
  | { type: 'SET_FIELD_VALUE'; field: string; value: unknown }
  | { type: 'SET_FIELD_ERROR'; field: string; error: string }
  | { type: 'CLEAR_FIELD_ERROR'; field: string }
  | { type: 'SET_FIELD_TOUCHED'; field: string; touched: boolean }
  | { type: 'SET_FORM_VALUES'; values: T }
  | { type: 'SET_FORM_ERRORS'; errors: Record<string, string> }
  | { type: 'CLEAR_FORM' }
  | { type: 'SET_SUBMITTING'; submitting: boolean }
  | { type: 'SET_VALIDATING'; validating: boolean }
  | { type: 'INCREMENT_SUBMIT_COUNT' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; step: number };

// Form hooks return type
export interface UseFormReturn<T = Record<string, unknown>> {
  state: FormState<T>;
  register: (field: string) => {
    name: string;
    onChange: (event: Event) => void;
    onBlur: (event: Event) => void;
    value: unknown;
  };
  setValue: (field: string, value: unknown, options?: { shouldValidate?: boolean; shouldTouch?: boolean }) => void;
  getValue: (field: string) => unknown;
  getValues: () => T;
  clearErrors: (fields?: string | string[]) => void;
  setError: (field: string, error: string) => void;
  validate: (field?: string) => Promise<boolean>;
  reset: (values?: T) => void;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (event: Event) => void;
}

// =============================================================================
// FORM BUILDER TYPES
// =============================================================================

// Form builder configuration
export interface FormBuilderConfig {
  title: string;
  description?: string;
  fields: EnhancedFormField[];
  layout?: 'single-column' | 'two-column' | 'grid' | 'custom';
  theme?: 'default' | 'minimal' | 'rounded' | 'modern';
  validation?: 'real-time' | 'on-blur' | 'on-submit';
  showProgress?: boolean;
  allowSave?: boolean;
  allowReset?: boolean;
}

// Dynamic form schema (for form builders)
export interface DynamicFormSchema {
  id: string;
  version: string;
  metadata: {
    title: string;
    description?: string;
    author?: string;
    created: Date;
    modified: Date;
  };
  config: FormBuilderConfig;
  fields: EnhancedFormField[];
  validation?: Record<string, unknown>;
  styling?: Record<string, unknown>;
}

// =============================================================================
// FRAMEWORK-SPECIFIC TYPES
// =============================================================================

// React Hook Form specific
export interface ReactFormProps<T = Record<string, unknown>> {
  schema?: unknown; // Zod schema
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  onSubmit: (data: T) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  className?: string;
  disabled?: boolean;
}

// Vue form props
export interface VueFormProps<T = Record<string, unknown>> {
  modelValue?: Partial<T>;
  fields: EnhancedFormField[];
  validation?: Record<string, unknown>;
  onSubmit?: (data: T) => void | Promise<void>;
  onUpdate?: (field: string, value: unknown) => void;
}

// Svelte form props
export interface SvelteFormProps<T = Record<string, unknown>> {
  values?: T;
  fields: EnhancedFormField[];
  onSubmit?: (data: T) => void | Promise<void>;
  form?: FormState<T>;
}

// =============================================================================
// VALIDATION SCHEMA TYPES
// =============================================================================

// Generic validation schema structure
export interface ValidationSchema {
  [fieldName: string]: {
    type: FormFieldType;
    required?: boolean;
    rules?: ValidationRule[];
    message?: string;
  };
}

// Individual validation rule
export interface ValidationRule {
  type: 'min' | 'max' | 'length' | 'pattern' | 'custom' | 'async';
  value?: number | string | RegExp;
  message?: string;
  validator?: (value: unknown) => boolean | Promise<boolean>;
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

// =============================================================================
// EXPORT TYPE BUNDLES
// =============================================================================

export type BasicFormTypes = {
  FormField: FormField;
  FormFieldType: FormFieldType;
  FormFieldValidation: FormFieldValidation;
  FormFieldOption: FormFieldOption;
};

export type AdvancedFormTypes = {
  FormConfig: FormConfig;
  FormStep: FormStep;
  MultiStepFormConfig: MultiStepFormConfig;
  FormSubmissionResult: FormSubmissionResult;
  AdvancedFormField: AdvancedFormField;
  EnhancedFormField: EnhancedFormField;
};

export type FormStateTypes = {
  FormState: FormState;
  FormAction: FormAction;
  UseFormReturn: UseFormReturn;
};

export type FormBuilderTypes = {
  FormBuilderConfig: FormBuilderConfig;
  DynamicFormSchema: DynamicFormSchema;
};

export type ValidationTypes = {
  ValidationSchema: ValidationSchema;
  ValidationRule: ValidationRule;
  ValidationResult: ValidationResult;
  AdvancedValidation: AdvancedValidation;
};
