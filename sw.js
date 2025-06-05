const CACHE_NAME = 'site-cache-v2';
const OFFLINE_URL = 'offline.html';

const CORE_ASSETS = [
  '/',
  'index.html',
  OFFLINE_URL,
  'styles.css',
  'scripts.js',
  '404.html',
  'manifest.json',
  'robots.txt',
  'sitemap.xml'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
        return res;
      }).catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(async cache => {
        const cached = await cache.match(event.request);
        const fetched = fetch(event.request).then(resp => {
          cache.put(event.request, resp.clone());
          return resp;
        });
        return cached || fetched;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(resp => {
        caches.open(CACHE_NAME).then(c => c.put(event.request, resp.clone()));
        return resp;
      });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notification';
  const options = { body: data.body || '', icon: 'https://placehold.co/96x96' };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('sync', event => {
  if(event.tag === 'sync-forms') {
    event.waitUntil(handleFormSync());
  }
  if(event.tag === 'sync-analytics') {
    event.waitUntil(handleAnalyticsSync());
  }
});

// IndexedDB helpers in SW
function openDB(name, store){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name,1);
    req.onupgradeneeded = () => req.result.createObjectStore(store, {autoIncrement:true});
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
const formDB = openDB('form-store','forms');
const analyticsDB = openDB('analytics-store','events');

async function handleFormSync(){
  const db = await formDB;
  const tx = db.transaction('forms','readwrite');
  const store = tx.objectStore('forms');
  const all = await store.getAll();
  await Promise.all(all.map(entry => fetch(entry.url,{method:'POST',body:new URLSearchParams(entry.data)})));
  store.clear();
  await new Promise(r=>tx.oncomplete=r);
}

async function handleAnalyticsSync(){
  const db = await analyticsDB;
  const tx = db.transaction('events','readwrite');
  const store = tx.objectStore('events');
  const all = await store.getAll();
  await Promise.all(all.map(ev => fetch('/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(ev)})));
  store.clear();
  await new Promise(r=>tx.oncomplete=r);
}
