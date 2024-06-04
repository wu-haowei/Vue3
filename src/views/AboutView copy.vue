<template>

  <div >
    <signature :save="'保存2'" :canvasWidth="windowWidth * 0.9" :canvasHeight="innerHeight * 0.5" :clearButtonColor="'#FF8EFF'"></signature>
    <p>当前窗口宽度: {{ windowWidth }}px</p>
    <p>当前窗口高度: {{ innerHeight }}px</p>

  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick, computed } from 'vue';
import signature from '../elements/MyFirstCustomElements.ce.vue'




const windowWidth = ref(window.innerWidth)
const innerHeight = ref(window.innerHeight)



</script>

<style scoped>
@media (min-width: 1024px) {}
</style>
