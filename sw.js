// 定義快取名稱，每次更新內容時可以修改版本號（例如 v1 -> v2）
const CACHE_NAME = 'vitality-hair-v2';
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

// 1. 監聽瀏覽器的安裝提示事件
window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止瀏覽器自動彈出預設視窗
    e.preventDefault();
    // 將事件存起來
    deferredPrompt = e;
    // 顯示您的引導區塊 (原本可能是隱藏的)
    document.getElementById('install-guide').style.display = 'flex';
});

// 2. 當使用者點擊您的文字區塊時執行
installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        // 彈出安裝對話框
        deferredPrompt.prompt();
        // 等待使用者回應
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`使用者選擇了: ${outcome}`);
        // 執行過後清空，不能重複使用
        deferredPrompt = null;
        // 隱藏引導區塊
        document.getElementById('install-guide').style.display = 'none';
    } else {
        // 如果瀏覽器不支持直接觸發 (例如 iOS Safari)
        alert("請點擊瀏覽器下方的『分享』按鈕，然後選擇『加入主畫面』即可完成安裝！");
    }
});

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


