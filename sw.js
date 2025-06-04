self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('fetch', e => {
  // simple passthrough
});

