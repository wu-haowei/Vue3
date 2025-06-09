<template>
  <div>
    <!-- <div class="slider-container">
      <div class="slider-text">
        <transition name="fade" mode="out-in">
          <span :key="currentIndex">{{ getNowSeq }}</span>
        </transition>
      </div>
    </div> -->

    <button
      v-if="IsUserInteracted"
      @click="init"
      :style="{
        padding: '12px',
        color: 'white',
      }"
    >
      點我開始播放與啟用音效
    </button>

    <button
      id="hiddenAudioButton"
      @click="enableAudio"
      v-if="!IsUserInteracted"
    >
      音效測試
    </button>
    <button
      v-if="!IsUserInteracted"
      id="hiddenAudioButton"
      @click="cleanupOldData(true)"
    >
      清除資料
    </button>
    <h2
      style="
        background: yellow;
        color: red;
        text-align: center;
        min-height: 36px;
      "
    >
      {{ errMsg }}
    </h2>

    <video
      v-for="(item, index) in errCode"
      :key="index"
      :ref="(el) => setVideoRef(el, item)"
      v-show="false"
      :src="`${base}/assets/mp3/${item}.mp3`"
    />

    <div style="background-color: antiquewhite">
      <table
        style="
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
        "
      >
        <thead style="background-color: #007bff; color: white">
          <tr>
            <th>序號</th>
            <th>單據編號</th>
            <th>異常代碼</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in slideshowItem"
            :key="item.seq"
            :style="{
              backgroundColor:
                getNowSeq.seq == item.seq
                  ? 'red'
                  : item.seq % 2 === 0
                  ? '#f9f9f9'
                  : 'white',
              textAlign: 'center',
            }"
          >
            <td
              :style="{ color: getNowSeq.seq == item.seq ? 'white' : 'black' }"
            >
              {{ item.seq }}
            </td>
            <td
              :style="{ color: getNowSeq.seq == item.seq ? 'white' : 'black' }"
            >
              {{ item.CaseNumber }}
            </td>
            <td
              :style="{ color: getNowSeq.seq == item.seq ? 'white' : 'black' }"
            >
              <span v-for="(_item, _index) in errCode" :key="_index">
                <input
                  type="checkbox"
                  :id="`${_item}_${index}`"
                  :value="_item"
                  v-model="item.ExceptionCode"
                />
                <label :for="`${_item}_${index}`">{{ _item }}</label>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <ol>
        <li>
          ERR01: 數量異常！<span @click="enableAudio(0)" style="cursor: pointer"
            >🔊</span
          >
        </li>
        <li>
          ERR02: 效期異常！<span @click="enableAudio(1)" style="cursor: pointer"
            >🔊</span
          >
        </li>
        <li>
          ERR03: 數量、 效期異常！<span
            @click="enableAudio(2)"
            style="cursor: pointer"
            >🔊</span
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  defineOptions,
  onBeforeUnmount,
  reactive,
} from "vue";
const base = import.meta.env.BASE_URL;

import { useIndexedDB } from "@/stores/indexedDB";

const { openDB, save, get, getAll, deleteStore, clearStore } = useIndexedDB();

defineOptions({
  name: "IndexedDB",
  components: {},
});
const IsUserInteracted = ref(false);
const errMsg = ref("載入中...");

const Interval = reactive({
  changeText: null,
  getData: null,
  isRunning: false,
});

const errCode = ref(["ERR01", "ERR02", "ERR03"]);
const currentIndex = ref(0);
const slideshowItem = ref([]);

const today = ref(null);
const db = ref(null);

const setVideoRef = (el, key) => {
  if (el) videos[key] = el;
};

const videos = reactive({});

const getToday = computed({
  get: () => today.value,
  set: (val) => (today.value = val),
});

const getTodayDateString = (time = new Date()) => {
  const date = time;
  return date.toISOString().split("T")[0];
};

const ExceptionMsgStr = (code) => {
  switch (code?.toUpperCase()) {
    case "":
      return "";
    case "ERR01":
      return "數量異常！";
    case "ERR02":
      return "效期異常！";
    case "ERR03":
      return "數量、 效期異常！";
    default:
      return "未知異常";
  }
};

const changeText = () => {
  currentIndex.value = (currentIndex.value + 1) % slideshowItem.value.length;
};

const getNowSeq = computed(() => {
  return slideshowItem.value[currentIndex.value];
});

const playSound = async (code = "ERR01") => {
  const el = videos[code];
  if (!el) return;

  try {
    el.currentTime = 0;
    el.loop = true;

    await el.play(); // 等待播放開始

    await new Promise((resolve) => {
      setTimeout(() => {
        el.pause();
        resolve();
      }, 3000); // 播放 3 秒後暫停
    });
  } catch (error) {
    console.error("播放音效失敗：", error);
  }
};
const initDB = async (version = 0) => {
  // const request = indexedDB.open("ttl-grafanaDB");
  await new Promise((resolve, reject) => {
    openDB(
      getToday.value,
      {
        keyPath: "seq",
        autoIncrement: false,
      },
      version
    )
      .then((res) => {
        db.value = res;
        console.debug("資料庫已開啟：", db.value);
        resolve(true);
      })
      .catch((error) => {
        console.debug("資料庫開啟失敗：", error);
        reject(error);
      });
  });

  // request.onupgradeneeded = (event) => {
  //   const _db = event.target.result;
  //   if (!_db.objectStoreNames.contains(getToday.value)) {
  //     _db.createObjectStore(getToday.value, {
  //       keyPath: "seq",
  //       autoIncrement: false,
  //     });
  //   }
  // };

  // request.onsuccess = (event) => {
  //   db.value = event.target.result;
  //   cleanupOldData();
  // };

  // request.onerror = (event) => {
  //   console.error("資料庫開啟失敗：", event.target.errorCode);
  // };
};

const setIndexedDB = async (data) => {
  if (!db.value) {
    console.error("資料庫尚未初始化");
    return;
  }
  if (!db.value.objectStoreNames.contains(getToday.value)) {
    await new Promise((resolve, reject) => {
      cleanupOldData().then(() => {
        const interval = setInterval(() => {
          if (db.value.objectStoreNames.contains(getToday.value)) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          reject("等待 store 建立超時");
        }, 5000);
      });
    }).catch((error) => {
      console.error(error);
      return;
    });
  }

  const transaction = db.value.transaction([getToday.value], "readwrite");
  const store = transaction.objectStore(getToday.value);

  const query = store.get(data.seq);
  return new Promise((resolve) => {
    query.onsuccess = async () => {
      const existing = query.result;
      if (existing) {
        const updated = Array.from(
          new Set([...existing.ExceptionCode, ...data.ExceptionCode])
        );
        const updateRequest = store.put({
          ...existing,
          ExceptionCode: updated,
        });

        updateRequest.onsuccess = async () => {
          if (
            updated.length !== existing.ExceptionCode.length &&
            updated.length > 0
          ) {
            errMsg.value = data.ExceptionCode.map((item) =>
              ExceptionMsgStr(item)
            ).join("/");
            await playSound(data.ExceptionCode[0]);
          } else if (updated.length > 0) {
            errMsg.value = data.ExceptionCode.map((item) =>
              ExceptionMsgStr(item)
            ).join("/");
          } else {
            errMsg.value = "";
          }
          console.debug("✅ 資料已更新");
          resolve();
        };
      } else {
        const addRequest = store.add(JSON.parse(JSON.stringify(data)));
        addRequest.onsuccess = async () => {
          if (data.ExceptionCode.length > 0) {
            errMsg.value = data.ExceptionCode.map((item) =>
              ExceptionMsgStr(item)
            ).join("/");
            await playSound(data.ExceptionCode[0]);
          } else {
            errMsg.value = "";
          }
          console.debug("🆕 資料已新增");

          resolve();
        };
      }
    };

    query.onerror = (event) => {
      console.error("查詢資料失敗：", event.target.error);
      resolve();
    };
  });
};

const getStoresToDelete = async (isAll) => {
  const allStores = Array.from(db.value.objectStoreNames);
  return isAll
    ? allStores
    : allStores.filter((name) => name !== getToday.value);
};

const cleanupOldData = async (isAll = false) => {
  if (!db.value) return;

  if (isAll) {
    pauseSlideshow();
  }

  const storesToDelete = await getStoresToDelete(isAll);
  if (storesToDelete.length === 0) {
    console.debug("✅ 沒有過期資料需要清除");
    return;
  } else {
    storesToDelete.forEach(async (storeName) => {
      await clearStore(storeName);
    });

    await initDB(db.value.version + 1)
      .then(() => {
        console.debug("資料庫升級成功，過期資料已清除");
        if (isAll) {
          startSlideshow();
        }
      })
      .catch((error) => {
        console.error("資料庫升級失敗：", error);
      });
  }
};

const enableAudio = async (arrIndex = null) => {
  if (typeof arrIndex != "number") {
    arrIndex = Math.floor((Math.random() * 100) % errCode.value.length);
  }
  playSound(errCode.value[arrIndex]);
};

const getData = async () => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${base}/assets/doc.json`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        slideshowItem.value = result.map((item) => ({
          ...item,
          ExceptionCode: item.ExceptionCode
            ? item.ExceptionCode.split(",").map((code) =>
                code.trim().toUpperCase()
              )
            : [],
        }));
        resolve(); // 確保可以 await getData()
      })
      .catch((error) => {
        slideshowItem.value = [];
        reject(error); // 可以 try/catch 處理錯誤
      });
  });
};

// 啟動輪播
const startSlideshow = () => {
  if (Interval.isRunning) return;
  Interval.changeText = setInterval(async () => {
    if (slideshowItem.value.length > 0) {
      changeText();
      await setIndexedDB(getNowSeq.value);
    }
  }, 5000);
  Interval.isRunning = true;
};
// 暫停輪播
const pauseSlideshow = () => {
  clearInterval(Interval.changeText);
  // Interval.changeText = null;
  Interval.isRunning = false;
};

const init = () => {
  setTimeout(async () => {
    if (slideshowItem.value.length > 0) {
      IsUserInteracted.value = false;
      errMsg.value = "";
      setTimeout(async () => {
        await setIndexedDB(getNowSeq.value);
        startSlideshow();
      }, 2000);
    }
  }, 0);
};

onMounted(async () => {
  today.value = await getTodayDateString();
  await initDB(0)
    .then(async () => {
      await getData();
      IsUserInteracted.value = true;
      errMsg.value = "已載入資料...";
    })
    .catch((error) => {
      console.error("初始化資料庫失敗：", error);
    });
});

onBeforeUnmount(async () => {
  if (Interval.changeText) clearInterval(Interval.changeText);
  if (Interval.getData) clearInterval(Interval.getData);
});
</script>

<style scoped>
</style>



