<template>
  <div class="icon-grid">
    <div v-for="asset in pagedAssets" :key="asset.url" class="icon-card">
      <img
        loading="lazy"
        :src="asset.url"
        :alt="asset.fileName"
        class="filename"
        style="width: 100%"
      />
      <div class="mt-2 text-sm truncate" :title="asset.fileName">
        {{ asset.fileName }}
      </div>
      <div class="filetype">{{ asset.extension }}</div>
      <div v-if="asset.width" class="resolution">
        {{ asset.width }}×{{ asset.height }}
      </div>
    </div>
    <!-- 更多 icon-card -->
  </div>
</template>

<script setup >
import { ref, computed, watch, onMounted } from "vue";

defineOptions({
  name: "LookSVG",
  components: {},
});

// lazy 動態 import，不使用 eager
const imageModules = import.meta.glob("@/assets/icon/*", {
  eager: false,
  as: "url",
});

const allPaths = Object.keys(imageModules);

const pagedAssets = ref([]);

// 載入指定頁面資源資料(非同步)
const loadPageAssets = async (index) => {
  await new Promise((resolve) => setTimeout(resolve, 30)); // 50ms 延遲
  const pagePaths = allPaths.slice(index, index + 1);
  console.log(index);
  return await Promise.all(
    pagePaths.map(async (path) => {
      // 動態載入 URL
      const mod = await imageModules[path]();
      const url = mod.default || mod;
      const fileName = url.split("/").pop() ?? "";
      const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

      let width = null;
      let height = null;

      const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(
        extension
      );
      const isSvg = extension === "svg";

      if (isImage) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            width = img.width;
            height = img.height;
            resolve(true);
          };
          img.onerror = () => resolve(true);
          img.src = url;
        });
      } else if (isSvg) {
        try {
          const response = await fetch(url);
          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "image/svg+xml");
          const svg = doc.querySelector("svg");
          if (svg) {
            width = svg.getAttribute("width");
            height = svg.getAttribute("height");

            if ((!width || !height) && svg.hasAttribute("viewBox")) {
              const viewBox = svg.getAttribute("viewBox")?.split(" ") ?? [];
              width = viewBox[2] ?? null;
              height = viewBox[3] ?? null;
            }
          }
        } catch {
          // ignore fetch errors
        }
      }

      return { url, fileName, extension, width, height };
    })
  );
};

onMounted(async () => {
  console.log("onMounted");
  for (let index = 0; index < allPaths.length; index++) {
    await loadPageAssets(index)
      .then((res) => pagedAssets.value.push(...res))
      .catch((err) => console.error(err));
  }
});
</script>

<style>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;
}

.icon-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 8px;
}

.icon-card img {
  width: 100%;
  height: 100px;
  object-fit: contain;
}

.icon-card .filename {
  margin-top: 8px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-card .filetype,
.icon-card .resolution {
  font-size: 12px;
  color: #888;
}
</style>