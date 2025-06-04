const cacheName = 'apex-cache-v1';
const assets = ['index.html', 'style.css', 'script.js', '404.html'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assets))
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
