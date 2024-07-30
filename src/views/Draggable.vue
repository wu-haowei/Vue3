<template>
  <div>
    <div class="controls">
      <div class="trash-bin" @dragover="dragover($event)" @dragleave="dragleave" @drop="del_drop($event)"  @dragstart="del_dragstart($event)">
        Drop here to remove
        <div class="trash-item" v-for="(item, index) in outtitle" :key="index" draggable="true" :data-index="index" >
          {{ item }}
        </div>
      </div>
    </div>
    <table @dragstart="dragstart($event)" @dragend="dragend($event)" @dragover="dragover($event)" @drop="drop($event)">
      <thead>
        <tr>
          <th v-for="(name, index) in title" :key="index" draggable="true" class="animate">{{ name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>



  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";

const indata = ref([
  { Name: 'John', Age: 30, Country: 'USA' },
  { Name: 'Jane', Age: 25, Country: 'UK' },
  { Name: 'Paul', Age: 28, Country: 'Canada' },
]);

const title = ref(Object.keys(indata.value[0]));
const outtitle = ref([]);

const data = computed(() => {
  return indata.value.map(row => title.value.map(col => row[col]));
});

let dragged = null;

const dragstart = (event) => {
  if (event.target.tagName === 'TH') {
    dragged = event.target;
    event.dataTransfer.effectAllowed = 'move';
  }
};

const del_dragstart = (event) => {
  if (event.target.tagName === 'DIV') {
    dragged = event.target;
    event.dataTransfer.effectAllowed = 'move';
  }
};



const dragend = (event) => {
  dragged = null;
};

const dragover = (event) => {
  event.preventDefault();
  if (event.target.tagName === 'TH') {
    event.dataTransfer.dropEffect = 'move';
  }
};

const drop = (event) => {
  event.preventDefault();
  if (event.target.tagName === 'TH' && event.target !== dragged) {

    if (dragged.tagName!="DIV") {
      const headers = Array.from(dragged.parentNode.children);
      const fromIndex = headers.indexOf(dragged);
      const toIndex = headers.indexOf(event.target);
      [title.value[fromIndex], title.value[toIndex]] = [title.value[toIndex], title.value[fromIndex]];
      // Ensure Vue reactivity
      title.value = [...title.value];

    } else {
      const toIndex = outtitle.value.indexOf(dragged.textContent);
      title.value.push(outtitle.value[toIndex])
      outtitle.value.splice(toIndex, 1);
    }

  }
}

  const del_drop = (event) => {
    event.preventDefault();
    if (dragged) {
      const headerRow = dragged.parentNode;
      const index = Array.from(headerRow.children).indexOf(dragged);
      outtitle.value.push(title.value[index]);
      title.value.splice(index, 1);
      // Ensure Vue reactivity
      title.value = [...title.value];
    }
  };

  const dragleave = (event) => {
    // Optional: handle drag leave
  };


  onMounted(() => {

    title.value = Object.keys(this.indata[0])

  })

</script>



<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  cursor: move;
}

.controls {
  margin-bottom: 20px;
}

.trash-bin {
  width: 100%;
  border: 2px dashed #ddd;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #999;
}

.trash-bin.dragover {
  border-color: #333;
  color: #333;
}

.trash-bin .trash-item {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  cursor: move;
}

.animate {
  transition: all 0.3s ease;
}
</style>