<template>
  <div class="app-container">
    <!-- 側邊選單 -->
    <aside :class="['sidebar', { collapsed: !isSidebarOpen }]">
      <!-- 固定在頂部的開關按鈕 -->
      <div class="sidebar-header">
        <button class="toggle-btn" @click="toggleSidebar">
          {{ isSidebarOpen ? "←" : "→" }}
        </button>
      </div>

      <!-- 只有展開時顯示內容 -->
      <div v-if="isSidebarOpen" class="sidebar-content">
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

    <!-- 主內容 -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="slide">
          <KeepAlive :include="['KeepAlive']">
            <component :is="Component" :key="$route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();

const isSidebarOpen = ref(true);
const isMenuOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 將除了 "123" 的所有功能選項集中管理
const otherRoutes = [
  { to: "/", label: "🏠 Home" },
  { to: "/about", label: "📄 About" },
  { to: "/Hash#start", label: "定位 Id" },
  { to: "/inputbar", label: "驗證碼" },
  { to: "/validate", label: "表單驗證" },
  { to: "/Router", label: "異動提示" },
  { to: "/Vuex", label: "Vuex(登入口)" },
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
  { to: "/VueDragResize", label: "拖曳套件" },
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
@keyframes fadIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
.moveUp-leave-active {
  animation: moveUp 0.3s ease-in;
}
@keyframes moveUp {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-400px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/* 
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

 */

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 0px;
}

.sidebar.collapsed .sidebar-header {
  position: absolute;
  left: 0px;
}

.sidebar-header {
  position: sticky;
  top: 0;
  background-color: #2c3e50;
  padding: 10px;
  z-index: 1;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.sidebar-content {
  padding: 10px;
  flex: 1;
  overflow-y: auto;
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
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
