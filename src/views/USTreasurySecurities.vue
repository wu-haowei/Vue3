<template>
  <Highcharts :options="chartOptions" />
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
import { Chart as Highcharts } from "highcharts-vue";

import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();

//更新
onBeforeRouteUpdate(() => {});
onBeforeRouteLeave(() => {});

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

  // fetch("http://localhost:8008/stlouisfed/DGS10")
  //   .then((response) => response.text())
  //   .then((result) => {
  //     const data = JSON.parse(result);
  //     let data1 = data.observations.map((item) => {
  //       return [
  //         new Date(item.date).getTime(),
  //         /^[0-9]+.?[0-9]*$/.test(item.value) ? Number(item.value) : -1,
  //       ];
  //     });
  //     data1 = data1.filter((item) => item[0] > 0 && item[1] > 0);
  //     Object.assign(chartOptions.series[0].data, data1);
  //   })
  //   .catch((error) => console.error(error));

  loginService
    .getStlouisfed("DGS10")
    .then(async (res) => {
      let data = res.observations.map((item) => {
        return [
          new Date(item.date).getTime(),
          /^[0-9]+.?[0-9]*$/.test(item.value) ? Number(item.value) : -1,
        ];
      });
      data = data.filter((item) => item[0] > 0 && item[1] > 0);
      Object.assign(chartOptions.series[0].data, data);
    })
    .catch((error) => {});
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
