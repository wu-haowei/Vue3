<template>

  <div class="about">
    <!-- <h1>This is an about page</h1> -->
    <!-- <my-first-custom-element @update-image="updateImage" ></my-first-custom-element> -->
    <!-- <signature-file-canvas-element @update-image="updateImage" :saveUp="outSideSaveNum" :save="'保存'" :clear="'清除'"></signature-file-canvas-element> -->
    <!-- <div id="image">
      <img :src="imgref">
    </div> -->

    <!-- <input v-model="obj.count" />
    obj.count {{ obj.count }}
    obj.count1 {{ obj.count1 }}

    <input v-model="arr.arr1" />
    arr.arr1 {{ arr.arr1 }}
    arr.arr2 {{ arr.arr2 }} -->

    <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect,nextTick } from 'vue';

// import Logger from "../lib/logger";
// Logger.error("This is an error log");

// import signatureFileCanvasElement from "../components/identify.vue";


const imgref = ref('');
const outSideSaveNum = ref(0);
const updateImage = (img) => {
  imgref.value = img.detail[0];
}
const obj = reactive({ count: '0', count1: '0' });
const arr = reactive({ arr1: '0', arr2: '0' });


// watch(obj, (newVaule, oldVaule) => {
//   console.log('watch', newVaule, oldVaule);
// },
//  { immediate: true }//初始化 呼叫
// )


// watch(
//   () => obj.count,
//   () => {
//     console.log('obj.count');
//   }
// )


// watch(obj, (newVaule, oldVaule) => {
//   console.log('watch', newVaule, oldVaule);
// },
//  { immediate: true }//初始化 呼叫
// )





const count = ref(0);

// watch(count, () => {
//   nextTick(() => {
//     console.log('Count 已更新');
//   });
// }, { flush: 'post' });

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

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
