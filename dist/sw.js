// Service Worker for Midwest Climate Solutions HVAC Website
// Version: 2.1 - Enhanced Performance & Offline Capabilities
// Updated: July 19, 2025

const CACHE_NAME = 'midwest-hvac-v2.1';
const CACHE_VERSION = 'v2.1';

// Enhanced cache strategy - critical assets for HVAC business
const CRITICAL_ASSETS = [
  '/WebsiteTest/',
  '/WebsiteTest/index.html',
  '/WebsiteTest/assets/css/main.css',
  '/WebsiteTest/assets/js/websiteController.js',
  '/WebsiteTest/assets/js/errorHandler.js',
  '/WebsiteTest/assets/js/analytics.js',
  '/WebsiteTest/favicon.ico',
  '/WebsiteTest/favicon-32x32.png',
  '/WebsiteTest/apple-touch-icon.png',
  '/WebsiteTest/site.webmanifest'
];

// External resources cache
const EXTERNAL_CACHE = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Emergency service data for offline access
const EMERGENCY_DATA = {
  phone: '(555) 123-4567',
  email: 'emergency@midwestclimatesolutions.com',
  hours: '24/7 Emergency Service Available',
  response_time: '2 hours or less',
  services: [
    'Emergency HVAC Repair',
    'System Failure Response',
    'Critical Temperature Control',
    'Emergency Diagnostics'
  ]
};

// Enhanced install event with better error handling
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker v' + CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS).catch(error => {
          console.error('[SW] Failed to cache critical assets:', error);
          // Cache individual assets that succeed
          return Promise.allSettled(
            CRITICAL_ASSETS.map(asset => cache.add(asset))
          );
        });
      }),
      
      // Cache external resources
      caches.open(CACHE_NAME + '-external').then(cache => {
        console.log('[SW] Caching external resources');
        return Promise.allSettled(
          EXTERNAL_CACHE.map(url => 
            cache.add(url).catch(error => {
              console.warn('[SW] Failed to cache external resource:', url, error);
            })
          )
        );
      }),
      
      // Store emergency contact data
      caches.open(CACHE_NAME + '-data').then(cache => {
        console.log('[SW] Storing emergency contact data');
        return cache.put(
          '/emergency-data', 
          new Response(JSON.stringify(EMERGENCY_DATA), {
            headers: { 'Content-Type': 'application/json' }
          })
        );
      })
    ]).then(() => {
      console.log('[SW] Installation completed successfully');
      return self.skipWaiting();
    }).catch(error => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// Enhanced activate event with cache cleanup
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker v' + CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('midwest-hvac-') && 
              cacheName !== CACHE_NAME &&
              !cacheName.includes(CACHE_NAME)
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation completed successfully');
    }).catch(error => {
      console.error('[SW] Activation failed:', error);
    })
  );
});

// Enhanced fetch event with intelligent caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external domains except for cached resources
  if (!url.origin.includes('tariqdude.github.io') && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('cdnjs.cloudflare.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        
        // For HTML pages, try to update cache in background
        if (request.destination === 'document') {
          event.waitUntil(
            fetch(request).then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, responseClone);
                });
              }
            }).catch(error => {
              console.warn('[SW] Background update failed:', error);
            })
          );
        }
        
        return cachedResponse;
      }
      
      // Fetch from network with timeout and caching
      return fetchWithTimeout(request, 5000)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          // Clone response for caching
          const responseClone = response.clone();
          
          // Cache successful responses
          if (shouldCache(request)) {
            caches.open(getCacheName(request)).then(cache => {
              cache.put(request, responseClone);
            }).catch(error => {
              console.warn('[SW] Failed to cache response:', error);
            });
          }
          
          return response;
        })
        .catch(error => {
          console.error('[SW] Fetch failed:', request.url, error);
          
          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/WebsiteTest/').then(fallback => {
              return fallback || new Response(getOfflineHTML(), {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          }
          
          // Return emergency data if available
          if (request.url.includes('emergency') || request.url.includes('contact')) {
            return caches.match('/emergency-data');
          }
          
          throw error;
        });
    })
  );
});

// Enhanced message handling for cache updates
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      event.ports[0].postMessage({ success: true });
      break;
      
    case 'UPDATE_CACHE':
      event.waitUntil(
        updateCache(payload.urls).then(() => {
          event.ports[0].postMessage({ success: true });
        }).catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        })
      );
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        }).catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        })
      );
      break;
      
    default:
      console.warn('[SW] Unknown message type:', type);
  }
});

// Helper functions
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

function shouldCache(request) {
  const url = new URL(request.url);
  
  // Don't cache API calls or analytics
  if (url.pathname.includes('/api/') ||
      url.hostname.includes('google-analytics') ||
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('clarity.ms') ||
      url.hostname.includes('hotjar')) {
    return false;
  }
  
  return true;
}

function getCacheName(request) {
  const url = new URL(request.url);
  
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('cdnjs.cloudflare.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    return CACHE_NAME + '-external';
  }
  
  return CACHE_NAME;
}

function updateCache(urls) {
  return caches.open(CACHE_NAME).then(cache => {
    return Promise.allSettled(
      urls.map(url => cache.add(url))
    );
  });
}

function clearAllCaches() {
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames
        .filter(cacheName => cacheName.startsWith('midwest-hvac-'))
        .map(cacheName => caches.delete(cacheName))
    );
  });
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Midwest Climate Solutions</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .container { max-width: 500px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; }
        .emergency { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
        .phone { font-size: 2rem; font-weight: bold; color: #fbbf24; }
        a { color: #fbbf24; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌐 You're Offline</h1>
        <p>No internet connection detected. But don't worry - emergency HVAC service is still available!</p>
        
        <div class="emergency">
          <h2>🚨 Emergency HVAC Service</h2>
          <div class="phone">
            <a href="tel:${EMERGENCY_DATA.phone}">${EMERGENCY_DATA.phone}</a>
          </div>
          <p>${EMERGENCY_DATA.hours}</p>
          <p>Response Time: ${EMERGENCY_DATA.response_time}</p>
        </div>
        
        <p><small>This page works offline thanks to our service worker technology.</small></p>
      </div>
    </body>
    </html>
  `;
}

console.log('[SW] Service worker loaded successfully v' + CACHE_VERSION);
