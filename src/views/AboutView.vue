
<template>

  <div class="about">
    <h1>This is an about page</h1>
    <my-first-custom-element></my-first-custom-element>
  </div>
</template>
<script setup>
// import Logger from "../lib/logger";

// Logger.error("This is an error log");

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

</style>
