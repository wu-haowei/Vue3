<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import axios from "axios";
import { ref } from "vue";






const count = ref(0);


// const add = () => {
//   count.value = ++count.value;
//   axios
//     .get("api/v1/opendata/t187ap05_P")
//     .then((response) => {
//       if (response.status == 200) {
//         console.log(response);
//       }
//     })
//     .catch((error) => console.log(error));
// };


const add = () => {
  count.value = ++count.value;
  axios
    .get("api/v1/opendata/t187ap05_P")
    .then((response) => {
      if (response.status == 200) {
        console.log(response);
      }
    })
    .catch((error) => console.log(error));
};

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/twse">twse</RouterLink>
        <RouterLink to="/inputbar">驗證碼</RouterLink>
        <RouterLink to="/validate">表單驗證</RouterLink>
        <RouterLink to="/Router">路由守衛</RouterLink>
        <RouterLink to="/Vuex">Vuex</RouterLink>
        <RouterLink to="/Suspense">Suspense</RouterLink>
        <RouterLink to="/Canvas">簽名檔</RouterLink>
        <RouterLink to="/Notion">Notion</RouterLink>
        <RouterLink to="/ToDoList">ToDoList</RouterLink>


        <button @click="add">Count is: {{ count }}</button>
      </nav>

    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}


</style>
