<template>
  <div class="bg-base-100 p-4 rounded-lg shadow-md">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th class="w-10">
            <input 
              type="checkbox" 
              class="checkbox" 
              :checked="allSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th v-for="field in schema" :key="field.key">{{ field.label }}</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in paginatedData"
            :key="item.id"
            class="hover transition-colors duration-200"
        >
          <td>
            <input 
              type="checkbox" 
              class="checkbox" 
              :checked="isSelected(item)"
              @change="toggleSelect(item)"
            />
          </td>
          <td v-for="field in schema" :key="field.key">
            <template v-if="field.type === 'custom'">
              <component
                  v-if="field.cellComponent"
                  :is="field.cellComponent"
                  :value="item[field.key]"
              />
              <template v-else>
                {{ item[field.key] }}
              </template>
            </template>
            <template v-else-if="field.type === 'hasOne'">
              <span>{{ getHasOneDisplay(item[field.key], field.props) }}</span>
            </template>
            <template v-else-if="field.type === 'hasMany'">
              <div class="flex flex-wrap items-center gap-1">
                  <span
                      v-for="val in getHasManyDisplay(item[field.key], field.props).slice(0, 2)"
                      :key="val"
                  >
                    {{ val }}
                  </span>
                <div
                    v-if="getHasManyDisplay(item[field.key], field.props).length > 2"
                    class="tooltip"
                    :data-tip="getHasManyDisplay(item[field.key], field.props).slice(2).join(', ')"
                >
                    <span class="badge badge-ghost">
                      +{{ getHasManyDisplay(item[field.key], field.props).length - 2 }} more
                    </span>
                </div>
              </div>
            </template>
            <template v-else-if="field.type === 'boolean'">
                <span class="badge" :class="item[field.key] ? 'badge-success' : 'badge-error'">
                  {{ item[field.key] ? 'Yes' : 'No' }}
                </span>
            </template>
            <template v-else>
              {{ item[field.key] }}
            </template>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="data.length === 0" class="text-center p-8 text-base-content/60">
        No data to display.
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <div class="join">
        <button @click="prevPage" class="join-item btn" :disabled="currentPage === 1">«</button>
        <button class="join-item btn btn-active">Page {{ currentPage }} of {{ totalPages }}</button>
        <button @click="nextPage" class="join-item btn" :disabled="currentPage === totalPages">»</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue';
import type { PropType } from 'vue';
import { type FieldMetadata } from '~/utils/ui-metadata';
import { useDisplayLogic } from '~/composables/useDisplayLogic';

const props = defineProps({
  schema: {
    type: Array as PropType<FieldMetadata[]>,
    required: true,
  },
  data: {
    type: Array as PropType<{ id: any; [key: string]: any }[]>,
    required: true,
  },
  allRelatedData: {
    type: Object as PropType<Record<string, any[]>>,
    default: () => ({}),
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  preselectedItems: {
    type: Array as PropType<{ id: any; [key: string]: any }[]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:selectedItems']);

// Use the composable for display logic
const { getHasOneDisplay, getHasManyDisplay } = useDisplayLogic(toRef(props, 'allRelatedData'));

// --- Selection State ---
const selectedItems = ref<{ id: any; [key: string]: any }[]>([]);

// Initialize with preselected items
watch(() => props.preselectedItems, (newValue) => {
  selectedItems.value = [...newValue];
}, { immediate: true });

const isSelected = (item: { id: any }) => {
  return selectedItems.value.some((selectedItem) => selectedItem.id === item.id);
};

const toggleSelect = (item: { id: any; [key: string]: any }) => {
  if (isSelected(item)) {
    selectedItems.value = selectedItems.value.filter(
        (selectedItem) => selectedItem.id !== item.id
    );
  } else {
    selectedItems.value.push(item);
  }
  emit('update:selectedItems', selectedItems.value);
};

const allSelected = computed(() => {
  return props.data.length > 0 && props.data.every(item => isSelected(item));
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Remove all current page items from selection
    const currentPageIds = paginatedData.value.map(item => item.id);
    selectedItems.value = selectedItems.value.filter(
        item => !currentPageIds.includes(item.id)
    );
  } else {
    // Add all current page items to selection
    paginatedData.value.forEach(item => {
      if (!isSelected(item)) {
        selectedItems.value.push(item);
      }
    });
  }
  emit('update:selectedItems', selectedItems.value);
};

// --- Pagination State ---
const currentPage = ref(1);

// --- Computed Properties for Pagination ---
const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.pageSize);
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  return props.data.slice(startIndex, endIndex);
});

// --- Pagination Methods ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>
