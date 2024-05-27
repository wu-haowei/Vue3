<template>
  <ul>
    <li v-if="!items.length">
      Loading...
    </li>
    <li v-for="item in items">
      <slot name="item" v-bind="item" />
    </li>
  </ul>
</template>


<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  'api-url': { type: String, required: true },
  'per-page': { type: String, required: true }
});

const items = ref([]);

onMounted(() => {
  setTimeout(() => {
    items.value = [
      { body: 'Scoped Slots Guide', username: 'Evan You', likes: 20 },
      { body: 'Vue Tutorial', username: 'Natalia Tepluhina', likes: 10 }
    ]
  }, 1000)
})



</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 5px;
  background: linear-gradient(315deg, #42d392 25%, #647eff);
}

li {
  padding: 5px 20px;
  margin: 10px;
  background: #fff;
}
</style>
