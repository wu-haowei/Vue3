<template>
  <div>
    <VForm id="ChartForm" v-slot="{ errors, meta, resetForm }" @submit="search">
      <AppFormFieId
        type="select"
        name="type"
        lable="系列"
        rules="required"
        :options="[
          { label: '-- 請選擇 --', value: '', isDisabled: true },
          { value: 'DGS10', label: 'DGS10', isDisabled: false },
          { value: 'DGS20', label: 'DGS20', isDisabled: false },
        ]"
      >
      </AppFormFieId>
      <button type="submit">確定</button>
    </VForm>

    <Highcharts :options="chartOptions" />
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
import { Chart as Highcharts } from "highcharts-vue";
import AppFormFieId from "../components/AppFormFieId.vue";
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
    text: "",
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
const search = (data) => {
  chartOptions.title.text = `Market Yield on U.S. Treasury Securities at ${
    data.type == "DGS10" ? "10" : data.type == "DGS20" ? "20" : ""
  }-Year Constant Maturity, Quoted on an Investment Basis (${data.type})`;
  chartOptions.series[0].data.splice(0);

  loginService
    .getStlouisfed(data.type)
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
};
onMounted(() => {});
</script>

<style >
.main-content #ChartForm {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  font-family: "Segoe UI", sans-serif;
}

#ChartForm .form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

#ChartForm input,
#ChartForm select {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

#ChartForm label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.95rem;
}

#ChartForm button[type="submit"] {
  width: 100%;
  padding: 0.8rem;
  background: #4db8ff;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}
</style>
