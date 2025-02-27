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
  parent: { type: Number, default: 0 },
});

const getPropsWidth = computed(() => {
  return props.width;
});
const getPropsParent = computed(() => {
  return props.parent;
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
    // width: props.width.toString(),
    width:
      props.width > props.parent && props.parent != 0
        ? props.parent.toString()
        : props.width.toString(),
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
watch(
  [getPropsWidth, getPropsHeight, getPropsParent],
  ([newWidth, newHeight, newParent]) => {
    console.log("watch");

    if (chartComponent.value) {
      chartComponent.value.chart.update({
        chart: {
          width:
            // newWidth >newWidth?newWidth.toString():newParent.toString(),

            newWidth > newParent && newParent != 0
              ? newParent.toString()
              : newWidth.toString(),

          height: (newHeight * 0.7).toString(),
        },
      });
    }
  }
);

onMounted(() => {
  console.log("onMounted");

  if (chartComponent.value) {
    chartComponent.value.chart.update({
      chart: {
        // width: props.width.toString(),
        width:
          props.width > props.parent && props.parent != 0
            ? props.parent.toString()
            : props.width.toString(),
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