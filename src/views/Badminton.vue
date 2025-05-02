<template>
  <div class="scoreboard">
    <!-- <h2>羽球比賽記分板</h2> -->

    <!-- 發球方選擇 -->
    <div v-if="!gameStarted">
      <VForm
        id="badmintonForm"
        ref="formRef1"
        v-slot="{ errors, meta, resetForm }"
        @submit="startGame"
      >
        <AppFormFieId
          type="select"
          name="選擇發球場地"
          lable="選擇發球場地"
          rules="required"
          :options="[
            { value: 'A', label: '場地 A' },
            { value: 'B', label: '場地 B' },
          ]"
        >
        </AppFormFieId>
        <button type="submit">確定</button>
      </VForm>
    </div>

    <!-- 計分顯示 -->
    <div v-else>
      <div class="flip-board">
        <div
          class="score-card"
          @click="scorePoint(isSwapped ? 'B' : 'A')"
          :disabled="!!winner"
          :style="{
            background: lastServe ? 'rgb(116 112 112)' : '#111',
            border: leftLastPoint ? '3px solid red' : '3px solid #fff',
          }"
        >
          <div class="score-num">{{ leftScore }}</div>
          <div class="player-label">{{ leftPlayerLabel }}</div>
        </div>

        <div class="middle-control">
          <button @click="swapSides" class="swap-btn no-select">🔁</button>
          <div class="round-info">目前局數: 1</div>
          <!-- <div class="round-info">----------</div> -->
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
          :style="{
            background: !lastServe ? 'rgb(116 112 112)' : '#111',
            border: rightLastPoint ? '3px solid red' : '3px solid #fff',
          }"
        >
          <div class="score-num">{{ rightScore }}</div>
          <div class="player-label">{{ rightPlayerLabel }}</div>
        </div>
      </div>

      <div class="status" v-if="!winner">
        <p>目前發球方：{{ server }}</p>
        <p>發球位置：{{ servePosition }}</p>
        <!-- <p>上次發球方：{{ lastServer || "尚未發球" }}</p> -->
      </div>

      <div class="winner" v-else>
        <h3>🏆 比賽結束！{{ winner }} 獲勝！</h3>
      </div>

      <div class="buttons">
        <!-- <button @click="scorePoint('A')" :disabled="!!winner">
          場地 A 得分
        </button>
        <button @click="scorePoint('B')" :disabled="!!winner">
          場地 B 得分
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppFormFieId from "../components/AppFormFieId.vue";

const scoreA = ref(0);
const scoreB = ref(0);
const server = ref("");
const lastServer = ref("");
const winner = ref("");
const gameStarted = ref(false);
const isSwapped = ref(false);
const history = ref([]);

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
  return isSwapped.value ? lastServer.value === "B" : lastServer.value === "A";
});

const leftLastPoint = computed(() => {
  console.log("leftLastPoint", leftScore.value, rightScore.value);
  const diff = leftScore.value - rightScore.value;
  return diff > 0 && (leftScore.value > 19 || leftScore.value > 28);
});
const rightLastPoint = computed(() => {
  const diff = rightScore.value - leftScore.value;
  return diff > 0 && (rightScore.value > 19 || rightScore.value > 28);
});

const startGame = () => {
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
  });

  lastServer.value = server.value;

  if (player === "A") {
    scoreA.value++;
    server.value = "A";
  } else {
    scoreB.value++;
    server.value = "B";
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
};

const servePosition = computed(() => {
  const score = server.value === "A" ? scoreA.value : scoreB.value;
  return score % 2 === 0 ? "右邊" : "左邊";
});

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
};

const longPressTimer = ref(null);

const handleMouseDown = () => {
  longPressTimer.value = setTimeout(() => {
    if (confirm("是否確認重置比賽？")) {
      reset();
    }
  }, 2000);
};

const handleMouseUp = () => {
  clearTimeout(longPressTimer.value);
};

const swapSides = () => {
  isSwapped.value = !isSwapped.value;
};
</script>
<!-- 
<style scoped>
.scoreboard {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  background: #000;
  color: #fff;
  font-family: sans-serif;
  text-align: center;
}

.flip-board {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
}

.score-card {
  background: #111;
  border: 3px solid #fff;
  border-radius: 10px;
  /* padding: 1.5rem; */
  width: 120px;
}

.score-num {
  font-size: 5rem;
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

button {
  background: #333;
  color: white;
  padding: 0.5rem 1rem;
  margin: 0.3rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> -->


<style scoped>
:global(body, html) {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #000;
}

.scoreboard {
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  justify-content: space-evenly;
  padding: 1rem;
  box-sizing: border-box;
  color: #fff;
  font-family: sans-serif;
  text-align: center;
}

.flip-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
}

.score-card {
  background: #111;
  border: 3px solid #fff;
  border-radius: 10px;
  width: 15rem;
  padding: 1rem 0;
  cursor: pointer;
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
  background: #333;
  color: white;
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
    width: 80%;
  }

  .score-num {
    font-size: 3.5rem;
  }

  button {
    width: 90%;
    max-width: 300px;
    font-size: 1rem;
  }
}
</style>



<style>
.main-content .scoreboard #badmintonForm {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  color: #fff;
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
  color: #ccc;
  font-size: 0.95rem;
}

#badmintonForm select {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2b2b2b;
  color: #fff;
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

#badmintonForm span[role="alert"] {
  color: #ff4d4d !important;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
</style>



