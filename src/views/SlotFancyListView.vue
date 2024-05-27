<template>

  <div class="about">
    <FancyList api-url="url" :per-page="10">
      <template #item="{ body, username, likes }">
        <div class="item">
          <p>{{ body }}</p>
          <p class="meta">by {{ username }} | {{ likes }} likes</p>
        </div>
      </template>
    </FancyList>
  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick,onMounted } from 'vue';
import FancyList from '@/components/slots/FancyList.vue';


</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.meta {
  font-size: 0.8em;
  color: #42b883;
}
</style>
