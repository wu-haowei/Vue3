<template>

  <div>
    <signature :save="'保存2'" :canvasWidth="windowWidth * 0.9" :canvasHeight="innerHeight * 0.5"
      :clearButtonColor="'#FF8EFF'" Child ref="RefChildExpose" :isClear="false" :isConvertToImage="false"></signature>
    <p>当前窗口宽度: {{ windowWidth }}px</p>
    <p>当前窗口高度: {{ innerHeight }}px</p>

  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick, computed,onMounted } from 'vue';
import signature from '../elements/MyFirstCustomElements.ce.vue'




const windowWidth = ref(window.innerWidth)
const innerHeight = ref(window.innerHeight)

const RefChildExpose = ref(null);
onMounted(() => {
  console.log('onMounted');
  RefChildExpose.value.convertToImage()


})

</script>

<style scoped>
@media (min-width: 1024px) {}
</style>
