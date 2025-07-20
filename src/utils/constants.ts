/**
 * Application Constants
 * Centralized configuration and constants for the website
 */

// Company Information
export const COMPANY = {
  name: 'Midwest Construction & HVAC Solutions',
  shortName: 'Midwest HVAC',
  phone: '(555) 123-4567',
  email: 'info@midwestconstructionhvac.com',
  address: {
    street: '456 Climate Drive',
    city: 'Metroville',
    state: 'IL',
    zip: '60601',
    full: '456 Climate Drive, Metroville, IL 60601'
  },
  hours: {
    weekdays: 'Mo-Fr 07:00-18:00',
    saturday: 'Sa 08:00-16:00',
    display: 'Monday-Friday: 7AM-6PM, Saturday: 8AM-4PM'
  },
  emergency: {
    available: true,
    responseTime: '2 hours',
    callFee: 150
  }
} as const;

// Service Areas
export const SERVICE_AREAS = {
  primary: ['Chicago', 'Milwaukee', 'Indianapolis', 'Detroit', 'Cleveland'],
  states: ['IL', 'IN', 'MI', 'WI', 'OH'],
  radius: 100, // miles
  regions: ['Great Lakes Region', 'Midwest']
} as const;

// API Configuration
export const API_CONFIG = {
  analytics: {
    gtag: 'GA_MEASUREMENT_ID', // Replace with actual ID
    clarity: 'CLARITY_PROJECT_ID' // Replace with actual ID
  }
} as const;

// Theme Configuration
export const THEME = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#fff7ed',
      500: '#f97316',
      900: '#9a3412'
    },
    accent: {
      500: '#8b5cf6'
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
} as const;

// SEO Configuration
export const SEO = {
  defaultTitle: 'Midwest Construction & HVAC Solutions - Professional Contracting Services',
  defaultDescription: 'Leading HVAC, construction, and general contracting services throughout the Great Lakes region. Commercial and residential projects with 20+ years of excellence.',
  keywords: [
    'HVAC services',
    'construction',
    'general contracting',
    'commercial HVAC',
    'heating',
    'cooling',
    'air conditioning',
    'construction projects',
    'building contractors',
    'renovation',
    'plumbing',
    'electrical',
    'roofing'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Midwest Construction & HVAC Solutions'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network connection error. Please try again.',
  validation: 'Please check your input and try again.',
  generic: 'Something went wrong. Please try again later.',
  form: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number'
  }
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  form: 'Thank you! We\'ll get back to you within 24 hours.',
  quote: 'Quote request submitted successfully!',
  subscription: 'Successfully subscribed to updates!'
} as const;
