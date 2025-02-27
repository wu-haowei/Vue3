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
          <!-- {{ list }} -->
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
             :key="element.width + '-' + element.height"
            :style="{
              width: element.width + 'px',
              height: element.height + 'px',
            }"
            :class="{ 'not-draggable': !enabled }"
          >
            <span v-if="!element.isPlaceholder">
              {{ element.name }}
              {{ element.height }}
              <HighChart
                v-if="!element.isPlaceholder"
                :width="element.width"
                :height="element.height"
                @update:widthHeight="
                  (val) => {
                    console.log('update:widthHeight', val);
                    element.width = val.width;
                    element.height = val.height;
                  }
                "
              ></HighChart>
            </span>
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

import HighChart from "@/components/HighChart.vue";

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
  { name: "John", id: 0, width: 500, height: 500, isPlaceholder: false },
  { name: "John", id: 20, width: 500, height: 500, isPlaceholder: true },
  { name: "Joao", id: 1, width: 400, height: 400, isPlaceholder: false },
  { name: "Jean", id: 2, width: 500, height: 500, isPlaceholder: false },
  { name: "Alice", id: 3, width: 500, height: 500, isPlaceholder: false },
  { name: "Bob", id: 4, width: 500, height: 500, isPlaceholder: false },
  { name: "Charlie", id: 5, width: 500, height: 500, isPlaceholder: false },
  { name: "David", id: 6, width: 300, height: 300, isPlaceholder: false },
  { name: "Emma", id: 7, width: 300, height: 300, isPlaceholder: false },
  { name: "Frank", id: 8, width: 300, height: 300, isPlaceholder: false },
  { name: "Grace", id: 9, width: 300, height: 300, isPlaceholder: false },
  { name: "Henry", id: 10, width: 300, height: 300, isPlaceholder: false },
  { name: "Ivy", id: 11, width: 300, height: 300, isPlaceholder: false },
  { name: "Jack", id: 12, width: 300, height: 300, isPlaceholder: false },
  { name: "Kelly", id: 13, width: 300, height: 300, isPlaceholder: false },
  { name: "Leo", id: 14, width: 300, height: 300, isPlaceholder: false },
  { name: "Mona", id: 15, width: 300, height: 300, isPlaceholder: false },
  { name: "Nancy", id: 16, width: 300, height: 300, isPlaceholder: false },
  { name: "Oscar", id: 17, width: 300, height: 300, isPlaceholder: false },
  { name: "Paul", id: 18, width: 300, height: 300, isPlaceholder: false },
  { name: "Quincy", id: 19, width: 300, height: 300, isPlaceholder: false },
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
    event.clientX - event.target.parentElement.offsetLeft + "";
  resizingElement.value.height =
    event.clientY - event.target.parentElement.offsetTop + "";
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
  margin-top: 35;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}

.list-Grid {
  border: 1px solid #ccc;
  margin: 0 -1px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15;
  margin-left: -15;
}

.list-grid-item {
  /* width: 300;
  height: 300; */
  border: 1px solid #0fa9cf;
  background: #e2b6b6;
  display: inline-block;
  border: solid 1 rgb(0, 0, 0, 0.2);
  padding: 10;
  margin: 12;
}
</style>
