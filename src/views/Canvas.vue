<template>
  <div>
    <canvas ref="canvas" width="600" height="300"></canvas>
    <button @click="clear">清除</button>
    <button @click="convertToImage">轉圖</button>
    <div id="image">
      <img :src="img">
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

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
//轉圖
const convertToImage = () => {
  var image = canvas.value.toDataURL("image/png");
  img.value = image;
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

canvas {
  background: #eee;
}
</style>
  