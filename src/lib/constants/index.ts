// Constants for the application

export const SITE_CONFIG = {
  title: 'Astro Ultimate Showcase',
  description: 'The most comprehensive demonstration of modern web development capabilities',
  author: 'Your Name',
  url: 'https://tariqdude.github.io/WebsiteTest',
  image: '/images/og-image.jpg',
} as const;

export const FRAMEWORKS = [
  {
    name: 'React',
    description: 'Interactive state management, forms, animations, and real-time data',
    icon: '⚛️',
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Vue',
    description: 'Reactive color palettes and smooth transitions',
    icon: '💚',
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  },
  {
    name: 'Svelte',
    description: 'Built-in animations with motion library and intersection observers',
    icon: '🧡',
    bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  },
  {
    name: 'Solid.js',
    description: 'Fine-grained reactivity with surgical precision updates',
    icon: '🔵',
    bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  },
  {
    name: 'Preact',
    description: '3KB alternative with full React API compatibility',
    icon: '💜',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
  },
  {
    name: 'TypeScript',
    description: 'Full type safety across all components and frameworks',
    icon: '📘',
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  },
] as const;

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Showcase', href: '/showcase' },
  { name: 'Contact', href: '/contact' },
] as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/tariqdude',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
} as const;

export const PERFORMANCE_THRESHOLDS = {
  good: {
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    ttfb: 800,
  },
  needsImprovement: {
    fcp: 3000,
    lcp: 4000,
    fid: 300,
    cls: 0.25,
    ttfb: 1800,
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

export const COLORS = {
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
} as const;
