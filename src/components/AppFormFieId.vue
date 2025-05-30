<template>
  <div class="form-group">
    <label :for="props.name">{{ props.label }}</label>
    <VField
      v-slot="{ field }"
      :name="props.name"
      :type="props.type"
      :label="props.errLabel"
      :value="props.modelValue"
      v-bind="$attrs"
    >
      <template v-if="props.type === 'select'">
        <select
          v-bind="{ ...props.dynamicAttribute, ...field }"
          :id="props.id || props.name"
          :class="props.name"
        >
          <option
            v-for="(opt, idx) in props.options"
            :key="idx"
            :value="opt.value"
            :disabled="opt.isDisabled || false"
          >
            {{ opt.label }}
          </option>
        </select>
      </template>

      <template v-else-if="props.type === 'checkbox'">
        <input type="checkbox" v-bind="field" :id="props.name" />
      </template>

      <template v-else>
        <input
          :type="props.type"
          :placeholder="props.placeholder"
          :label="props.errLabel"
          :id="props.id || props.name"
          v-bind="{ ...props.dynamicAttribute, ...field }"
        />
      </template>
    </VField>

    <ErrorMessage :name="props.name" class="error" />
  </div>
</template>

<script setup>
// inheritattrs: false
const props = defineProps({
  name: { type: String, required: true },
  errLabel: { type: String, required: false },
  label: { type: String, required: true },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, required: false },
  type: { type: String, default: "text" }, // input / select / checkbox
  options: {
    type: Array,
    default: () => [{ label: "-- 請選擇 --", value: "", isDisabled: true }],
  },
  dynamicAttribute: {
    type: Object,
    default: () => ({}),
  },
});
</script>



<!-- :modelValue="props.modelValue" -->
<!-- v-bind="$attrs"  父層傳進資料都綁定到上面 -->
<style scoped>
input {
  /* https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing */
  box-sizing: border-box;
}
</style>