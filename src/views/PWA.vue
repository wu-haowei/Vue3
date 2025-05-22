<template>
  <div>
    <h1>Vite PWA with Push Notification Demo</h1>

    <button @click="requestNotificationPermission" v-if="!permissionGranted">
      允許推播通知
    </button>

    <button @click="triggerTestNotification" v-if="permissionGranted">
      發送測試通知
    </button>

    <button v-if="deferredPrompt && !isInstalled" @click="installPWA">安裝應用程式</button>

    <p v-if="message">{{ message }}</p>
    <p>安裝狀態：{{ isInstalled ? "已安裝" : "未安裝" }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const permissionGranted = ref(false);
const deferredPrompt = ref(null);
const message = ref("");
const isInstalled = ref(false);

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    message.value = "瀏覽器不支援推播通知";
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      permissionGranted.value = true;
      message.value = "已允許推播通知";
    } else {
      message.value = "未允許推播通知";
    }
  });
}

function triggerTestNotification() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
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
  deferredPrompt.value.userChoice.then(choiceResult => {
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
