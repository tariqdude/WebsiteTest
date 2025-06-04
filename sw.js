const CACHE_NAME = 'site-cache-v1';
const OFFLINE_URL = 'offline.html';

const CORE_ASSETS = [
  '/',
  'index.html',
  OFFLINE_URL,
  'styles.css',
  'scripts.js',
  '404.html',
  'manifest.json',
  'robots.txt',
  'sitemap.xml'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
