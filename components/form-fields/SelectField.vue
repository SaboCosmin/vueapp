<!-- components/form-form-fields/SelectFormField.vue -->
<template>
  <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: string[];
}>();
defineEmits(['update:modelValue']);
</script>
