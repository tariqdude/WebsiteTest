/**
 * Type Definitions
 * Centralized TypeScript interfaces and types
 */

// Component Props Types
export interface BaseProps {
  class?: string;
  id?: string;
}

export interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  openGraph?: OpenGraphData;
  twitterCard?: TwitterCardData;
}

// Data Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'emergency';
}

export interface QuoteRequestData extends ContactFormData {
  projectType: 'hvac' | 'construction' | 'maintenance' | 'emergency';
  budget?: string;
  timeline?: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  squareFootage?: number;
}

export interface ServiceAreaData {
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  responseTime?: string;
  featured?: boolean;
}



// SEO and Meta Types
export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  siteName?: string;
  locale?: string;
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  telephone?: string;
  address?: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  areaServed?: string[];
}

// Error and Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Analytics Types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  external?: boolean;
  badge?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Theme Types
export interface ThemeColors {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
  neutral: Record<string, string>;
  success: Record<string, string>;
  warning: Record<string, string>;
  error: Record<string, string>;
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Component State Types
export interface ComponentState {
  loading: boolean;
  error: string | null;
  data: any;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message?: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}
