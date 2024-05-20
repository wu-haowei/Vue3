<script setup>
import { ref } from "vue"
const count = ref(0);
</script>

<template>
  <div class="tab">
    Posts component  {{ count }}
    <button @click="count++">
      +
    </button>
  </div>
</template>