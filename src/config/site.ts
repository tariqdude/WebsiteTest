// Site configuration for GitHub Pages deployment
export const SITE_CONFIG = {
  // This will be '/WebsiteTest' on GitHub Pages, '/' in development
  base: import.meta.env.BASE_URL || '/',
  
  // Full site URL
  site: import.meta.env.SITE || 'http://localhost:4321',
  
  // Asset paths
  getAssetPath: (path: string) => {
    const base = import.meta.env.BASE_URL || '/';
    return base + path.replace(/^\//, '');
  },
  
  // API endpoints (if any)
  api: {
    contact: '/api/contact',
    quotes: '/api/quotes'
  }
};

// Enhanced SITE configuration for SEO
export const SITE = {
  title: 'ProBuild Construction - Professional Construction & HVAC Services',
  description: 'Leading construction and HVAC contractor serving residential and commercial clients. Licensed, insured, and trusted for quality craftsmanship.',
  url: SITE_CONFIG.site,
  image: '/images/og-image.jpg',
  author: {
    name: 'ProBuild Construction',
    email: 'info@probuild.com',
    twitter: '@probuildconstruction'
  },
  business: {
    name: 'ProBuild Construction LLC',
    description: 'Professional construction, HVAC, and home improvement services',
    logo: '/images/logo.svg',
    image: '/images/business-image.jpg',
    phone: '+1-555-123-4567',
    email: 'info@probuild.com',
    address: {
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'US'
    },
    coordinates: {
      lat: 39.7817,
      lng: -89.6501
    },
    hours: [
      'Mo-Fr 08:00-18:00'
    ],
    priceRange: '$$',
    serviceRadius: '50000', // 50km
    serviceAreas: [
      'Springfield, IL',
      'Decatur, IL',
      'Bloomington, IL',
      'Champaign, IL'
    ],
    services: [
      {
        name: 'Residential Construction',
        description: 'Custom homes, additions, and renovations built with precision and care.'
      },
      {
        name: 'Commercial Construction', 
        description: 'Professional commercial spaces designed for business success.'
      },
      {
        name: 'HVAC Systems',
        description: 'Complete heating, ventilation, and air conditioning services.'
      },
      {
        name: 'Home Renovation',
        description: 'Transform your existing space with our renovation expertise.'
      },
      {
        name: 'Electrical Services',
        description: 'Safe and reliable electrical work for homes and businesses.'
      },
      {
        name: 'Plumbing Services',
        description: 'Complete plumbing solutions from repairs to new installations.'
      }
    ],
    rating: {
      value: 4.8,
      count: 127
    },
    reviews: [
      {
        author: 'John Smith',
        rating: 5,
        text: 'Excellent work on our kitchen renovation. Professional, on-time, and within budget.',
        date: '2024-01-15'
      },
      {
        author: 'Sarah Johnson',
        rating: 5,
        text: 'ProBuild transformed our basement into a beautiful living space. Highly recommend!',
        date: '2024-02-20'
      }
    ]
  },
  social: {
    facebook: 'https://facebook.com/probuildconstruction',
    instagram: 'https://instagram.com/probuildconstruction',
    linkedin: 'https://linkedin.com/company/probuildconstruction',
    twitter: 'https://twitter.com/probuildconstruction'
  }
};

// Helper function for absolute URLs
export const getAbsoluteUrl = (path: string) => {
  return new URL(path, SITE_CONFIG.site).href;
};

// Helper for asset URLs
export const getAssetUrl = (asset: string) => {
  return SITE_CONFIG.getAssetPath(asset);
};
