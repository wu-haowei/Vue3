<template>
  <div :class="['toast-container', position]">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      :class="['toast', toast.type]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  position: {
    type: String,
    default: "top-right",
  },
});

const toasts = ref([]);

// 通用函式
function addToast(type, message, duration = 3000) {
  const toast = { type, message };
  toasts.value.push(toast);

  setTimeout(() => {
    toasts.value.shift();
  }, duration);
}

// 提供各種型別
function warningToast(message, duration) {
  addToast("warning", message, duration);
}
function infoToast(message, duration) {
  addToast("info", message, duration);
}
function successToast(message, duration) {
  addToast("success", message, duration);
}
function errorToast(message, duration) {
  addToast("error", message, duration);
}

// 提供給外部使用
defineExpose({ warningToast, infoToast, successToast, errorToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  padding: 10px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  color: white;
  font-weight: bold;
}

/* 類型樣式 */
.toast.info {
  background-color: #2196f3;
}
.toast.success {
  background-color: #4caf50;
}
.toast.warning {
  background-color: #ff9800;
}
.toast.error {
  background-color: #f44336;
}

/* 支援的位置樣式 */
.top-right {
  top: 10px;
  right: 10px;
  align-items: flex-end;
}
.top-left {
  top: 10px;
  left: 10px;
  align-items: flex-start;
}
.bottom-right {
  bottom: 10px;
  right: 10px;
  align-items: flex-end;
}
.bottom-left {
  bottom: 10px;
  left: 10px;
  align-items: flex-start;
}
</style>
