<script setup>
import InputBar from "../components/InputBar.vue";
import identify from "../components/identify.vue";
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();

import { ref } from "vue";

const num = ref(Math.floor(Math.random() * 10000).toString());
const clickpicHandler = () => {
  num.value = Math.floor(Math.random() * 10000).toString();
};

// 👉 全推播測試
const AllPushTest = async () => {
  try {
    const res = await loginService.SendAll();
    console.log(res);
  } catch (error) {
    console.error("全推播失敗:", error);
  }
};
</script>

<template>
  <div class="inputBar">
    <button @click="AllPushTest">推播測試</button>
    <h1>This is an inputBar page</h1>
    <InputBar v-model="num"></InputBar>
    <div class="verity-box">
      <identify :identifyCode="num" @clickpic-emit="clickpicHandler"></identify>
    </div>
  </div>
</template>
  
  <style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
  