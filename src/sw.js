// sw.js
/**
 * Service Worker (sw.js)
 * - INSTALL: Cache shell assets.
 * - ACTIVATE: Clean old caches.
 * - FETCH: Cache-First for shell, Network-First for form, offline fallback to /offline.html.
 */
const CACHE_VERSION = 'v1.0.0';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=202506051200',
  '/script.js?v=202506051200',
  '/data:image/svg+xml;base64,…',
  '/manifest.json',
  '/offline.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CACHE_ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, clone));
        return res;
      });
    }).catch(() => {
      return caches.match('/offline.html');
    })
  );
});
