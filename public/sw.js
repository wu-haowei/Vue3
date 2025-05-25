const cacheName = '暫存';//離線緩存的名稱
const staticAssets = [//離線緩存的檔案
];
//進入Service Worker的安裝事件
self.addEventListener('install', async function (event) {
    console.log('[SW] 安裝(Install) Service Worker!', event);
});
//功能性的需求(如:擺脫舊的緩存)
self.addEventListener('activate', function (event) {
    console.log('[SW] 觸發(Activate) Service Worker!', event);
    event.waitUntil(self.clients.claim()); //使用Promise來知曉安裝所需的時間以及是否安裝成功。
});
//利用fetch事件，讀取緩存。fetch事件會監聽URL請求，
//如果在Service Worker緩存中，就從SW中取；如果不在，就通過網絡從服務器中取。
self.addEventListener('fetch', function (event) {
    //console.log('[SW] Fetch Service Worker!', event);
    const request = event.request;
    const url = new URL(request.url);
    // if (url.origin === location.origin) {//來源
    //     event.respondWith(cacheFirst(request));//緩存優先
    // } else {
    //     event.respondWith(networkFirst(request));//用網路上
    // }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);//檢查是否有緩存
    return cachedResponse || fetch(request);//調用或使用網路上來保存
}
////離線動態緩存的名稱
async function networkFirst(request) {
    const cache = await caches.open(cacheName);//使用指定的緩存名稱來打開緩存
    cache.addAll(staticAssets);

    const dynamicCache = await caches.open('動態暫存');
    try {
        const networkResponse = await fetch(request);//嘗試獲取網路
        dynamicCache.put(request, networkResponse.clone());//儲存起來
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);//查看有無暫存資料
        return cachedResponse || await caches.match('./fallback.json');
    }
}

//點擊通知
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;

    switch (action) {

        case 'confirm'://確認
            clients.openWindow("https://www.google.com");
            break;
        case 'cancel'://取消
            clients.openWindow("https://tw.yahoo.com");
            break;
        default://點擊其他部分
            clients.openWindow("https://www.msn.com");
            break;
    }
    notification.close();
    console.log('notificationclick action is', action);
})


self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    console.log('push',data);
    var title = data.title;//標題
    var message = data.message;//內文
    var OKurl = data.OKurl || "https://www.google.com";//確認連結
    var Nourl = data.Nourl || "https://tw.yahoo.com";//取消連結
    var Otherurl = data.Otherurl || "https://www.msn.com";//點擊其他部分
    // var icon = "images/push-icon.jpg";
    event.waitUntil(self.registration.showNotification(title, {
        body: message,
        icon: 'https://picsum.photos/300/200/?random1',
        badge: 'https://picsum.photos/300/200/?random1',
        data: {
            want: OKurl,
            dontwant: Nourl,
            other: Otherurl
        },
        requireInteraction: true,
        actions: [//設定通知上的選項
            { action: 'confirm', title: '確認', icon: 'https://picsum.photos/300/200/?random1' },
            { action: 'cancel', title: '取消', icon: 'https://picsum.photos/300/200/?random1' }
        ]
    }));
});