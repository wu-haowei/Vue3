<template>
  <div>
    <div>
      <div :style="{ margin: 'auto', width: chartWidth*0.8 + 'px' }">
        <label for="chartWidth">X：</label>
        <input
          id="chartWidth"
          type="number"
          v-model.lazy="chartWidth"
          placeholder="寬度"
          :max="2000"
        />
      </div>
      <div :style="{ margin: 'auto', width: chartWidth*0.8 + 'px' }">
        <label for="chartHeight">Y：</label>
        <input
          id="chartHeight"
          type="number"
          v-model.lazy="chartHeight"
          placeholder="高度"
          :max="1000"
        />
      </div>
    </div>
    <Chart ref="chartComponent" :options="chartOptions"> </Chart>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from "vue";
import { Chart } from "highcharts-vue";

const emit = defineEmits(["update:widthHeight"]);

const props = defineProps({
  width: { type: Number, default: 300 },
  height: { type: Number, default: 200 },
});

const chartWidth = ref(props.width);
const chartHeight = ref(props.height);
const chartComponent = ref(null);

const chartOptions = ref({
  chart: {
    type: "line",
    width: (chartWidth.value * 0.8).toString(),
    height: (chartHeight.value * 0.8).toString(),
  },
  title: {
    text: "Vite + Highcharts",
    align: "center", // 讓標題置中
  },
  legend: {
    align: "center", // 圖例置中
  },
  series: [
    {
      name: "Data",
      data: [1, 3, 2, 4],
      dataLabels: {
        enabled: true,
        align: "center", // 數據標籤置中
      },
    },
  ],
});

// 監聽寬高變化，動態更新 Highcharts
watch([chartWidth, chartHeight], ([newWidth, newHeight]) => {
  emit("update:widthHeight", { width: newWidth, height: newHeight });
  if (chartComponent.value) {
    chartComponent.value.chart.update({
      chart: {
        width: (newWidth * 0.8).toString(),
        height: (newHeight * 0.8).toString(),
      },
    });
  }
});

// 確保 Highcharts 在掛載時同步初始寬高
onMounted(() => {
  console.log("onMounted");
  if (chartComponent.value) {
    chartComponent.value.chart.update({
      chart: {
        width: (chartWidth.value * 0.8).toString(),
        height: (chartHeight.value * 0.8).toString(),
      },
    });
  }
});
</script>

<style >
.highcharts-container {
  margin: auto;
}
</style>