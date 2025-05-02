<template>
  <div class="form-group">
    <label :for="props.name">{{ props.lable }}</label>

    <!-- <VField :name="props.name" :lable="props.lable" :placeholder="props.placeholder"
      @input="$emit('modelUpdate', $event)" :id="props.name" :class="props.name" v-bind="$attrs"/>
    <ErrorMessage :name="props.name" class="" /> -->

    <VField
      v-slot="{ field }"
      :name="props.name"
      :type="props.type"
      :value="props.modelValue"
      v-bind="$attrs"
    >
      <template v-if="props.type === 'select'">
        <select v-bind="field" :id="props.name" :class="props.name">
          <option value="" disabled>-- 請選擇 --</option>
          <option
            v-for="(opt, idx) in props.options"
            :key="idx"
            :value="opt.value"
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
          v-bind="field"
          :type="props.type"
          :placeholder="props.placeholder"
          :id="props.name"
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
  lable: { type: String, required: true },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, required: false },
  type: { type: String, default: "text" }, // input / select / checkbox
  options: {
    type: Array,
    default: () => [],
  },
});
</script>
<!-- :modelValue="props.modelValue" -->
<!-- v-bind="$attrs"  父層傳進資料都綁定到上面 -->