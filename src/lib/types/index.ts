// Core type definitions for the application

// Base utility types
export type ID = string | number;
export type Timestamp = Date | string | number;
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Content collection types
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
  };
}

export interface Framework {
  name: string;
  description: string;
  icon: string;
  bg: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
}

// Performance monitoring types
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
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }>;
}

export type FormFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'password' | 'tel' | 'url';

export interface FormFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  required?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: FormFieldValidation;
  disabled?: boolean;
  defaultValue?: string | number | boolean;
}

export interface ContactInfo {
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  children?: NavigationItem[];
}

// Additional utility types
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type ClickHandler = EventHandler<MouseEvent>;
export type ChangeHandler = EventHandler<Event>;
export type SubmitHandler = EventHandler<Event>;

// Generic callback types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type CallbackWithParams<P extends readonly unknown[], T = void> = (...params: P) => T;
