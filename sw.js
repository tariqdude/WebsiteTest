importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  {url: '/', revision: '1'},
  {url: '/index.html', revision: '1'},
  {url: '/offline.html', revision: '1'},
  {url: '/assets/css/main.css', revision: '1'},
  {url: '/assets/js/main.js', revision: '1'},
  {url: '/assets/lang/en.json', revision: '1'},
  {url: '/assets/lang/es.json', revision: '1'}
]);

workbox.routing.registerRoute(
  ({request}) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst()
);

workbox.routing.setCatchHandler(async () => caches.match('/offline.html'));
