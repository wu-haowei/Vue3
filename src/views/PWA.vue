<template>
  <div>
    <button @click="subscribePush" :disabled="subscribing">
      {{ subscribing ? "訂閱中..." : "啟用通知" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { LoginService } from "@/services/LoginService";

const loginService = new LoginService();
import { getServiceWorkerRegistration } from "../useServiceWorker.js";

const reg = ref(null);
const subscribing = ref(false);

const subscribePush = async () => {
  console.log("訂閱推播開始");

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("通知權限被拒絕");
      subscribing.value = false;
      return;
    }
    const publicKey = await loginService.GetPublicKey();
    const basepublicKey = urlB64ToUint8Array(publicKey);
    console.log("向後端請求公鑰:", publicKey);

    const subscription = await reg.value.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: basepublicKey,
    });

    console.log("訂閱成功:", subscription);
    await loginService.Subscribe(subscription);
    subscribing.value = subscription !== null;
    alert("訂閱成功！");
  } catch (err) {
    console.error("訂閱失敗2:", err);
    subscribing.value = false;
    alert("訂閱失敗");
  }
};


//https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
onMounted(async () => {
  reg.value = await getServiceWorkerRegistration();

  console.log("Service Worker 註冊狀態:", reg.value);
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      reg.value.pushManager.getSubscription().then((subscription) => {
        console.log("取得訂閱狀態", subscription);
        subscribing.value = subscription !== null;
        if (subscribing.value) {
          console.log("✅ 已訂閱推播");
        } else {
          console.log("🚫 尚未訂閱");
        }
      });
    } catch (err) {
      console.error("❌ Service Worker 註冊失敗或無法取得訂閱", err);
    }
  } else {
    console.warn("❌ 瀏覽器不支援 Service Worker 或 Push");
  }
});
</script>


