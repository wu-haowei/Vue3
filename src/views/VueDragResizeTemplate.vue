<template>
  <!-- https://github.com/SortableJS/vue.draggable.next/tree/master -->
  <div class="row">
    <div class="col-2">
      <div class="form-group">
        <div
          class="btn-group-vertical buttons"
          role="group"
          aria-label="Basic example"
        >
          {{ list }}
          <button class="btn btn-secondary" @click="add">Add</button>
          <button class="btn btn-secondary" @click="replace">Replace</button>
        </div>

        <div class="form-check">
          <input
            id="disabled"
            type="checkbox"
            v-model="enabled"
            class="form-check-input"
          />
          <label class="form-check-label" for="disabled">DnD enabled</label>
        </div>
      </div>
    </div>

    <div class="col-6">
      <h3>Draggable {{ draggingInfo }}</h3>

      <draggable
        :list="list"
        :disabled="!enabled"
        item-key="name"
        class="list-Grid"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <div
            class="list-grid-item"
            :style="{ width: element.width, height: element.height }"
            :class="{ 'not-draggable': !enabled }"
            @mousedown="startResize($event, element)"
          >
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script setup>
import { ref, computed, defineOptions } from "vue";
import draggable from "vuedraggable";

const id = ref(1);

defineOptions({
  name: "VueDragResizeTemplate",
  components: {
    draggable,
  },
});

const enabled = ref(true);
const dragging = ref(false);

const list = ref([
  { name: "John", id: 0, width: "100px", height: "100px" },
  { name: "Joao", id: 1, width: "100px", height: "100px" },
  { name: "Jean", id: 2, width: "100px", height: "100px" },
  { name: "Alice", id: 3, width: "100px", height: "100px" },
  { name: "Bob", id: 4, width: "100px", height: "100px" },
  { name: "Charlie", id: 5, width: "100px", height: "100px" },
  { name: "David", id: 6, width: "100px", height: "100px" },
  { name: "Emma", id: 7, width: "100px", height: "100px" },
  { name: "Frank", id: 8, width: "100px", height: "100px" },
  { name: "Grace", id: 9, width: "100px", height: "100px" },
  { name: "Henry", id: 10, width: "100px", height: "100px" },
  { name: "Ivy", id: 11, width: "100px", height: "100px" },
  { name: "Jack", id: 12, width: "100px", height: "100px" },
  { name: "Kelly", id: 13, width: "100px", height: "100px" },
  { name: "Leo", id: 14, width: "100px", height: "100px" },
  { name: "Mona", id: 15, width: "100px", height: "100px" },
  { name: "Nancy", id: 16, width: "100px", height: "100px" },
  { name: "Oscar", id: 17, width: "100px", height: "100px" },
  { name: "Paul", id: 18, width: "100px", height: "100px" },
  { name: "Quincy", id: 19, width: "100px", height: "100px" },
]);

const resizingElement = ref(false);

const startResize = (event, element) => {
  resizingElement.value = element;
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
};

const resize = (event) => {
  if (!resizingElement.value) return;
  resizingElement.value.width =
    event.clientX - event.target.parentElement.offsetLeft + "px";
  resizingElement.value.height =
    event.clientY - event.target.parentElement.offsetTop + "px";
};

const stopResize = () => {
  resizingElement.value = null;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};
const draggingInfo = computed(() => (dragging.value ? "under drag" : ""));

const add = () => {
  list.value.push({ name: "Juan " + id.value, id: id.value++ });
};

const replace = () => {
  list.value = [{ name: "Edgard", id: id.value++ }];
};

const checkMove = (e) => {
  console.log("Future index: " + e.draggedContext.futureIndex);
};
</script>

<style scoped>
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}

.list-Grid {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.list-grid-item {
  /* width: 100px;
  height: 100px; */
  display: inline-block;
  background-color: #fff;
  border: solid 1px rgb(0, 0, 0, 0.2);
  padding: 10px;
  margin: 12px;
}
</style>
