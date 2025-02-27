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
              background: !element.isPlaceholder ? '#e2b6b6' : 'transparent',
            }"
            :class="{ 'not-draggable': !enabled }"
          >
            <span>
              <div>
                <div>
                  <!-- <label for="chartWidth">X：</label>
                  <input
                    id="chartWidth"
                    type="number"
                    v-model.lazy="element.width"
                    placeholder="寬度"
                    :max="2000"
                    :style="{ width: '50px' }"
                  />
                  <label for="chartHeight">Y：</label>
                  <input
                    id="chartHeight"
                    type="number"
                    v-model.lazy="element.height"
                    placeholder="高度"
                    :max="1000"
                    :style="{ width: '50px' }"
                  />
                -->
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
              <span v-if="element.isPlaceholder">{{ element.id }}</span>
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
  // { name: "1", id: 1, width: 500, height: 500,data:[3, 3, 2, 4], isPlaceholder: true },
  // { name: "2", id: 2, width: 400, height: 400,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "3", id: 3, width: 500, height: 500,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "4", id: 4, width: 500, height: 500,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "5", id: 5, width: 500, height: 500,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "6", id: 6, width: 500, height: 500,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "7", id: 7, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "8", id: 8, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "9", id: 9, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "10", id: 10, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "11", id: 11, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "12", id: 12, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "13", id: 13, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "14", id: 14, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "15", id: 15, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "16", id: 16, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "17", id: 17, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "18", id: 18, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "19", id: 19, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
  // { name: "20", id: 20, width: 300, height: 300,data:[1, 3, 2, 4], isPlaceholder: false },
]);

// const resizingElement = ref(false);

// const startResize = (event, element) => {
//   resizingElement.value = element;
//   document.addEventListener("mousemove", resize);
//   document.addEventListener("mouseup", stopResize);
// };

// const resize = (event) => {
//   if (!resizingElement.value) return;
//   resizingElement.value.width =
//     event.clientX - event.target.parentElement.offsetLeft + "";
//   resizingElement.value.height =
//     event.clientY - event.target.parentElement.offsetTop + "";
// };

// const stopResize = () => {
//   resizingElement.value = null;
//   document.removeEventListener("mousemove", resize);
//   document.removeEventListener("mouseup", stopResize);
// };
const parent = ref(null);

const getParent = computed(() => {
console.log('getParent');

  return parent.value ? parent.value.offsetWidth : 0;
});

const getId = computed(() => {
  return Math.max(...list.value.map((item) => item.id)) + 1;
});

const getlist = computed(() => {
  return list.value.filter((f) => !f.isDelete);
});

const add = () => {
  // list.value.unshift({
  //   name: getId.value,
  //   id: getId.value,
  //   width: 300,
  //   height: 300,
  //   isPlaceholder: true,
  // });
  list.value.unshift(setData(getId.value));
};

const del = (e) => {
  // list.value = list.value.filter((f) => {
  //   return f.id != e;
  // });

  if (window.confirm(`確定刪除 ${e}`)) {
    list.value.forEach((f) => {
      if (f.id == e) {
        f.isDelete = true;
      }
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
  margin: 0 -2px 0 1px;

  display: inline-block;
  border: solid 1 rgb(0, 0, 0, 0.2);
  padding: 10;
  margin: 12;
}
</style>
