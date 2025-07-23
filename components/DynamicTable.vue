<template>
  <div class="bg-base-100 p-4 rounded-lg shadow-md">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th v-for="field in schema" :key="field.key">{{ field.label }}</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in paginatedData"
            :key="item.id"
            @click="handleRowClick(item)"
            class="hover cursor-pointer transition-colors duration-200"
            :class="{ 'row-selected': item.id === selectedItemId }"
        >
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
import { ref, computed, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import { type FieldMetadata } from '~/utils/ui-metadata';

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
});

const emit = defineEmits(['selectRow']);

// --- Display Logic for Relationships ---
const getHasOneDisplay = (value: any, fieldProps: Record<string, any>): string => {
  if (!value) return '';
  const { descriptor } = fieldProps;
  if (typeof value === 'object' && value !== null) {
    return value[descriptor] || value.id || '';
  }
  const id = value;
  const { relatedEntityName } = fieldProps;
  if (!relatedEntityName) return String(id);
  const relatedData = props.allRelatedData[relatedEntityName.toLowerCase()];
  if (!relatedData) return String(id);
  const item = relatedData.find(d => d.id === id);
  return item ? item[descriptor] : String(id);
};

const getHasManyDisplay = (values: any[], fieldProps: Record<string, any>): string[] => {
  if (!values || values.length === 0) return [];
  return values.map(value => getHasOneDisplay(value, fieldProps));
};

// --- Selection State ---
const selectedItemId = ref<any | null>(null);

const handleRowClick = (item: { id: any; }) => {
  selectedItemId.value = item.id;
  emit('selectRow', item);
};

// --- Default Selection Logic ---
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0 && selectedItemId.value === null) {
    handleRowClick(newData[0]);
  }
}, { immediate: true });

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
    selectedItemId.value = null;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectedItemId.value = null;
  }
};

// Watch for external data changes to reset selection if needed.
watch(() => props.data, () => {
  if(selectedItemId.value && !props.data.some(item => item.id === selectedItemId.value)) {
    selectedItemId.value = null;
  }
}, { deep: true });
</script>
