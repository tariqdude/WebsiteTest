/**
 * Optimized Core Type Definitions for Astro Showcase
 * 
 * Organized by actual usage and importance:
 * 1. Essential Base Types - Core primitive types used throughout
 * 2. Content & Collections - Blog posts, projects, team members  
 * 3. UI & Components - Component props and styling
 * 4. Forms & Validation - Form handling and validation
 * 5. Performance & Monitoring - Performance tracking and metrics
 * 6. Data Visualization - Charts and graphs (Chart.js/D3.js)
 * 7. Utility & Helper Types - Advanced TypeScript utilities
 * 8. Framework Integration - Multi-framework support types
 * 
 * @author Astro Showcase Team  
 * @version 3.0.0 - Optimized & Cleaned
 */

// =============================================================================
// 1. ESSENTIAL BASE TYPES
// =============================================================================

export type ID = string | number;
export type Timestamp = Date | string | number;
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// =============================================================================
// 2. CONTENT & COLLECTIONS (Used by Astro content collections)
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
// 3. UI & COMPONENTS (Used by framework components)
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

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  icon?: string;
  children?: NavigationItem[];
}

export interface ContactInfo {
  title: string;
  description: string;
  icon: string;
  link?: string;
  type?: 'email' | 'phone' | 'address' | 'social';
}

// =============================================================================
// 4. FORMS & VALIDATION (Used by React Hook Form components)
// =============================================================================

export type FormFieldType = 
  | 'text' | 'email' | 'number' | 'textarea' | 'select' 
  | 'checkbox' | 'radio' | 'file' | 'password' | 'tel' 
  | 'url' | 'date' | 'time' | 'datetime-local';

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
// 5. PERFORMANCE & MONITORING (Used by performance hooks & components)
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
// 6. DATA VISUALIZATION (Used by Chart.js & D3.js components)
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
// 7. UTILITY & HELPER TYPES (TypeScript utilities)
// =============================================================================

// Enhanced utility types for better type safety
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

// Branded types for enhanced type safety
declare const __brand: unique symbol;
export type Brand<T, B> = T & { [__brand]: B };

export type EmailAddress = Brand<string, 'EmailAddress'>;
export type URL = Brand<string, 'URL'>;
export type PhoneNumber = Brand<string, 'PhoneNumber'>;
export type SafeHTML = Brand<string, 'SafeHTML'>;

// =============================================================================
// 8. FRAMEWORK INTEGRATION (Multi-framework support)
// =============================================================================

// Event handlers for React, Preact, Solid.js
export type EventHandler<T = Event> = (event: T) => void;
export type ClickHandler = EventHandler<MouseEvent>;
export type ChangeHandler<T = HTMLInputElement> = (event: Event & { target: T }) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: Event & { target: T }) => void;
export type KeyboardHandler = EventHandler<KeyboardEvent>;
export type FocusHandler = EventHandler<FocusEvent>;

// Callback types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type CallbackWithParams<P extends readonly unknown[], T = void> = (...params: P) => T;
export type ErrorCallback = (error: Error) => void;
export type SuccessCallback<T = unknown> = (data: T) => void;

// Animation support (GSAP, Framer Motion)
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

// API & Network types (for future API integration)
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

// State management for React-like frameworks
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
// EXPORTED TYPE GROUPS (For easier importing)
// =============================================================================

// Core types bundle
export type CoreTypes = {
  ID: ID;
  Timestamp: Timestamp;
  LoadingState: LoadingState;
  ThemeMode: ThemeMode;
};

// Content types bundle  
export type ContentTypes = {
  BlogPost: BlogPost;
  Project: Project;
  TeamMember: TeamMember;
};

// UI types bundle
export type UITypes = {
  Framework: Framework;
  Skill: Skill;
  NavigationItem: NavigationItem;
  ContactInfo: ContactInfo;
};

// Form types bundle
export type FormTypes = {
  FormField: FormField;
  FormFieldType: FormFieldType;
  FormFieldValidation: FormFieldValidation;
  FormFieldOption: FormFieldOption;
};

// Performance types bundle
export type PerformanceTypes = {
  PerformanceMetric: PerformanceMetric;
  PerformanceStats: PerformanceStats;
  ExtendedPerformance: ExtendedPerformance;
};

// Chart types bundle
export type ChartTypes = {
  ChartData: ChartData;
  ChartDataset: ChartDataset;
  ChartOptions: ChartOptions;
};

// =============================================================================
// SPECIALIZED TYPE MODULES
// =============================================================================

// Re-export specialized types for convenience
export * from './forms';
export * from './performance';
