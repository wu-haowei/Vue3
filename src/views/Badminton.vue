<template>
  <div class="scoreboard">
    <div v-if="!gameStarted">
      <VForm
        id="badmintonForm"
        ref="formRef1"
        v-slot="{ errors, meta, resetForm }"
        @submit="startGame"
      >
        v1.0.0
        <AppFormFieId
          type="select"
          name="server"
          lable="選擇發球場地"
          rules="required"
          :options="[
            { label: '-- 請選擇 --', value: '', isDisabled: true },
            { value: 'A', label: '場地 A', isDisabled: false },
            { value: 'B', label: '場地 B', isDisabled: false },
          ]"
        >
        </AppFormFieId>

        <AppFormFieId
          :type="personnel.length > 0 ? 'select' : 'text'"
          name="A1"
          lable="場地 A左"
          placeholder="球員 1（左）"
          :options="personnel"
        >
        </AppFormFieId>

        <AppFormFieId
          :type="personnel.length > 0 ? 'select' : 'text'"
          name="A2"
          lable="場地 A右"
          placeholder="球員 2（右）"
          :options="personnel"
        ></AppFormFieId>

        <AppFormFieId
          :type="personnel.length > 0 ? 'select' : 'text'"
          name="B1"
          lable="場地 B左"
          placeholder="球員 1（左）"
          :options="personnel"
        ></AppFormFieId>

        <AppFormFieId
          :type="personnel.length > 0 ? 'select' : 'text'"
          name="B2"
          lable="場地 B右"
          placeholder="球員 2（右）"
          :options="personnel"
        ></AppFormFieId>
        <button type="submit">確定</button>
      </VForm>
    </div>
    <div v-else>
      <div class="flip-board">
        <div
          class="score-card"
          @click="scorePoint(isSwapped ? 'B' : 'A')"
          :disabled="!!winner"
          :class="[
            { 'is-server': server === (isSwapped ? 'B' : 'A') },
            { 'left-last-point': leftLastPoint },
          ]"
        >
          <div class="score-num">{{ leftScore }}</div>
          <div style="display: flex; justify-content: space-around">
            <div
              :class="{
                'server-name': isServerPlayer(isSwapped ? 'B' : 'A', 'left'),
              }"
            >
              {{ leftPlayers.left }}
            </div>
            <div class="player-label">{{ leftPlayerLabel }}</div>
            <div
              :class="{
                'server-name': isServerPlayer(isSwapped ? 'B' : 'A', 'right'),
              }"
            >
              {{ leftPlayers.right }}
            </div>
          </div>
        </div>
        <div class="middle-control">
          <button @click="swapSides" class="swap-btn no-select">🔁</button>
          <div class="round-info">目前局數: 1</div>
          <button
            class="no-select"
            @click="undoLastAction"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @touchstart="handleMouseDown"
            @touchend="handleMouseUp"
            @touchcancel="handleMouseUp"
            :disabled="history.length === 0"
          >
            ↩️ 上一步
          </button>
        </div>
        <div
          class="score-card"
          @click="scorePoint(isSwapped ? 'A' : 'B')"
          :disabled="!!winner"
          :class="[
            { 'is-server': server === (isSwapped ? 'A' : 'B') },
            { 'left-last-point': rightLastPoint },
          ]"
        >
          <div class="score-num">{{ rightScore }}</div>
          <div style="display: flex; justify-content: space-around">
            <div
              :class="{
                'server-name': isServerPlayer(isSwapped ? 'A' : 'B', 'left'),
              }"
            >
              {{ rightPlayers.left }}
            </div>
            <div class="player-label">{{ rightPlayerLabel }}</div>
            <div
              :class="{
                'server-name': isServerPlayer(isSwapped ? 'A' : 'B', 'right'),
              }"
            >
              {{ rightPlayers.right }}
            </div>
          </div>
        </div>
      </div>
      <div class="status" v-if="!winner">
        <p>上次發球方：{{ lastServe }}</p>
      </div>
      <div class="winner" v-else>
        <h3>🏆 比賽結束！{{ winner }} 獲勝！</h3>
      </div>
    </div>
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>是否確認重置比賽</h3>
      </template>
      <template #footer>
        <button @click="reset" style="background-color: red; color: white">
          確認
        </button>
        <button @click="showModal = false">取消</button>
      </template>
    </modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppFormFieId from "../components/AppFormFieId.vue";
import Modal from "../components/Teleport.vue";

// defineOptions({
//   name: "Badminton",
//   components: {},
// });

const showModal = ref(false);
const scoreA = ref(0);
const scoreB = ref(0);
const server = ref("");
const lastServer = ref("");
const winner = ref("");
const gameStarted = ref(false);
const isSwapped = ref(false); //已交換
const history = ref([]);

const personnel = ref([]);

const courtPosition = ref({
  A: { left: "A左", right: "A右" },
  B: { left: "B左", right: "B右" },
});

const leftPlayers = computed(() => {
  return isSwapped.value ? courtPosition.value.B : courtPosition.value.A;
});

const rightPlayers = computed(() => {
  return isSwapped.value ? courtPosition.value.A : courtPosition.value.B;
});

// 顯示分數 & 名稱 (根據 isSwapped)
const leftScore = computed(() =>
  isSwapped.value ? scoreB.value : scoreA.value
);
const rightScore = computed(() =>
  isSwapped.value ? scoreA.value : scoreB.value
);
const leftPlayerLabel = computed(() => (isSwapped.value ? "場地 B" : "場地 A"));
const rightPlayerLabel = computed(() =>
  isSwapped.value ? "場地 A" : "場地 B"
);

const lastServe = computed(() => {
  // if (!lastServer.value) return null; // 尚未有發球方
  // return isSwapped.value ? lastServer.value === "B" : lastServer.value === "A";

  if (!lastServer.value) return "無"; // 尚未有發球方
  return isSwapped.value
    ? lastServer.value === "B"
      ? "B"
      : "A"
    : lastServer.value === "A"
    ? "A"
    : "B";
});

const leftLastPoint = computed(() => {
  // console.log("leftLastPoint", leftScore.value, rightScore.value);
  const diff = leftScore.value - rightScore.value;
  return diff > 0 && (leftScore.value > 19 || leftScore.value > 28);
});
const rightLastPoint = computed(() => {
  const diff = rightScore.value - leftScore.value;
  return diff > 0 && (rightScore.value > 19 || rightScore.value > 28);
});

const startGame = (data) => {
  server.value = data["server"];
  if (personnel.value.length > 0) {
    courtPosition.value.A.left =
      data["A1"] === ""
        ? "A1"
        : personnel.value.find((f) => f.value == data["A1"]).label;
    courtPosition.value.A.right =
      data["A2"] === ""
        ? "A2"
        : personnel.value.find((f) => f.value == data["A2"]).label;
    courtPosition.value.B.left =
      data["B1"] === ""
        ? "B1"
        : personnel.value.find((f) => f.value == data["B1"]).label;
    courtPosition.value.B.right =
      data["B2"] === ""
        ? "B2"
        : personnel.value.find((f) => f.value == data["B2"]).label;
  } else {
    courtPosition.value.A.left = data["A1"] == "" ? "A1" : data["A1"];
    courtPosition.value.A.right = data["A2"] == "" ? "A2" : data["A2"];
    courtPosition.value.B.left = data["B1"] == "" ? "B1" : data["B1"];
    courtPosition.value.B.right = data["B2"] == "" ? "B2" : data["B2"];
  }

  gameStarted.value = true;
};

const scorePoint = (player) => {
  if (winner.value || !gameStarted.value) return;

  history.value.push({
    scoreA: scoreA.value,
    scoreB: scoreB.value,
    server: server.value,
    lastServer: lastServer.value,
    winner: winner.value,
    isSwapped: isSwapped.value,
    courtPosition: JSON.parse(JSON.stringify(courtPosition.value)), // 深拷貝位置
  });

  lastServer.value = server.value;

  if (player === "A") {
    scoreA.value++;
    server.value = "A";

    if (lastServer.value === "A") {
      // A 連續得分 => 交換站位
      const temp = courtPosition.value.A.left;
      courtPosition.value.A.left = courtPosition.value.A.right;
      courtPosition.value.A.right = temp;
    }
  } else {
    scoreB.value++;
    server.value = "B";

    if (lastServer.value === "B") {
      // B 連續得分 => 交換站位
      const temp = courtPosition.value.B.left;
      courtPosition.value.B.left = courtPosition.value.B.right;
      courtPosition.value.B.right = temp;
    }
  }

  checkWinner();
};

const undoLastAction = () => {
  if (history.value.length === 0) return;
  const last = history.value.pop();
  scoreA.value = last.scoreA;
  scoreB.value = last.scoreB;
  server.value = last.server;
  lastServer.value = last.lastServer;
  winner.value = last.winner;
  isSwapped.value = last.isSwapped;

  // console.log("回上一步", last.courtPosition);

  courtPosition.value = JSON.parse(JSON.stringify(last.courtPosition)); // 還原站位
};

const servePosition = computed(() => {
  const score = server.value === "A" ? scoreA.value : scoreB.value;
  return score % 2 === 0 ? "right" : "left";
});

const isServerPlayer = (side, position) => {
  if (server.value !== side) return false;
  return servePosition.value === position;
};

const checkWinner = () => {
  const diff = Math.abs(scoreA.value - scoreB.value);
  if ((scoreA.value >= 21 || scoreB.value >= 21) && diff >= 2) {
    winner.value = scoreA.value > scoreB.value ? "場地 A" : "場地 B";
  }
  if (scoreA.value === 30) winner.value = "場地 A";
  if (scoreB.value === 30) winner.value = "場地 B";
};

const reset = () => {
  scoreA.value = 0;
  scoreB.value = 0;
  server.value = "";
  lastServer.value = "";
  winner.value = "";
  gameStarted.value = false;
  history.value = [];
  isSwapped.value = false;

  showModal.value = false;
};

const longPressTimer = ref(null);

const handleMouseDown = () => {
  longPressTimer.value = setTimeout(() => {
    showModal.value = true;
  }, 1500);
};

const handleMouseUp = () => {
  clearTimeout(longPressTimer.value);
};

const swapSides = () => {
  isSwapped.value = !isSwapped.value;
};

onMounted(() => {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return null;

  const queryString = hash.slice(queryIndex + 1);
  const params = new URLSearchParams(queryString);
  const p = params.get("p");
  if (p) {
    p.split(",").forEach((f, index) => {
      personnel.value.push({ value: index, label: f });
    });
  }
});
</script>

<style scoped>
.score-card .server-name {
  background-color: var(--color-background-mark);
  color: var(--color-background);
  padding: 0.25em 0.5em;
  border-radius: 4px;
}

:global(body, html) {
  margin: 0;
  padding: 0;
  height: 100%;
}

.scoreboard {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 1rem;
  box-sizing: border-box;
  font-family: sans-serif;
  text-align: center;
}

.scoreboard .score-card {
  color: #fff;
}

.flip-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.score-card {
  flex: 1 1; /* 當空間不足就換行 */
  max-width: 45%;
  background: #111;
  border: 3px solid var(--color-background-form-label);
  border-radius: 10px;
  width: 15rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.score-num {
  font-size: 10rem;
  font-weight: bold;
  line-height: 1;
}

.player-label {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.middle-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.round-info {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.swap-btn {
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.status,
.winner,
.buttons {
  margin-top: 1rem;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

button {
  /* background: #333; */
  /* color: white; */
  padding: 0.5rem 1rem;
  margin: 0.3rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .flip-board {
    flex-direction: column;
  }

  .score-card {
    max-width: 100%;
  }

  .score-num {
    font-size: 4rem;
  }

  .middle-control {
    position: static;
    transform: none;
    margin: 1rem 0;
  }
}
</style>



<style>
.main-content .scoreboard #badmintonForm {
  max-width: 400px;
  margin: 0rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  font-family: "Segoe UI", sans-serif;
}

#badmintonForm .form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

#badmintonForm label {
  text-align: left;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.95rem;
}

#badmintonForm select,
input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

#badmintonForm input:focus {
  border-color: #4db8ff;
  outline: none;
}

#badmintonForm button[type="submit"] {
  width: 100%;
  padding: 0.8rem;
  background: #4db8ff;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

#badmintonForm button[type="submit"]:hover {
  background: #38a2e8;
}

.score-card.is-server {
  background: rgb(116 112 112);
}

.score-card.left-last-point {
  border: 3px solid red;
}
</style>



