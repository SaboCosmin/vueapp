<template>
  <div>
    <input
        type="text"
        v-model="searchTerm"
        placeholder="Search..."
        class="input input-bordered w-full mb-4"
    />
    <div class="overflow-x-auto max-h-96">
      <table class="table table-pin-rows">
        <thead>
        <tr>
          <th>Select</th>
          <th v-for="field in displaySchema" :key="field.key" class="capitalize">
            {{ field.label }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in filteredData" :key="item.id">
          <td>
            <input
                type="checkbox"
                :checked="isSelected(item)"
                @change="toggleSelection(item)"
                class="checkbox"
            />
          </td>
          <td v-for="field in displaySchema" :key="field.key">
            {{ item[field.key] }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: { id: any; [key: string]: any }[]; // Array of selected items
  data: { id: any; [key: string]: any }[]; // All available items
  modelClass: any; // The class of the entity (e.g., Product)
}>();

const emit = defineEmits(['update:modelValue']);

const searchTerm = ref('');

// --- Computed Properties ---

// Parse the entity schema and filter it to only show the primary key and descriptor
const displaySchema = computed(() => {
  const entityModel = getEntityModel(props.modelClass);
  if (!entityModel) return [];

  const { primaryKey, descriptor } = entityModel;
  return entityModel.fields.filter(field =>
      field.key === primaryKey || field.key === descriptor
  );
});

// Filter the available data based on the search term
const filteredData = computed(() => {
  if (!searchTerm.value) return props.data;
  const descriptorField = displaySchema.value.find(f => f.key !== getEntityModel(props.modelClass)?.primaryKey);
  const descriptorKey = descriptorField?.key;

  return props.data.filter(item => {
    if (descriptorKey && item[descriptorKey]) {
      return String(item[descriptorKey]).toLowerCase().includes(searchTerm.value.toLowerCase());
    }
    return false;
  });
});

// --- Methods ---

const isSelected = (item: { id: any }) => {
  return props.modelValue.some(selected => selected.id === item.id);
};

const toggleSelection = (item: { id: any; }) => {
  let newSelection = [...props.modelValue];
  if (isSelected(item)) {
    newSelection = newSelection.filter(selected => selected.id !== item.id);
  } else {
    newSelection.push(item);
  }
  emit('update:modelValue', newSelection);
};
</script>
