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

// Helper function for absolute URLs
export const getAbsoluteUrl = (path: string) => {
  return new URL(path, SITE_CONFIG.site).href;
};

// Helper for asset URLs
export const getAssetUrl = (asset: string) => {
  return SITE_CONFIG.getAssetPath(asset);
};
