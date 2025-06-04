const cacheName = 'apex-cache-v4';
const assets = [
  'index.html',
  'style.css',
  'script.js',
  '404.html',
  'offline.html',
  'privacy.html',
  'terms.html',
  'manifest.json',
  'icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => cache.addAll(assets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== cacheName).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('offline.html'))
    );
    return;
  }
  if (request.destination === 'image') {
    event.respondWith(
      caches.open('image-cache').then(cache =>
        cache.match(request).then(resp => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return resp || fetchPromise;
        })
      )
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(resp => resp || fetch(request))
  );
});
