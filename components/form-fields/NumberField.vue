<!-- components/form-form-fields/NumberFormField.vue -->
<template>
  <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', parseFloat(($event.target as HTMLInputElement).value))"
      class="input input-bordered w-full"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
}>();
defineEmits(['update:modelValue']);
</script>
