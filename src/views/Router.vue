<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'


const isConfirmed = ref(false);


onBeforeRouteLeave((to, from) => {
  if (isConfirmed.value) return true;
  else {
    const answer = confirm(
      'Do you really want to leave? you have unsaved changes!'
    )
    // cancel the navigation and stay on the same page
    if (!answer) return false
    else return true;
  }
})

watch(isConfirmed, (val, oldVal) => {
})
</script>

<template>
  <div class="inputBar">
    <p>使用 Router 偵測是否異動未保存</p>
    <div class="verity-box">
      <input type="text" @change="isConfirmed = false"><br />
      <button @click="isConfirmed = true">Save</button>
    </div>
  </div>
</template>

<style scoped></style>