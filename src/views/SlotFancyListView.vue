<template>
  <div class="about">
    <div>
      <button @click="increment">Increment</button>

      <FancyButton v-slot="slotProps"><strong>Click</strong> me {{ slotProps.text }}</FancyButton>
      <SignedSlot>
        <template v-slot:header="{ text }">
          <h1>Here might be a page title {{ text }}</h1>
        </template>

        <template #default="slotProps">
          <p>A paragraph for the main content.{{ slotProps }}</p>
          <p>And another one.</p>
        </template>

        <template #footer>
          <p>Here's some contact info</p>
        </template>
      </SignedSlot>

    </div>
  </div>
</template>
<script setup>
import { ref, provide, reactive, watch, watchEffect, nextTick } from 'vue';
import FancyButton from '@/components/slots/FancyButton.vue';
import SignedSlot from '@/components/slots/SignedSlots.vue'

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
