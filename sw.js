// 定義快取名稱，每次更新內容時可以修改版本號（例如 v1 -> v2）
const CACHE_NAME = 'vitality-hair-v2';

// 定義需要快取的檔案路徑（讓客人在沒網路時也能看到頁面）
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/沙龍.png',
  '/接待區.png',
  '/造型.png',
  '/洗髮.png',
  '/hair1.png',
  '/hair2.png',
  '/hair3.png',
  '/hair4.png',
  '/hair5.png'
];

// 1. 安裝階段：將資源存入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('VITALITY 資源已進入快取');
        // 使用 cache.addAll 存入所有清單
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // 讓新版 SW 立即生效
  );
});

// 2. 激活階段：清理舊版本的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('正在移除舊版快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // 確保安裝後立即控制所有分頁
});

// 3. 攔截請求：優先從快取抓取，若無則連網下載
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有資料就用快取的，否則就從網路抓取
        return response || fetch(event.request);
      })
  );
});

