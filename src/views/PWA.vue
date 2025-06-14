<template>
  <div>
    <button @click="subscribePush" :disabled="subscribing">
      {{ subscribing ? "訂閱中..." : "啟用通知" }}
    </button>
    <button @click="unsubscribeUser" v-if="subscribing">取消訂閱</button>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
import { LoginService } from "@/services/LoginService";

const loginService = new LoginService();
import { getServiceWorkerRegistration } from "../useServiceWorker.js";

const reg = ref(null);
const subscribing = ref(false);

const subscribePush = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      proxy.$toast.warning("通知權限被拒絕", 3000);

      subscribing.value = false;
      return;
    }
    const publicKey = await loginService.GetPublicKey();

    if (publicKey.result.success) {
      const basepublicKey = urlB64ToUint8Array(publicKey.data);
      // console.log("向後端請求公鑰:", publicKey);
      const subscription = await reg.value.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: basepublicKey,
      });
      // console.log("訂閱成功:", subscription);
      const isSubscribe = await loginService.Subscribe(subscription);
      if (isSubscribe.result.success) {
        subscribing.value = subscription !== null;
        proxy.$toast.success("訂閱成功！", 1000);
      } else {
        throw new Error(publicKey.result.message);
      }
    } else {
      throw new Error(publicKey.result.message);
    }
  } catch (err) {
    subscribing.value = false;
    proxy.$toast.error("訂閱失敗", 3000);
  }
};

const unsubscribeUser = async () => {
  try {
    if (!window.confirm("確定要取消訂閱?")) {
      return;
    }

    const subscription = await reg.value.pushManager.getSubscription();

    if (!subscription) {
      proxy.$toast.info("目前沒有訂閱可取消", 3000);
      return;
    }

    const success = await subscription.unsubscribe();
    if (success) {
      // 通知後端取消訂閱
      subscribing.value = false;
      const result = await loginService.UnSubscribe(subscription);
      if (!result.result.success) {
        // throw new Error(result.result.message || "後端取消訂閱失敗");
        console.log(result.result.message || "後端取消訂閱失敗");
      }
      proxy.$toast.success("成功退訂", 1000);
    } else {
      throw new Error("取消訂閱失敗");
    }
  } catch (error) {
    console.error("取消訂閱時發生錯誤：", error);
    proxy.$toast.error(`取消訂閱失敗：${error.message}`, 3000);
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

  // console.log("Service Worker 註冊狀態:", reg.value);
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      reg.value.pushManager.getSubscription().then((subscription) => {
        // console.log("取得訂閱狀態", subscription);
        subscribing.value = subscription !== null;
        if (subscribing.value) {
          // console.log("✅ 已訂閱推播");
        } else {
          // console.log("🚫 尚未訂閱");
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


