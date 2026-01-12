const CACHE_NAME = 'vitality-hair-v3'; // 每次更新建議跳號
const ASSETS = [
    'index.html',
    'logo.png',
    'manifest.json'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
