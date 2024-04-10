<script setup>
import { watch, computed, ref } from "vue";
import { usePiniaStore } from "@/stores/pinia.js";
import { useRoute } from "vue-router";
const route = useRoute();
const todo = usePiniaStore();

const vFocus = {
  mounted(el) {
    el.focus();
  },
};

const allDone = computed({
  get() {
    return todo.allDoneStatus;
  },
  set(val) {
    todo.toggleAllDone();
  },
});

watch(route, (newVal) => {
  const filter = newVal.params.filter || "all";
  todo.filter = filter;
});
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        v-focus
        v-model.trim="todo.input"
        @keyup.enter="todo.add"
      />
    </header>
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
        :disabled="todo.items.length === 0"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(item, index) in todo.displayItems"
          :key="item.id"
          :class="{
            completed: item.done,
            editing: todo.editTarget?.id === item.id,
          }"
          @dblclick="todo.edit(item.id)"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="item.done" />
            <label>{{ item.message }}</label>
            <button class="destroy" @click="todo.remove(item.id)"></button>
          </div>
          <input
            class="edit"
            v-focus
            v-if="todo.editTarget?.id === item.id"
            v-model="todo.editTarget.message"
            @keyup.enter="todo.editDone"
            @keyup.esc="todo.editCancel"
            @blur="todo.editCancel"
          />
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count"></span>
      <ul class="filters">
        <li>
        <RouterLink to="/ToDoList">All</RouterLink>
        </li>
        <li>
        <RouterLink to="/active">Active</RouterLink>
        </li>
        <li>
          <!-- <router-link to="/completed">Completed</router-link> -->
        <RouterLink to="/completed">Completed</RouterLink>

        </li>
      </ul>
      <button
        class="clear-completed"
        v-show="todo.doneCount > 0"
        @click="todo.removeCompleted"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style>
@import '@/assets/index.css';

.filters li a.router-link-exact-active {
  border-color: rgba(175, 47, 47, 0.2);
}
</style>




