const CACHE = 'site-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/index.html',
        '/offline.html',
        '/styles.css',
        '/scripts.js',
        'https://placehold.co/96x96',
        'https://placehold.co/180x180',
        'https://placehold.co/1920x1080',
        'https://placehold.co/800x600',
        'https://placehold.co/400',
        'https://placehold.co/1200x630'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('offline.html'));
    })
  );
});

