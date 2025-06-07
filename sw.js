importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const DB_NAME = 'analytics-db';
const STORE_NAME = 'events';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveEvent(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).add(data);
  });
}

async function sendStoredEvents() {
  const db = await openDB();
  return new Promise(resolve => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.openCursor().onsuccess = async e => {
      const cursor = e.target.result;
      if (cursor) {
        try {
          await fetch('/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cursor.value)
          });
          store.delete(cursor.key);
        } catch (err) {
          return;
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
  });
}

workbox.precaching.precacheAndRoute([
  {url: '/', revision: '1'},
  {url: '/index.html', revision: '1'},
  {url: '/offline.html', revision: '1'},
  {url: '/assets/css/main.css', revision: '1'},
  {url: '/assets/js/main.js', revision: '1'}
]);

workbox.routing.registerRoute(
  ({request}) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst()
);

workbox.routing.setCatchHandler(async () => caches.match('/offline.html'));

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.url.endsWith('/analytics') && request.method === 'POST') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch (err) {
        const clone = request.clone();
        let data;
        try {
          data = await clone.json();
        } catch (e) {
          data = await clone.text();
        }
        await saveEvent(data);
        if ('sync' in self.registration) {
          self.registration.sync.register('analytics-sync');
        } else {
          sendStoredEvents();
        }
        return new Response(null, { status: 202 });
      }
    })());
  }
});

self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(sendStoredEvents());
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(sendStoredEvents());
});
