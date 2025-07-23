<!-- components/form-form-fields/BooleanFormField.vue -->
<template>
  <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="toggle toggle-primary ml-2"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
defineEmits(['update:modelValue']);
</script>
