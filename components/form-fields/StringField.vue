<template>
  <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="input input-bordered w-full"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();
defineEmits(['update:modelValue']);
</script>
