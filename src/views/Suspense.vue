<script setup>
import axios from "axios";
import Dashboard from "../components/Dashboard.vue";
import Loading from "../components/Loading.vue";




</script>

<template>
  <Suspense>
    <template #fallback>
      <Loading />
    </template>
    <template #default>
      <Dashboard :time="2000" />
    </template>
  </Suspense>
</template>
  
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
  