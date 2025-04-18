<template>
  <div>
    <div class="slider-container">
      <div class="slider-text">
        <transition name="fade" mode="out-in">
          <span :key="currentIndex">{{ slideshowItem[currentIndex] }}</span>
        </transition>
      </div>
    </div>

    <button id="hiddenAudioButton" @click="enableAudio" v-show="!false">
      音效測試
    </button>
    <h2 style="background: yellow; color: red; text-align: center">
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
              backgroundColor: item.seq % 2 === 0 ? '#f9f9f9' : 'white',
              textAlign: 'center',
            }"
          >
            <td style="color: black">{{ item.seq }}</td>
            <td style="color: black">{{ item.CaseNumber }}</td>
            <td style="color: black">
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
        <li>ERR01: 數量異常！</li>
        <li>ERR02: 效期異常！</li>
        <li>ERR03: 數量、 效期異常！</li>
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

const { openDB, save, get, getAll, remove } = useIndexedDB();

defineOptions({
  name: "AdvancedChatOpenAI",
  components: {},
});

const errMsg = ref("");

const Interval = reactive({
  changeText: null,
  getData: null,
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

const playSound = (code = "ERR01") => {
  const el = videos[code];
  if (!el) return;
  el.currentTime = 0;
  el.loop = true;
  el.play();
  setTimeout(() => {
    el.pause();
  }, 3000);
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
        console.log("資料庫已開啟：", db.value);
        resolve(true);
      })
      .catch((error) => {
        console.error("資料庫開啟失敗：", error);
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
  if (data.seq == 4) {
    getToday.value = getTodayDateString(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
  }
  if (data.seq == 8) {
    getToday.value = getTodayDateString();
  }

  if (!db.value.objectStoreNames.contains(getToday.value)) {
    await new Promise((resolve, reject) => {
      cleanupOldData().then(() => {
        // 等待 onsuccess 被觸發後才 resolve
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
  query.onsuccess = () => {
    const existing = query.result;
    if (existing) {
      const updated = Array.from(
        new Set([...existing.ExceptionCode, ...data.ExceptionCode])
      );
      const updateRequest = store.put({ ...existing, ExceptionCode: updated });

      updateRequest.onsuccess = () => {
        if (
          updated.length != existing.ExceptionCode.length &&
          updated.length > 0
        ) {
          try {
            errMsg.value = data.ExceptionCode.map((item) =>
              ExceptionMsgStr(item)
            ).join("/");
            playSound(data.ExceptionCode[0]);
          } catch (error) {
            console.error("播放音效時發生錯誤:", error);
          }
        } else if (updated.length > 0) {
          errMsg.value = data.ExceptionCode.map((item) =>
            ExceptionMsgStr(item)
          ).join("/");
        } else {
          errMsg.value = "";
        }
        console.log("✅ 資料已更新");
      };
    } else {
      const addRequest = store.add(JSON.parse(JSON.stringify(data)));
      addRequest.onsuccess = () => {
        if (data.ExceptionCode.length > 0) {
          try {
            errMsg.value = data.ExceptionCode.map((item) =>
              ExceptionMsgStr(item)
            ).join("/");
            playSound(data.ExceptionCode[0]);
          } catch (error) {
            console.error("播放音效時發生錯誤:", error);
          }
        } else {
          errMsg.value = "";
        }
        console.log("🆕 資料已新增");
      };
    }
  };

  query.onerror = (event) => {
    console.error("查詢資料失敗：", event.target.error);
  };
};

const getStoresToDelete = async () => {
  return Array.from(db.value.objectStoreNames).filter(
    (name) => name !== getToday.value
  );
};

const cleanupOldData = async () => {
  if (!db.value) return;

  const storesToDelete = await getStoresToDelete();
  if (storesToDelete.length === 0) {
    console.log("✅ 沒有過期資料需要清除");
    return;
  } else {
    await initDB(db.value.version + 1)
      .then(() => {
        console.log("資料庫升級成功，過期資料已清除");
      })
      .catch((error) => {
        console.error("資料庫升級失敗：", error);
      });
  }
};

const enableAudio = async () => {
  const arrIndex = Math.floor((Math.random() * 100) % errCode.value.length);
  console.log("音效測試", arrIndex);
  playSound(errCode.value[arrIndex]);
};

const getData = async () => {
  new Promise((resolve, reject) => {
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
        resolve();
      })
      .catch((error) => {
        slideshowItem.value = [];
        reject(error);
      });
  });
};

onMounted(async () => {
  today.value = "2025-04-16"; //await getTodayDateString();
  await initDB(0)
    .then(async () => {
      await getData();
      Interval.changeText = setInterval(async () => {
        if (slideshowItem.value.length > 0) {
          setIndexedDB(slideshowItem.value[currentIndex.value]);
          changeText();
        }
      }, 5000);

      // Interval.getData = setInterval(async () => {
      //   getData();
      // }, 5000);
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



