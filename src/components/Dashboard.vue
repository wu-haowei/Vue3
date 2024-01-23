<script setup>
const { time } = defineProps({
  time: { type: Number },
});

const promise = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

await promise(time);
</script>

<template>
  <img src="https://seeklogo.com/images/V/vite-logo-BFD4283991-seeklogo.com.png" />
</template>