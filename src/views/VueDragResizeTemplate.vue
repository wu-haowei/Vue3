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
          <button class="btn btn-secondary" @click="add">Add</button>
        </div>

        <div class="form-check">
          <input
            id="disabled"
            type="checkbox"
            v-model="enabled"
            class="form-check-input"
          />
          <label class="form-check-label" for="disabled">enabled</label>
        </div>
      </div>
    </div>

    <div class="col-6" ref="parent">
      <draggable
        :list="list"
        :disabled="!enabled"
        item-key="name"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
        :class="{ listGrid: true, listGridBorder: enabled }"
      >
        <template #item="{ element }">
          <div
            class="list-grid-item"
            :key="element.width + '-' + element.height"
            :style="{
              width: element.width + 'px',
              height: element.height + 'px',
              background:
                !element.isPlaceholder && enabled ? '#e2b6b6' : 'transparent',
              border: enabled ? '1px solid #0fa9cf' : 'none',
              margin: enabled ? '0 -2px 0 1px' : '0',
            }"
            :class="{ 'not-draggable': !enabled }"
          >
            <span>
              <div v-show="enabled">
                <div>
                  <label :for="`checkbox_${element.id}`">
                    <input
                      type="checkbox"
                      :id="`checkbox_${element.id}`"
                      :name="`checkbox_${element.id}`"
                      v-model.lazy="element.isPlaceholder"
                    />
                    佔位</label
                  >
                  |
                  <button @click="edit(element)">編輯</button>
                  |
                  <button @click="del(element.id)">刪除</button>
                </div>
              </div>

              <HighChart
                v-show="!element.isPlaceholder"
                :width="element.width"
                :parent="getParent"
                :height="element.height"
                :chartData="element.data"
                :title="`ID：${element.name}`"
                @update:widthHeight="
                  (val) => {
                    console.log('update:widthHeight', val);
                    element.width = val.width;
                    element.height = val.height;
                  }
                "
              ></HighChart>
              <span v-if="element.isPlaceholder && enabled">{{
                element.id
              }}</span>
            </span>
          </div>
        </template>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script setup>
import { ref, computed, defineOptions, onMounted } from "vue";
import draggable from "vuedraggable";

import HighChart from "@/components/HighChart.vue";

defineOptions({
  name: "VueDragResizeTemplate",
  components: {
    draggable,
  },
});

const enabled = ref(true);

const dragging = ref(false);

const list = ref([
  // { name: "0", id: 0, width: 500, height: 500,data:[2, 3, 2, 4], isPlaceholder: false },
]);

const parent = ref(null);

const getParent = computed(() => {
  console.log("getParent");

  return parent.value ? parent.value.offsetWidth : 0;
});

const getId = computed(() => {
  return Math.max(...list.value.map((item) => item.id)) + 1;
});

const add = () => {
  list.value.unshift(setData(getId.value));
};

const del = (e) => {
  if (window.confirm(`確定刪除 ${e}`)) {
    list.value = list.value.filter((f) => {
      return f.id != e;
    });
  }
};

const edit = (e) => {
  var result1 = prompt("輸入寬度");

  if (result1 && !isNaN(Number(result1))) {
    var result2 = prompt("輸入高度");
    if (result2 && !isNaN(Number(result2))) {
      if (window.confirm(`你輸入 寬度：${result1} 高度：${result2}`)) {
        e.width = Number(result1);
        e.height = Number(result2);
      }
    } else {
      window.alert("於高度輸入取消");
    }
  } else {
    window.alert("於寬度輸入取消");
  }
};

const checkMove = (e) => {
  console.log("Future index: " + e.draggedContext.futureIndex);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generateRandomArray = () => {
  const arrayLength = getRandomInt(5, 20);
  const randomArray = [];

  for (let i = 0; i < arrayLength; i++) {
    randomArray.push(getRandomInt(1, 100));
  }

  return randomArray;
};

const setData = (index) => {
  let arr = [300, 400, 500, 600];
  return {
    name: index.toString(),
    id: index,
    width: arr[Math.floor(Math.random() * arr.length)],
    height: arr[Math.floor(Math.random() * arr.length)],
    data: generateRandomArray(),
    isPlaceholder: Math.floor(Math.random() * 1000) % 2 == 0 ? true : false,
    isDelete: false,
  };
};

onMounted(() => {
  for (let index = 20; index > 0; index--) {
    list.value.push(setData(index));
  }
  list.value.reverse();
});
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

.listGrid {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15;
  margin-left: -15;
}
.listGridBorder {
  border: 1px solid #ccc;
  margin: 0 -1px;
}

.list-grid-item {
  /* width: 300;
  height: 300; */
  /* border: 1px solid #0fa9cf;
  margin: 0 -2px 0 1px; */

  display: inline-block;
  border: solid 1 rgb(0, 0, 0, 0.2);
  padding: 10;
  margin: 12;
}
</style>
