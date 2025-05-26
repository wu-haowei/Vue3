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
          { value: 'DGS10', label: '美債10年期', isDisabled: false },
          { value: 'DGS20', label: '美債20年期', isDisabled: false },
          { value: 'CPIAUCSL', label: '美國整體 CPI', isDisabled: false },
        ]"
      >
      </AppFormFieId>
      <button type="submit">確定</button>
    </VForm>

    <!-- <Highcharts :options="chartOptions" /> -->
    <div ref="chartContainer"></div>
    <table>
      <thead>
        <th scope="col" id="sort">序</th>
        <th scope="col">時間</th>
        <th scope="col">值</th>
      </thead>
      <tbody>
        <template v-if="pagedData.length > 0">
          <tr
            v-for="(item, index) of pagedData"
            :key="index"
            @click="highlightPoint(index + (currentPage - 1) * itemsPerPage)"
          >
            <td data-title="序">
              <span>{{ index + 1 }}</span>
            </td>
            <td data-title="時間">
              <span>{{ new Date(item[0]).toLocaleString() }}</span>
            </td>

            <td data-title="值">
              <span>{{ item[1] }}</span>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3" data-title="no-data">
              <slot name="empty">無資料</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- 分頁控制區 -->
    <div class="pagination" v-show="pagedData.length > 0">
      <button @click="currentPage = 1" :disabled="currentPage === 1">
        第一頁
      </button>
      <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
      <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        下一頁
      </button>
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
      >
        最後
      </button>
      <select
        name="itemsPerPage"
        id="itemsPerPage"
        v-model="itemsPerPage"
        @change="currentPage = 1"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
import Highcharts from "highcharts";
import AppFormFieId from "../components/AppFormFieId.vue";
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();

//更新
onBeforeRouteUpdate(() => {});
onBeforeRouteLeave(() => {});
const itemsPerPage = ref(10);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(getData.value.length / itemsPerPage.value)
);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return getData.value.slice(start, start + itemsPerPage.value);
});

const getData = computed(() => {
  console.log(chart.value?.series[0]?.data);
  return (
    chart.value?.series[0]?.data.reduce((acc, point) => {
      acc.push([point.x, point.y]);
      return acc;
    }, []) || []
  );
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToSection("sort");
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToSection("sort");
  }
};

// const highlightPoint = (globalIndex) => {
//   const series = chart.value?.series?.[0];
//   if (!series) return;
//   const point = getData.value[globalIndex];
//   if (point) {
//     point.onMouseOver(); // 顯示 tooltip
//     chart.value.tooltip.refresh(point); // 強制刷新提示框
//     chart.value.xAxis[0].setExtremes(point.x - 10000000, point.x + 10000000); // 滾動視窗
//   }
// };

const goTop = (top = 0) => {
  window.scrollTo({
    top: top,
    behavior: "smooth",
  });
};
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const highlightPoint = (globalIndex) => {
  console.log("highlightPoint", globalIndex);
  const series = chart.value?.series?.[0];
  if (!series) return;
  const point = series.data[globalIndex];
  if (point) {
    point.onMouseOver(); // ✅ 顯示 tooltip
    chart.value.tooltip.refresh(point); // ✅ 強制刷新提示框
    chart.value.xAxis[0].setExtremes(point.x - 10000000, point.x + 10000000); // ✅ 滾動視窗
    goTop(100);
  }
};

const chart = ref(null); // chart 實例
const chartContainer = ref(null);

const chartOptions = reactive({
  chart: {
    zooming: {
      type: "x",
    },
  },
  credits: {
    enabled: true, // 啟用右下角的 credits
    text: "", // 設定自定義的文字
    href: "/", // 可以選擇性提供鏈接
    target: "_blank", // 在新標籤頁中開啟鏈接
    style: {
      // color: 'rgb(255, 99, 71)', // 設定顏色
      // fontSize: '0.8em', // 設定字型大小
      fontFamily: "Arial, sans-serif", // 設定字型
      cursor: "pointer", // 設定鼠標樣式
    },
  },
  time: {
    useUTC: false, // 禁用 UTC 時間，使用當地時間
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
  tooltip: {
    split: false,
    dateTimeLabelFormats: {
      millisecond: "%H:%M:%S.%L",
      second: "%H:%M:%S",
      minute: "%H:%M",
      hour: "%H:%M",
      day: "%m-%d",
      year: "%Y-%m-%d",
    },
    headerFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br>",
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      day: "%A %e %b %Y", // 顯示完整日期（星期 日 日 月 年）
      week: "%A, %b %e, %Y", // 顯示一週的開始日（星期 日, 月 日, 年）
      month: "%m", // 顯示月份和年份
      year: "%Y", // 顯示年份
    },
    events: {
      setExtremes: function (e) {
        if (e.trigger !== "zoom") {
          chart.value.showResetZoom();
        }
      },
    },
  },
  yAxis: {
    title: {
      text: "時間",
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
      name: "value",
      data: [
        // [86400000, 7.86],
        // [345600000, 7.88],
      ],
    },
  ],
});

const search = (data) => {
  currentPage.value = 1;
  const titleText = `Market Yield on U.S. Treasury Securities at ${
    data.type == "DGS10" ? "10" : data.type == "DGS20" ? "20" : ""
  }-Year Constant Maturity, Quoted on an Investment Basis (${data.type})`;
  chartOptions.series[0].data.splice(0);
  loginService
    .getStlouisfed(data.type)
    .then(async (res) => {
      if (res.result.success) {
        let newData = [];
        res.data = JSON.parse(res.data);
        if (data.type === "CPIAUCSL") {
          newData = convertCPIToYoYPercent(res.data.observations);
          // const data = chartOptions.series[0].data;
          // const total = data.length;
          // const visibleStartIndex = Math.max(0, total - 7);
          // const min = data[visibleStartIndex][0];
          // const max = data[total - 1][0];

          // Object.assign(chartOptions.xAxis, {
          //   ...chartOptions.xAxis,
          //   min,
          //   max,
          // });
        } else {
          let _data = res.data.observations.map((item) => {
            return [
              new Date(item.date).getTime(),
              /^[0-9]+.?[0-9]*$/.test(item.value) ? Number(item.value) : -1,
            ];
          });
          newData = _data.filter((item) => item[0] > 0 && item[1] > 0);
          // Object.assign(chartOptions.series[0].data, _data);
        }

        // ✅ 更新 chart，如果已經初始化過
        if (chart.value) {
          // console.log('newData'.newData.length);

          chart.value.setTitle({ text: titleText });
          chart.value.series[0].setData([], true); // false 表示暫時不 redraw
          chart.value.series[0].setData(newData, true); // true 表示立即 redraw
        } else {
          // 初始情況，還未建立圖表時
          chartOptions.series[0].data = newData;
          chartOptions.title.text = titleText;
        }
      }
      else {
     throw new Error(res.result.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const convertCPIToYoYPercent = (data) => {
  const map = new Map();
  data.forEach((item) => {
    map.set(item.date, parseFloat(item.value));
  });

  const result = data.map((item) => {
    const date = new Date(item.date);
    const lastYearDate = new Date(date);
    lastYearDate.setFullYear(date.getFullYear() - 1);
    const lastYearKey = lastYearDate
      .toISOString()
      .slice(0, 10)
      .replace(/-\d{2}$/, "-01");

    const prevValue = map.get(lastYearKey);
    const currValue = parseFloat(item.value);

    let yoy = null;
    if (prevValue) {
      yoy = ((currValue - prevValue) / prevValue) * 100;
    }

    return [
      new Date(item.date).getTime(),
      yoy !== null ? Number(yoy.toFixed(2)) : 0, // 保留兩位小數，或 null
    ];
  });

  return result.filter((item) => item[0] > 0 && item[1] > 0);
};

onMounted(() => {
  Highcharts.setOptions({
    lang: {
      weekdays: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
      months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      decimalPoint: ".",
      thousandsSep: ",",
    },
  });
  chart.value = Highcharts.chart(chartContainer.value, chartOptions);
});
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: sans-serif;
}
thead,
tfoot {
  background-color: rgb(228 240 245);
}

th,
td {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  text-align: left;
}

tbody tr {
  transition: background-color 0.2s ease;
}
tbody tr:nth-child(even) {
  background-color: rgb(237 238 242);
}
tbody tr:hover {
  background-color: rgb(220 230 250);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 560px) {
  .pagination {
    display: grid;

    grid-template-columns: repeat(3, 1fr);
  }
  thead {
    display: none;
  }

  tbody td {
    display: flex;
    border-bottom: 0;
    width: auto;
  }

  tbody td span {
    /* flex: 2; */
  }

  tbody td:before {
    content: attr(data-title);
    font-weight: 700;
  }

  tbody td:before {
    flex: 1;
    padding: 6px;
    color: #343434;
    display: flex;
    align-items: center;
  }
}

@media (max-width: 300px) {
  .pagination {
    display: grid;
    text-align: center;
    grid-template-columns: repeat(1, 1fr);
  }
}

.pagination button {
  padding: 0.4rem 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.pagination select {
  font-size: 1.07rem !important;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer; /*小手樣式 */
  font-size: 0.9rem;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9rem;
}
</style>
