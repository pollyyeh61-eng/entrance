// 定義快取名稱
const CACHE_NAME = 'holy-hair-v1';

// 定義需要快取的檔案路徑 (請根據你的實際檔案清單修改)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo512.png' // 確保這個圖片檔名與你上傳的一致
];

// 1. 安裝階段：將資源存入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('正在快取靜態資源');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 激活階段：清理舊的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('清理舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. 攔截請求：優先從快取抓取，若無則連網下載
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 快取命中則回傳，否則發送網路請求
        return response || fetch(event.request);
      })
  );
});