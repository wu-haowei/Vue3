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

const getTodayDateString = () => {
  const date = new Date();
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

const initDB = async () => {
  const request = indexedDB.open("ttl-grafanaDB");

  request.onupgradeneeded = (event) => {
    const _db = event.target.result;
    if (!_db.objectStoreNames.contains(getToday.value)) {
      _db.createObjectStore(getToday.value, {
        keyPath: "seq",
        autoIncrement: false,
      });
    }
  };

  request.onsuccess = (event) => {
    db.value = event.target.result;
    cleanupOldData();
  };

  request.onerror = (event) => {
    console.error("資料庫開啟失敗：", event.target.errorCode);
  };
};

const setIndexedDB = async (data) => {
  if (!db.value) {
    console.error("資料庫尚未初始化");
    return;
  }
  if (data.seq == 10) {
    getToday.value = getTodayDateString();
  }

  if (!db.value.objectStoreNames.contains(getToday.value)) {
    await new Promise((resolve, reject) => {
      this.cleanupOldData().then(() => {
        // 等待 onsuccess 被觸發後才 resolve
        const interval = setInterval(() => {
          if (db.value.objectStoreNames.contains(getToday.value)) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        // 最多等 5 秒
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

const updateDb = async (storesToDelete) => {
  const oldDb = db.value;
  const oldVersion = oldDb.version;

  if (storesToDelete.length === 0) {
    console.log("✅ 沒有過期資料需要清除");
    return null;
  }

  oldDb.close();
  // 切換版本即時更新
  return indexedDB.open("ttl-grafanaDB", oldVersion + 1);
};

const cleanupOldData = async () => {
  if (!db.value) return;

  const storesToDelete = await getStoresToDelete();
  const request = await updateDb(storesToDelete);

  if (!request) return;

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(getToday.value)) {
      db.createObjectStore(getToday.value, {
        keyPath: "seq",
        autoIncrement: true,
      });
    }

    // 刪除不是今天的 store
    storesToDelete.forEach((storeName) => {
      db.deleteObjectStore(storeName);
      console.log(`🗑️ 已刪除過期 store：${storeName}`);
    });
  };

  request.onsuccess = (event) => {
    db.value = event.target.result;
  };

  request.onerror = (event) => {
    console.error("升級資料庫以清除過期資料失敗：", event.target.errorCode);
  };
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
  today.value = await getTodayDateString();
  await initDB();
  await getData();

  Interval.changeText = setInterval(async () => {
    await changeText();
    if (slideshowItem.value.length > 0)
      await setIndexedDB(slideshowItem.value[currentIndex.value]);
  }, 5000);
  // Interval.getData = setInterval(async () => {
  //   getData();
  // }, 5000);
});

onBeforeUnmount(async () => {
  if (Interval.changeText) clearInterval(Interval.changeText);
  if (Interval.getData) clearInterval(Interval.getData);
});
</script>

<style scoped>
</style>



