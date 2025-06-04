importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  {url: '/', revision: null},
  {url: '/index.html', revision: null},
  {url: '/styles.css', revision: null},
  {url: '/main.js', revision: null}
]);
workbox.routing.registerRoute(({request}) => request.mode === 'navigate', new workbox.strategies.NetworkFirst({cacheName: 'pages'}));
