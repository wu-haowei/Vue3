<template>
  <Highcharts :options="chartOptions" />
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
import { Chart as Highcharts } from "highcharts-vue";

//更新
onBeforeRouteUpdate(() => {
  console.log("onBeforeRouteUpdate");
});
onBeforeRouteLeave(() => {
  console.log("onBeforeRouteLeave");
});

const chartOptions = reactive({
  chart: {
    zooming: {
      type: "x",
    },
  },
  title: {
    text: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis (DGS10)",
  },
  subtitle: {
    text:
      document.ontouchstart === undefined
        ? "Click and drag in the plot area to zoom in"
        : "Pinch the chart to zoom in",
  },
  xAxis: {
    type: "datetime",
  },
  yAxis: {
    title: {
      text: "Percent",
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    area: {
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      color: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, "rgb(199, 113, 243)"],
          [0.7, "rgb(76, 175, 254)"],
        ],
      },
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      threshold: null,
    },
  },
  series: [
    {
      type: "area",
      name: "USD to EUR",
      data: [
        [86400000, 7.86],
        [345600000, 7.88],
      ],
    },
  ],
});

onMounted(() => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://localhost:44346/api/EIP/SetOrderTable?url=https%3A%2F%2Fapi.stlouisfed.org%2Ffred%2Fseries%2Fobservations%3Fseries_id%3DDGS10%26api_key%3D19145dd7613bda7acafb9574deb88a25%26file_type%3Djson",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      console.log(data);
      let data1 = data.observations.map((item) => {
        return [
          new Date(item.date).getTime(),
          /^[0-9]+.?[0-9]*$/.test(item.value) ? Number(item.value) : -1,
        ];
      });
      data1 = data1.filter((item) => item[0] > 0 && item[1] > 0);
      console.log(data1);
      Object.assign(chartOptions.series[0].data, data1);
    })
    .catch((error) => console.error(error));
});
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
