const cacheName = 'apex-cache-v2';
const assets = [
  'index.html',
  'style.css',
  'script.js',
  '404.html',
  'privacy.html',
  'terms.html',
  'manifest.json',
  'icon.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assets))
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
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.status === 404) {
                    return caches.match('404.html');
                }
                return response;
            }).catch(() => caches.match('404.html'))
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(resp => resp || fetch(event.request))
        );
    }
});
