<script setup>
const props = defineProps(["modelValue"]);

const emit = defineEmits(["update:modelValue"]);
</script>
 <template>
  <div>
    <input
      type="text"
      :value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
