<template>
  <div>
    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <Teleport to="body">
      <!-- 使用这个 modal 组件，传入 prop -->
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>Custom Header</h3>
        </template>
      </modal>
    </Teleport>
  </div>
</template>
<script setup>
import Modal from "../components/Teleport.vue";
import { ref } from 'vue'
const showModal = ref(false)
</script>