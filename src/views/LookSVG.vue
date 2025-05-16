<template>
  <div class="p-4">
    <div
      class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      style="display: flex; flex-wrap: wrap"
    >
      <div
        v-for="asset in pagedAssets"
        :key="asset.url"
        class="border rounded shadow text-center p-2"
        style="width: 5%"
      >
        <img
          loading="lazy"
          :src="asset.url"
          :alt="asset.fileName"
          class="w-full h-40 object-contain"
          style="width: 100%"
        />
        <div class="mt-2 text-sm truncate" :title="asset.fileName">
          {{ asset.fileName }}
        </div>
        <div class="text-xs text-gray-500">{{ asset.extension }}</div>
        <div v-if="asset.width" class="text-xs text-gray-400">
          {{ asset.width }}×{{ asset.height }}
        </div>
      </div>
    </div>
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