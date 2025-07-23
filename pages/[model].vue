<template>
  <div class="p-8 bg-base-300 min-h-screen">
    <div v-if="isLoading" class="text-center pt-16">
      <span class="loading loading-lg"></span>
    </div>
    <div v-else-if="entityStore?.error" class="alert alert-error">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ entityStore.error }}</span>
      </div>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6 capitalize">{{ modelConfig?.name }} Management</h1>

      <div class="mb-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <button class="btn btn-primary" @click="handleCreate">Create New {{ modelName }}</button>
          <button class="btn btn-error btn-outline" @click="handleDelete" :disabled="!selectedItem?.id">Delete</button>
        </div>
        <span v-if="entityStore?.isLoading" class="loading loading-spinner text-primary"></span>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-3/5">
          <DynamicTable
              :schema="modelSchema"
              :data="entityStore?.allItems || []"
              :all-related-data="relatedDataCache"
              @selectRow="handleSelect"
          />
        </div>

        <div class="w-full lg:w-2/5">
          <DynamicForm
              v-if="isFormVisible"
              :schema="modelSchema"
              :initial-data="selectedItem"
              :related-data="relatedDataCache"
              :on-fetch-related-data="ensureRelatedData"
              @save="handleSave"
              @cancel="handleCancel"
          />
          <div v-else class="flex items-center justify-center h-full bg-base-100 rounded-lg p-8 text-center text-base-content/60">
            <p>Select an item to edit or create a new one.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { modelRegistry } from '~/utils/models.config';
import { mockCrudService } from '~/services/mockCrudService';
import { defineEntityStore } from "~/store/useEntityStore";

const route = useRoute();
const modelName = ref(route.params.model as string);

const entityStore = ref<any>(null);
const modelConfig = ref(modelRegistry[modelName.value]);
const modelSchema = ref([]);
const selectedItem = ref<any | null>(null);
const isFormVisible = ref(false);
const isLoading = ref(true);

const relatedDataCache = ref<Record<string, any[]>>({});

/**
 * Fetches data for a related entity and caches it.
 */
async function ensureRelatedData(entityName: string) {

  const key = entityName.toLowerCase()
  if (relatedDataCache.value[key]) return;

  try {
    const data = await mockCrudService.getAll(key);
    relatedDataCache.value[key] = data;
  } catch(e) {
    console.error(`Failed to fetch related data for ${entityName}`, e);
  }
}

/**
 * Scans the schema and pre-fetches all necessary data for relationships.
 */
async function fetchAllRelatedData(schema: any[]) {
  const relatedEntities = new Set<string>();
  schema.forEach(field => {
    // Check for the class, not the name
    if ((field.type === 'hasOne' || field.type === 'hasMany') && field.props.relatedEntityClass) {
      // Resolve the name at runtime here, which is safer
      const entityModel = getEntityModel(field.props.relatedEntityClass);
      if (entityModel?.name) {
        relatedEntities.add(entityModel.name);
      }
    }
  });

  const fetchPromises = Array.from(relatedEntities).map(entityName =>
      ensureRelatedData(entityName)
  );

  await Promise.all(fetchPromises);
}


onMounted(async () => {
  const useStore = defineEntityStore(modelName.value);
  entityStore.value = useStore();

  if (modelConfig.value) {
    try {
      modelSchema.value = parseEntitySchema(modelConfig.value.modelClass);

      // Fetch the main data and all related data concurrently
      await Promise.all([
        entityStore.value.fetchAll(),
        fetchAllRelatedData(modelSchema.value)
      ]);

    } catch(e: any) {
      if(entityStore.value) entityStore.value.error = e.message;
    } finally {
      isLoading.value = false;
    }
  } else {
    if(entityStore.value) entityStore.value.error = `Configuration for model "${modelName.value}" not found in modelRegistry.`;
    isLoading.value = false;
  }
});

// --- Event Handlers ---
const handleSelect = (item: any) => {
  selectedItem.value = { ...item };
  isFormVisible.value = true;
};

const handleCreate = () => {
  selectedItem.value = null;
  isFormVisible.value = true;
};

const handleSave = (itemToSave: any) => {
  if (!entityStore.value) return;
  if (itemToSave.id) {
    entityStore.value.updateItem(itemToSave);
  } else {
    entityStore.value.createItem(itemToSave);
  }
  isFormVisible.value = false;
  selectedItem.value = null;
};

const handleDelete = () => {
  if (!selectedItem.value?.id || !entityStore.value) return;
  if (confirm(`Are you sure you want to delete this item?`)) {
    entityStore.value.deleteItem(selectedItem.value.id);
    isFormVisible.value = false;
    selectedItem.value = null;
  }
}

const handleCancel = () => {
  isFormVisible.value = false;
  selectedItem.value = null;
};
</script>
