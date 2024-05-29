<template>
  <div class="about">
    <input type="number" v-model.number="getMoney">
    父層：{{ getMoney }}
    <GrandChild />
    <Child />
  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick, readonly, computed } from 'vue';

import Child from '@/components/Inject/Child.vue';
const num = ref(0);

const getMoney = computed({
  get() {
    return num.value;
  },
  set(value) {
    if (value < 50)
      num.value = value;
    else {
      num.value = 49;
      console.log('超過數量');
    }
  }
})
provide('money', getMoney)

// provide('outSide', 'outSide')
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
