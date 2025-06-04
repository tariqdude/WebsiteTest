const cacheName = 'apex-cache-v5';
const assets = [
  'index.html',
  'style.min.css',
  'script.min.js',
  '404.html',
  'offline.html',
  'privacy.html',
  'terms.html',
  'manifest.json',
  'icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'phrases.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=EB+Garamond:opsz,wght@8..144,400..800&display=swap'
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
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          caches.open('dynamic-cache').then(cache => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
