<script setup>
import { inject } from 'vue'
// const outmessage = inject('outSide', 'defualt outmessage')
// const middlemessage = inject('middleSide', 'defualt middlemessage')

const money = inject('money', -2)//名稱/預設值
</script>
<template>
  <br />
  <input type="number" v-model.number="money">
  孫層：{{ money }}
</template>