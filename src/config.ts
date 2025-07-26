// Centralized configuration for the application
export const appConfig = {
  name: 'Astro Ultimate Showcase',
  description: 'The most comprehensive demonstration of modern web development capabilities',
  version: '1.0.0',
  author: 'Tariq Ahmed',
  repository: 'https://github.com/tariqdude/WebsiteTest',
  url: 'https://tariqdude.github.io/WebsiteTest',
  
  // SEO defaults
  seo: {
    title: 'Astro Ultimate Showcase - Modern Web Development',
    description: 'Featuring 15+ frameworks, 50+ advanced features, and cutting-edge technologies',
    image: '/images/og-image.jpg',
    twitter: '@tariqdude',
  },
  
  // Theme configuration
  theme: {
    defaultMode: 'system' as const,
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      },
    },
  },
  
  // Feature flags
  features: {
    analytics: true,
    pwa: true,
    i18n: false,
    comments: true,
    newsletter: true,
  },
  
  // API endpoints
  api: {
    contact: '/api/contact',
    newsletter: '/api/newsletter',
    comments: '/api/comments',
  },
  
  // Social links
  social: {
    github: 'https://github.com/tariqdude',
    twitter: 'https://twitter.com/tariqdude',
    linkedin: 'https://linkedin.com/in/tariqdude',
  },
  
  // Performance thresholds
  performance: {
    loadTime: 2000,
    firstContentfulPaint: 800,
    largestContentfulPaint: 1200,
  },
} as const;
