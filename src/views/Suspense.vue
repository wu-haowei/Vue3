<template>
  <div>
    <Suspense>
      <template #fallback>
        <Loading />
      </template>
      <template #default>
        <Dashboard :time="2000" />
      </template>
    </Suspense>
  </div>


</template>

<script setup>
import Dashboard from "../components/Dashboard.vue";
import Loading from "../components/Loading.vue";
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
