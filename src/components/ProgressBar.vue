<template>
  <div class="form-group">
    <label :for="props.name">{{ props.label }}</label>

    <VField :name="props.name" :label="props.label" :placeholder="props.placeholder"
      @input="$emit('modelUpdate', $event)" :id="props.name" class="" v-bind="$attrs" />
    <ErrorMessage :name="props.name" class="" />
  </div>
</template>

<script setup>
// inheritattrs: false
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, required: false },
});
</script>
<!-- :modelValue="props.modelValue" -->
<!-- v-bind="$attrs"  父層傳進資料都綁定到上面 -->