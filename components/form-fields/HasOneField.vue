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
      {{ item[descriptor] || item.id }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { getEntityModel } from '~/utils/entity-system';

const props = defineProps<{
  modelValue: { id: any; [key: string]: any } | null;
  relatedEntityClass: any;
  relatedData: { id: any; [key: string]: any }[];
  descriptor: string;
  onFetchData: (entityName: string) => Promise<void>;
}>();

const emit = defineEmits(['update:modelValue']);

// Safely get the entity name at runtime, not at decorator-time
const relatedEntityName = getEntityModel(props.relatedEntityClass)?.name || '';

const handleChange = (event: Event) => {
  const selectedId = (event.target as HTMLSelectElement).value;
  const foundItem = props.relatedData.find(item => String(item.id) === selectedId);
  emit('update:modelValue', foundItem || null);
};

const requestData = () => {
  if (props.onFetchData && relatedEntityName) {
    props.onFetchData(relatedEntityName);
  }
};
</script>
