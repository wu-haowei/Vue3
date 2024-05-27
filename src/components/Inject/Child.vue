<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick,inject,computed } from 'vue';
import GrandChild from '@/components/Inject/GrandChild.vue';
// provide('middleSide', 'middleSide')
const money = inject('money', -1)


</script>

<template>
  <input type="number" v-model.number="money">
  子層：{{ money }}
  <GrandChild />

</template>