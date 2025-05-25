<template>
  <div>
    <h1>Vite PWA with Push Notification Demo</h1>

    <button @click="requestNotificationPermission" v-if="!permissionGranted">
      允許推播通知
    </button>

    <button @click="triggerTestNotification" v-if="permissionGranted">
      自我測試通知
    </button>

    <button v-if="deferredPrompt && !isInstalled" @click="installPWA">
      安裝應用程式
    </button>

    <p v-if="message">{{ message }}</p>
    <p>安裝狀態：{{ isInstalled ? "已安裝" : "未安裝" }}</p>

    <button @click="AllPushTest">全推播測試</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { LoginService } from "@/services/LoginService";

const loginService = new LoginService();

const permissionGranted = ref(false);
const deferredPrompt = ref(null);
const message = ref("");
const isInstalled = ref(false);

// 👉 base64 轉 Uint8Array
// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = atob(base64);
//   return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
// }

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// 👉 檢查是否已有訂閱，若無則訂閱
async function subscribeToPush() {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    console.log("已存在推播訂閱:", existingSubscription);
    message.value = "已訂閱推播，不需重複訂閱";
    return;
  }

  try {
    const publicKey = await loginService.GetPublicKey();
    console.log("向後端請求公鑰:", publicKey);

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publicKey.trim()),
    });

    

    console.log("新訂閱成功:", newSubscription);

    await loginService.Subscribe(newSubscription);
    message.value = "推播訂閱完成";
  } catch (error) {
    console.error("推播訂閱失敗:", error);
    message.value = "推播訂閱發生錯誤，請稍後再試";
  }
}

// 👉 全推播測試
async function AllPushTest() {
  try {
    const res = await loginService.SendAll();
    console.log(res);
  } catch (error) {
    console.error("全推播失敗:", error);
  }
}

// 👉 點擊後請求通知權限
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    message.value = "瀏覽器不支援推播通知";
    return;
  }

  Notification.requestPermission().then((permission) => {
    console.log(permission);

    if (permission === "granted") {
      permissionGranted.value = true;
      message.value = "已允許推播通知";
      subscribeToPush();
    } else {
      message.value = "未允許推播通知";
    }
  });
}

// 👉 本地測試推播（service worker showNotification）
function triggerTestNotification() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("測試推播", {
        body: "這是來自 Vite PWA 的推播通知",
        icon: "/pwa-192x192.png",
      });
    });
  }
}

// 👉 初始檢查是否已安裝 & 已訂閱推播
onMounted(async () => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    message.value = "可以安裝 PWA 了，請點擊安裝按鈕";
  });

  if (window.matchMedia("(display-mode: standalone)").matches) {
    isInstalled.value = true;
    message.value = "應用程式已安裝並以獨立視窗執行";
  }

  window.addEventListener("appinstalled", () => {
    isInstalled.value = true;
    message.value = "已成功安裝應用程式！";
    deferredPrompt.value = null;
  });

  // ✅ 新增：頁面載入時檢查是否已訂閱推播
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      permissionGranted.value = true;
      message.value = "你已訂閱推播通知";
    }
  }
});

// 👉 點擊安裝 PWA
function installPWA() {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  deferredPrompt.value.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      message.value = "已安裝應用程式";
      isInstalled.value = true;
    } else {
      message.value = "使用者取消安裝";
    }
    deferredPrompt.value = null;
  });
}
</script>


<style scoped>
button {
  margin: 1rem 0;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
