const CACHE_NAME = 'pawheart-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  '/assets/icon.png',
  '/assets/dog.png',
  '/assets/cat.png',
  '/assets/dog-food.png',
  '/assets/cat-treats.png',
  '/assets/dog-toy.png',
  '/assets/cat-toy.png',
  '/assets/brush.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(res=>res||caches.match('/offline.html'))));
});
