<!-- components/form-fields/ColorPicker.vue -->
<template>
  <div class="flex items-center gap-2">
    <input
        type="color"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="p-1 h-10 w-10 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
    />
    <span class="font-mono text-sm">{{ modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | null;
}>();
defineEmits(['update:modelValue']);
</script>
