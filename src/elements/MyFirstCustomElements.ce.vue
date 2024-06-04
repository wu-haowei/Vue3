<template>
  <div>
    <canvas ref="canvas" :style="{ backgroundColor: canvasColor }"></canvas>
    <div :style="{ display: 'flex', width: canvasWidth + 'px' }">
      <button @click="convertToImage" :class="{ greenButton: true }"
        :style="{ marginRight: '0.1em', backgroundColor: imageButtonColor }">{{ props.save
        }}</button>
      <button @click="clear" :class="{ redButton: true }"
        :style="{ marginLeft: '0.1em', backgroundColor: clearButtonColor }">{{
          props.clear }}</button>
    </div>
    <!-- <div id="image">
      <img :src="img">
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, inject, watch, computed } from "vue";


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
  },
  canvasWidth: {
    type: Number,
    default: 500,
    required: false
  },
  canvasHeight: {
    type: Number,
    default: 250,
    required: false
  },
  imageButtonColor: {
    type: String,
    default: "#4CAF50",
    required: false
  },
  clearButtonColor: {
    type: String,
    default: '#FF5733',
    required: false
  },
  canvasColor: {
    type: String,
    default: "bisque",
    required: false
  },
})


const img = ref(null);
const canvas = ref(null);
const ctx = ref(null);


const getCanvasWidth = computed({
  get() {
    return props.canvasWidth;
  }
})
const getCanvasHeight = computed({
  get() {
    return props.canvasHeight;
  }
})

//初始化
const canvasMounted = () => {
  if (window.devicePixelRatio) {
    canvas.value.style.width = getCanvasWidth.value + "px";
    canvas.value.style.height = getCanvasHeight.value + "px";
    canvas.value.width = getCanvasWidth.value * window.devicePixelRatio;
    canvas.value.height = getCanvasHeight.value * window.devicePixelRatio;
    ctx.value.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}
//改變寬高度
watch(
  () => props.canvasWidth,
  () => {
    canvasMounted();
  }
);
watch(
  () => props.canvasHeight,
  () => {
    canvasMounted();
  }
);

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  // let width = props.canvasWidth,
  //   height = props.canvasHeight;

  // if (window.devicePixelRatio) {
  //   canvas.value.style.width = props.canvasWidth + "px";
  //   canvas.value.style.height = props.canvasHeight + "px";
  //   canvas.value.width = props.canvasWidth * window.devicePixelRatio;
  //   canvas.value.height = height * window.devicePixelRatio;
  //   ctx.value.scale(window.devicePixelRatio, window.devicePixelRatio);
  // }
  canvasMounted();

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
  // console.log(image);
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
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */

canvas {
  background: #eee;
}

.red-button,
.redButton,
.greenButton,
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

.red-button:hover,
.green-button:hover,
.redButton:hover,
.greenButton:hover {
  opacity: 0.8;
  /* Reduce opacity on hover for visual feedback */
}
</style>