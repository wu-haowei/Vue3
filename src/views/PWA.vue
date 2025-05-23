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

// 👉 base64 轉 Uint8Array（推播訂閱需要）
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

// 取得 VAPID 公鑰 + 訂閱推播
async function subscribeToPush() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  // 向後端請求公鑰
  loginService
    .GetPublicKey()
    .then(async (res) => {
      console.log("向後端請求公鑰:", res);
      // 建立訂閱
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(res.trim()),
      });

      console.log("訂閱成功:", subscription);
      loginService
        .Subscribe(subscription)
        .then((res) => {
          console.log("推播訂閱已送出:", subscription);
        })
        .catch((error) => {
          console.error("訂閱失敗:", error);
        });
    })
    .catch((error) => {
      console.error("取得 VAPID 公鑰失敗:", error);
    });
}

async function AllPushTest() {
  loginService
    .SendAll()
    .then(async (res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error("失敗:", error);
    });
}

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

      // 👉【新增】取得並註冊推播訂閱
      subscribeToPush();
    } else {
      message.value = "未允許推播通知";
    }
  });
}

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

onMounted(() => {
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
});

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
