<template>
  <div>
    <Chart ref="chartComponent" :options="chartOptions"> </Chart>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, computed } from "vue";
import { Chart } from "highcharts-vue";

// const emit = defineEmits(["update:widthHeight"]);

const props = defineProps({
  width: { type: Number, default: 300 },
  height: { type: Number, default: 200 },
  chartData: { type: Array, default: null },
  title: { type: String, default: "Vite + Highcharts" },
});

const getPropsWidth = computed(() => {
  return props.width;
});

const getPropsHeight = computed(() => {
  return props.height;
});
const getChartData = computed(() => {
  return props.chartData;
});

const chartComponent = ref(null);

const chartOptions = ref({
  chart: {
    type: "line",
    width: props.width.toString(),
    height: (props.height * 0.7).toString(),
  },
  title: {
    text: props.title,
    align: "center", // 讓標題置中
  },
  legend: {
    align: "center", // 圖例置中
  },
  series: [
    {
      name: "Data",
      data: getChartData.value,
      dataLabels: {
        enabled: true,
        align: "center", // 數據標籤置中
      },
    },
  ],
});

// 監聽寬高變化，動態更新 Highcharts
watch([getPropsWidth, getPropsHeight], ([newWidth, newHeight]) => {
  console.log("watch");

  if (chartComponent.value) {
    chartComponent.value.chart.update({
      chart: {
        width: newWidth.toString(),
        height: (newHeight * 0.7).toString(),
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
        width: props.width.toString(),
        height: (props.height * 0.7).toString(),
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