<template>
  <div
      class="badge badge-lg border-2"
      :style="{ backgroundColor: value, color: getTextColor(value) }"
  >
    {{ value }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>();

const getTextColor = (hexColor: string) => {
  if (!hexColor) return '#000';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000' : '#fff';
};
</script>
