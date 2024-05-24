<template>
  <div class="form-group inside">
    {{ props.modelModifiers }}
    <input v-model="value"/>
    <button @click="value++" :=$attrs>ADD</button>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
})
import { computed } from "vue";
const props = defineProps({
  modelValue: Number,
  modelModifiers: { default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (props.modelModifiers.specifyModifiers) value *= 10;//乘

    emit('update:modelValue', value)
  }
})

</script>
<!-- :modelValue="props.modelValue" -->
<!-- v-bind="$attrs"  父層傳進資料都綁定到上面 -->