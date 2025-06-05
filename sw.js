const cacheName = 'am-v2';
const offlineUrl = '/404.html';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(c => c.addAll([
    '/', '/index.html', '/about.html', '/services.html', '/404.html',
    '/assets/css/main.css', '/assets/js/main.js', '/assets/js/analytics.js'
    '/fonts/Inter.var.woff2', '/assets/img/hero-400.avif', '/assets/img/hero-800.avif', '/assets/img/hero-1600.avif', '/assets/img/hero-1200x630.avif', '/assets/img/logo-192.png', '/assets/img/logo-512.png'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const {destination} = e.request;
  if (destination === 'document') {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(cacheName).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match(offlineUrl))));
  } else {
    e.respondWith(caches.match(e.request).then(res => {
      const fetchPromise = fetch(e.request).then(r => {
        caches.open(cacheName).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => {});
      return res || fetchPromise.then(r => r).catch(() => caches.match(offlineUrl));
    }));
  }
});
