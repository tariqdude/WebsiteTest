/**
 * Optimized Constants for Astro Showcase
 * 
 * Organized by usage and importance:
 * 1. Core Application Constants
 * 2. Framework Configuration
 * 3. UI & Theme Constants
 * 4. Performance Thresholds
 * 5. Navigation & Routing
 * 
 * @version 2.0.0 - Optimized & Enhanced
 */

// =============================================================================
// 1. CORE APPLICATION CONSTANTS
// =============================================================================

export const SITE_CONFIG = {
  title: 'Astro Ultimate Showcase',
  description: 'The most comprehensive demonstration of modern web development capabilities',
  author: 'Astro Showcase Team',
  url: 'https://tariqdude.github.io/WebsiteTest',
  image: '/images/og-image.jpg',
  version: '3.0.0',
} as const;

// =============================================================================
// 2. FRAMEWORK CONFIGURATION (Used by components)
// =============================================================================

export const FRAMEWORKS = [
  {
    name: 'React',
    description: 'Interactive state management, forms, animations, and real-time data',
    icon: '⚛️',
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    color: '#61DAFB',
  },
  {
    name: 'Vue',
    description: 'Reactive color palettes and smooth transitions',
    icon: '💚',
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    color: '#4FC08D',
  },
  {
    name: 'Svelte',
    description: 'Built-in animations with motion library and intersection observers',
    icon: '🧡',
    bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    color: '#FF3E00',
  },
  {
    name: 'Solid.js',
    description: 'Fine-grained reactivity with surgical precision updates',
    icon: '🔵',
    bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    color: '#2C4F7C',
  },
  {
    name: 'Preact',
    description: '3KB alternative with full React API compatibility',
    icon: '💜',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    color: '#673AB8',
  },
  {
    name: 'TypeScript',
    description: 'Full type safety across all components and frameworks',
    icon: '📘',
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    color: '#3178C6',
  },
] as const;

// =============================================================================
// 3. UI & THEME CONSTANTS
// =============================================================================

export const THEME_CONFIG = {
  defaultMode: 'system' as const,
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
} as const;

export const ANIMATION_DEFAULTS = {
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// =============================================================================
// 4. PERFORMANCE THRESHOLDS (Used by monitoring)
// =============================================================================

export const PERFORMANCE_THRESHOLDS = {
  good: {
    fcp: 1800,    // First Contentful Paint
    lcp: 2500,    // Largest Contentful Paint
    fid: 100,     // First Input Delay
    cls: 0.1,     // Cumulative Layout Shift
    ttfb: 800,    // Time to First Byte
  },
  needsImprovement: {
    fcp: 3000,
    lcp: 4000,
    fid: 300,
    cls: 0.25,
    ttfb: 1800,
  },
  memory: {
    warning: 50 * 1024 * 1024,    // 50MB
    critical: 100 * 1024 * 1024,  // 100MB
  },
} as const;

// =============================================================================
// 5. NAVIGATION & ROUTING (Used by components)
// =============================================================================

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'About', href: '/about', icon: '👋' },
  { name: 'Projects', href: '/projects', icon: '🚀' },
  { name: 'Blog', href: '/blog', icon: '📝' },
  { name: 'Showcase', href: '/showcase', icon: '✨' },
  { name: 'Contact', href: '/contact', icon: '📬' },
] as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/tariqdude',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
} as const;

// =============================================================================
// 6. FEATURE FLAGS & CONFIGURATION
// =============================================================================

export const FEATURE_FLAGS = {
  enableAnalytics: true,
  enablePWA: true,
  enableI18n: false,
  enableComments: true,
  enableNewsletter: true,
  enableDarkMode: true,
  enablePerformanceMonitoring: true,
} as const;

export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 10000,
  retries: 3,
  endpoints: {
    contact: '/contact',
    newsletter: '/newsletter',
    comments: '/comments',
    analytics: '/analytics',
  },
} as const;

// =============================================================================
// 7. DEVELOPMENT & BUILD CONSTANTS
// =============================================================================

export const BUILD_CONFIG = {
  version: '3.0.0',
  buildDate: new Date().toISOString(),
  environment: 'production' as const,
  features: {
    multiFramework: true,
    enhancedDiagnostics: true,
    performanceMonitoring: true,
    advancedChunking: true,
  },
} as const;

// =============================================================================
// EXPORTED CONSTANT GROUPS
// =============================================================================

export const CORE_CONSTANTS = {
  SITE_CONFIG,
  BUILD_CONFIG,
  FEATURE_FLAGS,
} as const;

export const UI_CONSTANTS = {
  THEME_CONFIG,
  ANIMATION_DEFAULTS,
  BREAKPOINTS,
  NAVIGATION_ITEMS,
} as const;

export const PERFORMANCE_CONSTANTS = {
  PERFORMANCE_THRESHOLDS,
} as const;
