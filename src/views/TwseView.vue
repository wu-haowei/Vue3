<script setup>
import axios from 'axios'
import { onMounted } from 'vue';


const cja =  () => {
  console.log(`The initial count is 123.`)
   axios.get('api/v1/opendata/t187ap05_P')
    .then((response) => {
      if (response.status == 200) { console.log(response) }
    })
    .catch((error) =>
      console.log(error)
    );
};


// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is 123.`)
  cja();
});
</script>


<template>
  <div class="twse">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .twse {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
