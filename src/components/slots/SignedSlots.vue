<template>
  <div>
    <div class="container">
      <slot name="header" :text="text">
        <!-- 標題內容放在這裡 -->
        header Defualt
      </slot>
      <slot :text="text">
        <!-- 主要內容放在這裡 -->
        main Defualt
      </slot>
      <slot name="footer">
        <!-- 底部內容放這裡 -->
        footer Defualt
      </slot>
      {{text}}
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
const text = ref('#####');


</script>

<style>
footer {
  border-top: 1px solid #ccc;
  color: #666;
  font-size: 0.8em;
}
</style>
