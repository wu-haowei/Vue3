<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import store from "@/stores/stores";
import AppFormFieId from "../components/AppFormFieId.vue";



const isConfirmed = ref(false);
const Name = ref('');
const Accounr = ref('');

const increment = () => {
  store.commit('increment');
}

const asyncIncrement = () => {
  store.dispatch('asyncIncrement');
}
const logIn = (data) => {

  console.log(data);


  store.dispatch("logIn", {
    token: getGUID(),
    account: data["Account"],
    userName: data["Name"],
  });
}

const test = (value) => {
  logIn(value);
  formRef1.value.resetForm();
};

const getGUID = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

watch(isConfirmed, (val, oldVal) => {
  console.log(oldVal);
  console.log(val);
})

const formRef1 = ref(null);
</script>

<template>
  <div>
    <p>Count: {{ store.state.count }}</p>
    <button @click="increment">Increment</button>
    <button @click="asyncIncrement">Async Increment</button>
    <VForm ref="formRef1" v-slot="{ errors, meta, resetForm }" @submit="test">
      <AppFormFieId name="Account" lable="Account" rules="required" placeholder="任意輸入"></AppFormFieId>
      <AppFormFieId name="Name" lable="Name" rules="required" placeholder="任意輸入"></AppFormFieId>
      <ErrorMessage name="password" />
      <button type="submit">登入</button>
    </VForm>

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