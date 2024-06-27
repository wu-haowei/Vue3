<template>

  <div class="about">
    <h1 class="text-base" style="display: none;">IsRayNotArray</h1>
    <!-- <h1>This is an about page</h1> -->
    <!-- <my-first-custom-element @update-image="updateImage" ></my-first-custom-element> -->
    <!-- <signature-file-canvas-element @update-image="updateImage" :saveUp="outSideSaveNum" :save="'保存'" :clear="'清除'"></signature-file-canvas-element> -->
    <!-- <div id="image">
      <img :src="imgref">
    </div> -->
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">Increment</button>
    </div>
  </div>
</template>
<script setup>



import { ref, provide, reactive, watch, watchEffect, nextTick, computed, defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

//更新
onBeforeRouteUpdate(() => {
  console.log('onBeforeRouteUpdate');
})
onBeforeRouteLeave(() => {
  console.log('onBeforeRouteLeave');

})


// const AsyncComp = defineAsyncComponent(() =>
//   import('../components/AppFormFieId.vue')

// )
// const AsyncComp = defineAsyncComponent({
//   // 加载函数
//   loader: () => import('../components/AppFormFieId.vue'),
//   // 加载异步组件时使用的组件
//   loadingComponent: LoadingComponent,
//   // 展示加载组件前的延迟时间，默认为 200ms
//   // delay: 200,
//   // 加载失败后展示的组件
//   // errorComponent: ErrorComponent,
//   // 如果提供了一个 timeout 时间限制，并超时了
//   // 也会显示这里配置的报错组件，默认值是：Infinity
//   // timeout: 3000
// })

const imgref = ref('');
const outSideSaveNum = ref(0);
const updateImage = (img) => {
  imgref.value = img.detail[0];
}
const obj = reactive({ count: '0', count1: '0' });
const arr = reactive({ arr1: '0', arr2: '0' });
const count = ref(0);

watch(count, () => {
  console.log(`Count 更新前${count.value}`);
}, { flush: 'pre' });

const increment = () => {
  count.value++;
};

// watchEffect(async () => {
//   obj.count1 = obj.count;

//   arr.arr1 = obj.count1;
//   arr.arr2 = arr.arr1
//   setTimeout(() => {
//     obj.count = new Date().getTime();
//   }, 1);
// })

const sendMessage = (e) => {
  outSideSaveNum.value++;
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
