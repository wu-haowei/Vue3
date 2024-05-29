<template>
  <div>
    <canvas ref="canvas" width="500" height="250"></canvas>
    <div style="display: flex;width:500px;">
      <button @click="convertToImage" class="green-button" style="margin-right: 0.1em;">{{ props.save
        }}</button>
      <button @click="clear" class="red-button" style="margin-left: 0.1em;">{{ props.clear }}</button>
    </div>
    <!-- <div id="image">
      <img :src="img">
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, inject, watch } from "vue";


const props = defineProps({
  save: {
    type: String,
    default: '保存',
    required: false
  },
  clear: {
    type: String,
    default: '清除',
    required: false
  },
  outSideSave: {
    type: Number,
    default: 0,
    required: false
  }
})

// watch(
//   () => props.saveUp,
//   (count, prevCount) => {
//     // console.log('person 改變了', count, prevCount)
//     convertToImage();
//   }
// )

const img = ref(null);
const canvas = ref(null);
const ctx = ref(null);

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  let width = canvas.value.width,
    height = canvas.value.height;

  if (window.devicePixelRatio) {
    canvas.value.style.width = width + "px";
    canvas.value.style.height = height + "px";
    canvas.value.height = height * window.devicePixelRatio;
    canvas.value.width = width * window.devicePixelRatio;
    ctx.value.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  canvas.value.addEventListener('mousedown', function (evt) {
    var mousePos = getMousePos(canvas.value, evt);
    ctx.value.beginPath();
    ctx.value.moveTo(mousePos.x, mousePos.y);
    evt.preventDefault();
    canvas.value.addEventListener('mousemove', mouseMove, false);
  });

  canvas.value.addEventListener('mouseup', function () {
    canvas.value.removeEventListener('mousemove', mouseMove, false);
  }, false);

  canvas.value.addEventListener('touchstart', function (evt) {
    var touchPos = getTouchPos(canvas, evt);
    ctx.value.beginPath(touchPos.x, touchPos.y);
    ctx.value.moveTo(touchPos.x, touchPos.y);
    evt.preventDefault();
    canvas.value.addEventListener('touchmove', touchMove, false);
  });

  canvas.value.addEventListener('touchend', function () {
    canvas.value.removeEventListener('touchmove', touchMove, false);
  }, false);
})
//清除
const clear = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  img.value = '';
}
const imageEmit = defineEmits(['update-image']);
//轉圖
const convertToImage = () => {
  var image = canvas.value.toDataURL("image/png");
  // img.value = image;
  console.log(image);
  imageEmit('update-image', image);
}

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// touch
const getTouchPos = (canvas, evt) => {
  var rect = canvas.value.getBoundingClientRect();
  return {
    x: evt.touches[0].clientX - rect.left,
    y: evt.touches[0].clientY - rect.top
  };
}

const touchMove = (evt) => {
  var touchPos = getTouchPos(canvas, evt);

  ctx.value.lineWidth = 2;
  ctx.value.lineCap = "round"; // 繪制圓形的結束線帽
  ctx.value.lineJoin = "round"; // 兩條線條交匯時，建立圓形邊角
  ctx.value.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒 
  ctx.value.shadowColor = 'black'; // 邊緣顏色
  ctx.value.lineTo(touchPos.x, touchPos.y);
  ctx.value.stroke();
}

const mouseMove = (evt) => {
  var mousePos = getMousePos(canvas.value, evt);
  ctx.value.lineCap = "round";
  ctx.value.lineWidth = 2;
  ctx.value.lineJoin = "round";
  ctx.value.shadowBlur = 1;
  ctx.value.shadowColor = 'black';
  ctx.value.lineTo(mousePos.x, mousePos.y);
  ctx.value.stroke();
}

</script>



<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

canvas {
  background: #eee;
}



.red-button,
.green-button {
  flex: 1;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  font-weight: bold;
}

.red-button {
  background-color: #FF5733;
  /* Red color */
}

.green-button {
  background-color: #4CAF50;
  /* Green color */
}

.red-button:hover,
.green-button:hover {
  opacity: 0.8;
  /* Reduce opacity on hover for visual feedback */
}
</style>