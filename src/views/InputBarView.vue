<script setup>
import InputBar from "../components/InputBar.vue";
import identify from "../components/identify.vue";

import { ref } from "vue";



const num = ref(Math.floor(Math.random() * 10000).toString());
const clickpicHandler=()=>{
    num.value=Math.floor(Math.random() * 10000).toString();
}


</script>

<template>
  <div class="inputBar">
    <h1>This is an inputBar page</h1>
    <InputBar v-model="num"></InputBar>
    <div class="verity-box">
      <identify
        :identifyCode="num" @clickpic-emit="clickpicHandler"
      ></identify>
    </div>
  </div>
</template>
  
  <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
  