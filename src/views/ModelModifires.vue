<template>

  <div class="about">
    <div>
      <ModelModifiresCompoents v-model.number.lazy.trim="rModelModifires"></ModelModifiresCompoents>
      <ModelModifiresCompoents v-model.specifyModifiers="isspecifyModifiers" class="outside"></ModelModifiresCompoents>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'



import ModelModifiresCompoents from '@/components/ModelModifires-Compoents.vue'
const rModelModifires = ref(0);
const isspecifyModifiers = ref(0);
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
