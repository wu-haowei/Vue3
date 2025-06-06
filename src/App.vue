<template>
  <div class="app-container">
    <!-- 側邊欄 -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <button
            @click="toggleDarkMode"
            class="not-hover-style-btn"
            style="width: 40%"
          >
            切換主題（{{ isDark ? "深色" : "淺色" }}）
          </button>
          <button
            @click="RequestWakeLock"
            class="not-hover-style-btn"
            style="width: 40%"
          >
            螢幕長亮（{{ isRequestWakeLock ? "關閉" : "啟用" }}）
          </button>

          <RouterLink to="/LogIn" class="link">
            {{ store.getters["isLogin"] ? "🔐 登出" : "🔓 登入" }}
          </RouterLink>
          <RouterLink to="/" class="link">🏠 Home</RouterLink>
          <RouterLink to="/Badminton" class="link">🏸 羽球記分板</RouterLink>
          <button class="menu-toggle not-hover-style-btn" @click="toggleMenu">
            📂 功能列表 <span>{{ isMenuOpen ? "▲" : "▼" }}</span>
          </button>
          <Transition name="submenu-slide">
            <div v-show="isMenuOpen" class="submenu">
              <RouterLink
                v-for="route in otherRoutes"
                :key="route.to"
                :to="route.to"
                class="link"
              >
                {{ route.label }}
              </RouterLink>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- 頂部標題列 -->
    <header class="fixed-header">
      <h1>我的應用</h1>
    </header>

    <button
      class="toggle-btn"
      :class="{ 'sidebar-open': isSidebarOpen }"
      @click="toggleSidebar"
      role="button"
      aria-label="切換側邊欄"
    >
      <span :class="['burger-line', { 'line-top': isSidebarOpen }]"></span>
      <span :class="['burger-line', { 'line-middle': isSidebarOpen }]"></span>
      <span :class="['burger-line', { 'line-bottom': isSidebarOpen }]"></span>
    </button>

    <!-- 背景遮罩 -->
    <div class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>

    <!-- 主內容 -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition
          name="slide"
          :mode="$route.meta.mode"
          @after-enter="onAfterEnter"
        >
          <KeepAlive :include="['KeepAlive', 'Badminton']">
            <component :is="Component" :key="$route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import store from "@/stores/stores";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const isDark = ref(false);
const isSidebarOpen = ref(false);
const isMenuOpen = ref(false);
const wakeLock = ref(null);
const isRequestWakeLock = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle("dark", isDark.value);
};

const RequestWakeLock = async () => {
  try {
    isRequestWakeLock.value = !isRequestWakeLock.value;
    if (isRequestWakeLock.value) {
      wakeLock.value = await navigator.wakeLock.request("screen");
      proxy.$toast.success("已啟用", 1000);
      document.addEventListener("visibilitychange", async () => {
        if (wakeLock.value && document.visibilityState === "visible") {
          wakeLock.value = await navigator.wakeLock.request("screen");
        }
      });
    } else {
      await wakeLock.value?.release();
      wakeLock.value = null;
      proxy.$toast.success("已關閉", 1000);
    }
  } catch {
    proxy.$toast.error("發生錯誤", 1000);
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleMenu = () => {
  if (!store.getters["isLogin"]) {
    router.push("/Login");
  } else {
    isMenuOpen.value = !isMenuOpen.value;
  }
};

const onAfterEnter = () => {
  const hash = window.location.hash.split("#")[2];
  if (hash) {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

router.afterEach(() => {
  isSidebarOpen.value = false;
});

onMounted(() => {
  store.dispatch("connect");
});

const otherRoutes = [
  { to: "/Hash#start", label: "定位 Id" },
  { to: "/inputbar", label: "驗證碼" },
  { to: "/validate", label: "表單驗證" },
  { to: "/Router", label: "異動提示" },
  { to: "/Suspense", label: "Suspense" },
  { to: "/Canvas", label: "簽名檔" },
  { to: "/Notion", label: "Notion" },
  { to: "/ToDoList", label: "ToDoList" },
  { to: "/KeepAlive", label: "KeepAlive" },
  { to: "/KeepAliveNot", label: "KeepAliveNot" },
  { to: "/ModelModifires", label: "v-model 修飾符" },
  { to: "/Slot", label: "slot" },
  { to: "/SlotFancyList", label: "SlotFancyList" },
  { to: "/Inject", label: "Inject" },
  { to: "/StaggeringListTransitions", label: "漸進延遲動畫" },
  { to: "/TeleportView", label: "Teleport" },
  { to: "/Draggable", label: "拖曳欄位" },
  { to: "/USTreasurySecurities", label: "10年期美國公債" },
  { to: "/IntersectionObserver", label: "圖片懶加載" },
  { to: "/AdvancedChatOpenAI", label: "即時通訊" },
  { to: "/IndexedDB", label: "IndexedDB" },
  { to: "/LookSVG", label: "SVG清單" },
  { to: "/IAsyncEnumerable", label: "非同步回應" },
];
</script>

<style scoped>
.app-container {
  position: relative;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(10px);
  z-index: 998;
  display: flex;
  align-items: center;
  padding: 0 1rem 0 4rem; /* 左側留出空間避免文字被 toggle-btn 蓋到 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar.open {
  transform: translateX(0);
}
.sidebar-header {
  padding: 10px;
}
.sidebar-content {
  padding: 10px;
  overflow-y: auto;
}

.toggle-btn {
  position: fixed;
  z-index: 1100;
  background-color: #2c3e50;
  border: none;
  color: white;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.toggle-btn.move-inside {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  left: auto;
  z-index: 1101;
}

.toggle-btn.sidebar-open {
  left: 260px;
  transition: all 0.3s ease;
}

.submenu {
  overflow: hidden;
}

.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: all 0.3s ease;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}
.burger-line {
  width: 20px;
  height: 2px;
  background-color: white;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: block;
  border-radius: 1px;
  transform-origin: center;
}

/* 打開狀態（三條線變叉叉） */
.line-top {
  transform: translateY(9px) rotate(45deg);
}
.line-middle {
  opacity: 0;
}
.line-bottom {
  transform: translateY(-7px) rotate(-45deg);
}

.link {
  display: block;
  padding: 8px;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
.link:hover {
  background-color: #34495e;
}
.menu-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  padding: 8px 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.submenu {
  margin-left: 8px;
  margin-top: 8px;
}

.main-content {
  margin: 10px auto;
  max-width: 90%;
  padding-top: 80px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s, transform 1s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(30%);
}
</style>
