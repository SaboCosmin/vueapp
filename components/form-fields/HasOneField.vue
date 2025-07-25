<template>
  <select
      :value="modelValue?.id"
      @change="handleChange"
      @mousedown.once="requestData"
      class="select select-bordered w-full"
  >
    <option v-if="!relatedData || relatedData.length === 0" disabled :value="undefined">
      Loading...
    </option>
    <option v-else disabled :value="undefined">Select a {{ relatedEntityName }}</option>
    <option v-for="item in relatedData" :key="item.id" :value="item.id">
      {{ item.name || item.id }}
    </option>
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  // The modelValue is now expected to be the full object or null
  modelValue: { id: any; [key: string]: any } | null;
  relatedEntityName: string;
  relatedData: { id: any; name?: string }[];
  onFetchData: (entityName: string) => Promise<void>;
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (event: Event) => {
  const selectedId = (event.target as HTMLSelectElement).value;

  // Find the full object from the relatedData array based on the selected ID
  const foundItem = props.relatedData.find(item => {
    // The ID from the event is a string, so we compare loosely
    return String(item.id) === selectedId;
  });

  // Emit the entire found object, or null if nothing was found
  emit('update:modelValue', foundItem || null);
};

const requestData = () => {
  if (props.onFetchData) {
    props.onFetchData(props.relatedEntityName);
  }
};
</script>
