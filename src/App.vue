<template>
  <div class="app-container">
    <!-- 側邊選單 -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <button class="toggle-btn" @click="toggleSidebar">
            <template v-if="!isSidebarOpen">
              <span class="burger-line"></span>
              <span class="burger-line"></span>
              <span class="burger-line"></span>
            </template>
            <template v-else>
              <span class="burger-line cross-line1"></span>
              <span class="burger-line cross-line2"></span>
            </template>
          </button>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          切換主題（{{ isDark ? "深色" : "淺色" }}）
        </button>
        <RouterLink to="/LogIn" class="link" v-show="!store.getters['isLogin']"
          >🔐 LogIn</RouterLink
        >

        <RouterLink to="/" class="link">🏠 Home</RouterLink>
        <RouterLink to="/Badminton" class="link">🏸 羽球記分板</RouterLink>

        <div class="menu-group">
          <button class="menu-toggle" @click="toggleMenu">
            📂 功能列表
            <span>{{ isMenuOpen ? "▲" : "▼" }}</span>
          </button>
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
        </div>
      </div>
    </aside>

    <!-- 背景遮罩 -->
    <div class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>

    <!-- 主內容 -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <!-- <KeepAlive :include="['KeepAlive','Badminton']"> -->
          <KeepAlive :include="keepAlive">
            <component :is="Component" :key="$route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

/*
RouterLink |  <router-link> 在 <template> 中建立可點擊切換頁面的連結（相當於 <a>）。可綁定 to 屬性跳轉。
RouterView |  <router-view> 指定 <router-view> 呈現當前路由對應的元件，是路由內容顯示區塊。
useRoute   |  取得當前路由物件（route），可以取 params、query、name、path 等資訊。
useRouter  |  取得路由實例（router），可以進行 push、replace、back 等路由操作。
*/

import store from "@/stores/stores";

const route = useRoute();
const router = useRouter();

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle("dark", isDark.value);
};

const isSidebarOpen = ref(false);
const isMenuOpen = ref(false);
const keepAlive = computed(() => {
  return route.meta.keepAlive === true ? [route.meta.name] : [];
});
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleMenu = () => {
  if (!store.getters["isLogin"]) {
    router.push("Login");
  } else {
    isMenuOpen.value = !isMenuOpen.value;
  }
};

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
  // { to: "/VueDragResize", label: "拖曳套件" },
  { to: "/AdvancedChatOpenAI", label: "即時通訊" },
  { to: "/IndexedDB", label: "IndexedDB" },
];
</script>


<style>
/* 左側插入 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s, transform 1s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(30%);
}

/* 左側插入 */
.moveUp-enter-active {
  animation: fadIn 1s ease-in;
}
/* @keyframes fadIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
} */
/* .moveUp-leave-active {
  animation: moveUp 0.3s ease-in;
} */
/* @keyframes moveUp {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-400px);
  }
} */

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
} */

/* .fade-enter,
.fade-leave-to {
  opacity: 0;
} */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.app-container {
  position: relative;
  /* height: 100vh; */
  overflow: hidden;
}

/* 側邊欄覆蓋主畫面 */
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
  right: -56px;
  top: 0;
  position: fixed;
  padding: 10px;
  background-color: #2c3e50;
}

.toggle-btn {
  right: -50px;
  background-color: #2c3e50;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px 0 0 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.burger-line {
  width: 20px;
  height: 2px;
  background-color: white;
  display: block;
}

/* 交叉的 X 樣式 */
.cross-line1 {
  transform: rotate(45deg) translate(3px, 3px);
}

.cross-line2 {
  transform: rotate(-45deg) translate(3px, -3px);
}

.sidebar-content {
  position: relative;
  padding: 10px;
  overflow-y: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 900;
}

.link {
  display: block;
  padding: 8px;
  text-decoration: none;
  color: white;
  border-radius: 4px;
}
.link:hover {
  background-color: #34495e;
}

.menu-group {
  margin-top: 16px;
}
.menu-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  padding: 8px 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.submenu {
  margin-left: 8px;
  margin-top: 8px;
}

.main-content {
  /* padding: 100px 50px 0 50px; */
  margin: 5rem auto;
  max-width: 90%;
  /* overflow-y: auto; */
  /* height: 100vh; */
}

/* 過場動畫保留 */
/* .slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
} */
</style>
