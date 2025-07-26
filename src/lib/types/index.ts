/**
 * Core type definitions for the Astro Showcase application
 * 
 * This file is organized into logical sections:
 * - Base Utility Types: Fundamental types used throughout the app
 * - Content Collection Types: Types for blog posts, projects, team members
 * - UI Component Types: Types for interactive components and styling
 * - Performance & Monitoring: Types for performance tracking
 * - Data Visualization: Types for charts and graphs
 * - Form & Input Types: Comprehensive form handling types
 * - Animation & Interaction: Types for animations and user interactions
 * - API & Network Types: Types for API responses and network operations
 * - Event Handler Types: Typed event handlers for better type safety
 * - Generic Callback Types: Reusable callback type definitions
 * - Advanced Utility Types: Complex utility types for type manipulation
 * - Branded Types: Types with additional type safety through branding
 * - State Management: Types for application state management
 * 
 * @author Astro Showcase Team
 * @version 2.0.0
 */

// =============================================================================
// BASE UTILITY TYPES
// =============================================================================

export type ID = string | number;
export type Timestamp = Date | string | number;
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';

// Component styling types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// =============================================================================
// CONTENT COLLECTION TYPES
// =============================================================================

export interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    author: string;
    tags: string[];
    image?: string;
    imageAlt?: string;
    featured?: boolean;
    draft?: boolean;
    category?: string;
    readingTime?: number;
    excerpt?: string;
  };
}

export interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    technologies: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
    category?: string;
    status?: 'planning' | 'development' | 'completed' | 'maintenance';
    startDate?: Date;
    endDate?: Date;
    order?: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

export interface Framework {
  name: string;
  description: string;
  icon: string;
  bg: string;
  color?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
  description?: string;
}

export interface ContactInfo {
  title: string;
  description: string;
  icon: string;
  link?: string;
  type?: 'email' | 'phone' | 'address' | 'social';
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  icon?: string;
  children?: NavigationItem[];
}

// =============================================================================
// PERFORMANCE & MONITORING TYPES
// =============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
  category?: 'memory' | 'network' | 'rendering' | 'loading';
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface ExtendedPerformance extends Performance {
  memory?: MemoryInfo;
}

export interface ConnectionInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface PerformanceStats {
  memory: number;
  connection: ConnectionInfo;
  loadTime: number;
  renderTime: number;
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  domLoad?: number; // DOM Load Time
}

// =============================================================================
// DATA VISUALIZATION TYPES
// =============================================================================

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string;
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: Record<string, unknown>;
  scales?: Record<string, unknown>;
}

// =============================================================================
// FORM & INPUT TYPES
// =============================================================================

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio'
  | 'file' 
  | 'password' 
  | 'tel' 
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local';

export interface FormFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  custom?: (value: unknown) => boolean | string;
}

export interface FormFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  disabled?: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
  autoComplete?: string;
}

// =============================================================================
// ANIMATION & INTERACTION TYPES
// =============================================================================

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
}

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

// =============================================================================
// API & NETWORK TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status?: number;
  details?: Record<string, unknown>;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// EVENT HANDLER TYPES
// =============================================================================

export type EventHandler<T = Event> = (event: T) => void;
export type ClickHandler = EventHandler<MouseEvent>;
export type ChangeHandler<T = HTMLInputElement> = (event: Event & { target: T }) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: Event & { target: T }) => void;
export type KeyboardHandler = EventHandler<KeyboardEvent>;
export type FocusHandler = EventHandler<FocusEvent>;

// =============================================================================
// GENERIC CALLBACK TYPES
// =============================================================================

export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type CallbackWithParams<P extends readonly unknown[], T = void> = (...params: P) => T;
export type ErrorCallback = (error: Error) => void;
export type SuccessCallback<T = unknown> = (data: T) => void;

// =============================================================================
// ADVANCED UTILITY TYPES
// =============================================================================

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Conditional types
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Flatten<T> = T extends (infer U)[] ? U : T;
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// =============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// =============================================================================

declare const __brand: unique symbol;
export type Brand<T, B> = T & { [__brand]: B };

export type EmailAddress = Brand<string, 'EmailAddress'>;
export type URL = Brand<string, 'URL'>;
export type PhoneNumber = Brand<string, 'PhoneNumber'>;
export type SafeHTML = Brand<string, 'SafeHTML'>;

// =============================================================================
// STATE MANAGEMENT TYPES
// =============================================================================

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export type AsyncAction<T> = 
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

// =============================================================================
// RE-EXPORTS FOR CONVENIENCE
// =============================================================================

// Most commonly used types
export type {
  // Base types
  ID,
  Timestamp,
  LoadingState,
  ThemeMode,
  ComponentSize,
  ComponentVariant,
  
  // Content types
  BlogPost,
  Project,
  TeamMember,
  
  // UI types
  FormField,
  FormFieldType,
  NavigationItem,
  
  // Performance types
  PerformanceMetric,
  PerformanceStats,
  
  // API types
  ApiResponse,
  ApiError,
  
  // Event types
  ClickHandler,
  ChangeHandler,
  SubmitHandler,
} as CommonTypes;
