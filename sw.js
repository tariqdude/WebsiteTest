self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/assets/css/custom.css',
      '/assets/js/main.js',
      '/404.html'
    ]))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
