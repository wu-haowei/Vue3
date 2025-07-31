<script setup>
const props = defineProps({
  show: Boolean,
  width: {
    type: [String, Number],
    default: '300px',
  },
  height:  {
    type: [String, Number],
    default: '80vh',
  },

});
</script>

<template>
  <Transition name="modal">
    <div v-show="show" class="modal-mask">
      <div class="modal-container" :style="{ width: props.width, height: props.height }">
        <div class="modal-header">
          <slot name="header">沒有標題</slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  max-height: 80vh; /* 限制高度不超過畫面高度的 80% */
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column; /* 讓內部可以分區域調整 */
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  overflow-y: auto;
  flex: 1; /* 讓 body 撐開剩下空間並可捲動 */
}

.modal-default-button {
  float: right;
}

/*
 * 对于 transition="modal" 的元素来说
 * 当通过 Vue.js 切换它们的可见性时
 * 以下样式会被自动应用。
 *
 * 你可以简单地通过编辑这些样式
 * 来体验该模态框的过渡效果。
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>