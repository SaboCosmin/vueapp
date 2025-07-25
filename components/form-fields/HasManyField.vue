<template>
  <div ref="multiselectWrapper" class="relative w-full">
    <div
        class="input input-bordered flex  h-auto min-h-12 overflow-y-auto max-h-36 w-full items-center gap-2 p-2 pr-12 flex-wrap"
        @click="toggleDropdown"
    >
      <div
          v-for="item in modelValue"
          :key="item.id"
          class="badge badge-ghost gap-2"
      >
        {{ item.name }}
        <button
            class="btn btn-circle btn-ghost btn-xs"
            @click.stop="removeItem(item)"
        >
          ✕
        </button>
      </div>

      <input
          ref="inputRef"
          v-model="searchTerm"
          type="text"
          :placeholder="placeholderText"
          class="input input-ghost h-auto flex-grow p-0 focus:border-none focus:outline-none min-w-[100px]"
          @focus="openDropdown"
      />

      <div
          class="absolute right-2 top-3 transform cursor-pointer p-2"
          @click.stop="openAdvancedSearch"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
        >
          <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <ul
        v-show="isOpen"
        class="menu absolute menu-horizontal w-full gap-1 overflow-y-auto h-52 bg-base-200 rounded-box shadow"
    >
      <li v-if="filteredOptions.length === 0">
        <span class="text-base-content/60">No options found.</span>
      </li>
      <li v-for="option in filteredOptions" :key="option.id" class="w-full">
        <a
            :class="{ 'menu-active': isSelected(option) }"
            @click.prevent="selectOption(option)"
        >
          {{ option.name }}
        </a>
      </li>
    </ul>

    <dialog ref="modalRef" class="modal">
      <div class="modal-box max-w-4xl">
        <h3 class="text-lg font-bold">Select {{ relatedEntityName }}</h3>
        
        <div v-if="tableData.length > 0" class="py-4">
          <SelectableTable
            :schema="tableSchema"
            :data="tableData"
            :preselected-items="selectedItems"
            @update:selectedItems="selectedItems = $event"
          />
        </div>
        <div v-else class="py-4 text-center text-base-content/60">
          Loading data...
        </div>
        
        <div class="modal-action">
          <button class="btn btn-primary" @click="confirmSelection">Confirm</button>
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SelectableTable from '~/components/SelectableTable.vue';
import { getEntityMetadata, ENTITY_REGISTRY } from '~/utils/ui-metadata';

// Define Props and Emits to match the original component
const props = defineProps<{
  modelValue: { id: any; name?: string }[];
  relatedEntityName: string;
  relatedData: { id: any; name?: string }[];
}>();

const emit = defineEmits(['update:modelValue', 'search-click']);

// --- Component State ---
const isOpen = ref(false);
const searchTerm = ref('');
const multiselectWrapper = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// --- Advanced Search State ---
// Stores the data to be displayed in the table
const tableData = ref<any[]>([]);
// Defines the columns to be displayed in the table
const tableSchema = ref<any[]>([]);
// Tracks the items selected in the table
const selectedItems = ref<any[]>([]);

/**
 * Helper function to find an entity class by its name.
 * Iterates through the ENTITY_REGISTRY to find the entity with the matching name.
 * @param entityName The name of the entity to find
 * @returns The entity class or undefined if not found
 */
const findEntityClassByName = (entityName: string): any | undefined => {
  if (!entityName) return undefined;
  return ENTITY_NAME_REGISTRY.get(entityName.toLowerCase());
};

// --- Computed Properties ---
const placeholderText = computed(() => {
  // Show placeholder only if no items are selected
  return props.modelValue.length > 0 ? '' : `Select ${props.relatedEntityName}`;
});

const filteredOptions = computed(() => {
  if (!searchTerm.value) {
    return props.relatedData;
  }
  return props.relatedData.filter((option) =>
      option.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// --- Methods ---
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if(isOpen.value) {
    // Focus the input when the dropdown is opened by clicking the container
    inputRef.value?.focus();
  }
};

const openDropdown = () => {
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const isSelected = (option: { id: any }) => {
  return props.modelValue.some((item) => item.id === option.id);
};

const selectOption = (option: { id: any; name?: string }) => {
  if (isSelected(option)) {
    // If the option is already selected, remove it
    removeItem(option);
  } else {
    // Otherwise, add it
    const newSelection = [...props.modelValue, option];
    emit('update:modelValue', newSelection);
  }
  // Clear search term and keep the dropdown open for further selections
  searchTerm.value = '';
  inputRef.value?.focus();
};

const removeItem = (itemToRemove: { id: any }) => {
  const newSelection = props.modelValue.filter(
      (item) => item.id !== itemToRemove.id
  );
  emit('update:modelValue', newSelection);
};

/**
 * Opens the advanced search dialog with a table of related entities.
 * The table includes:
 * - A checkbox column for selection
 * - The primary key (ID) column
 * - The descriptor column (if available)
 * 
 * Previously selected entities are pre-selected in the table.
 * Data is fetched after the dialog is opened for better responsiveness.
 */
const openAdvancedSearch = () => {
  // Reset table data and schema
  tableData.value = [];
  tableSchema.value = [];
  selectedItems.value = [];
  
  // First open the dialog to improve responsiveness
  modalRef.value?.showModal();
  
  // Emit an event so the parent component knows the modal was opened
  emit('search-click');
  
  loadTableData();
};

/**
 * Loads the table data and schema for the advanced search dialog.
 * This is called after the dialog is opened to improve UI responsiveness.
 */
const loadTableData = () => {
  // Set up the table schema based on entity metadata
  const entityClass = findEntityClassByName(props.relatedEntityName);

  let entityMeta = null;

  entityMeta = getEntityMetadata(entityClass);
  console.log(entityMeta);

  if (entityMeta) {
    // Create schema with ID column
    tableSchema.value = [
      {
        key: entityMeta.primaryKey || 'id', // Fallback to 'id' if primaryKey is not defined
        label: 'ID',
        type: 'string',
        props: {}
      }
    ];

    // Add descriptor column if available
    if (entityMeta.descriptor) {
      tableSchema.value.push({
        key: entityMeta.descriptor,
        label: entityMeta.fields.find(f => f.key === entityMeta.descriptor)?.label || 'Description',
        type: 'string',
        props: {}
      });
    } else if (props.relatedData.length > 0 && props.relatedData[0].name !== undefined) {
      // If no descriptor is defined but items have a name property, add it as a column
      tableSchema.value.push({
        key: 'name',
        label: 'Name',
        type: 'string',
        props: {}
      });
    }
  }
  
  // Populate table data
  tableData.value = [...props.relatedData];
  
  // Initialize selected items with full objects from tableData that match modelValue IDs
  const selectedIds = props.modelValue.map(item => item.id);
  selectedItems.value = tableData.value.filter(item =>
    selectedIds.includes(item.id)
  );
}

// --- Advanced Search Methods ---
/**
 * Confirms the selection made in the advanced search dialog.
 * Updates the HasMany field with the selected entities and closes the modal.
 */
const confirmSelection = () => {
  // Update the modelValue with the selected items

  emit('update:modelValue', selectedItems.value);
  
  // Close the modal
  modalRef.value?.close();
};

// --- Lifecycle & Event Handlers ---
const handleClickOutside = (event: MouseEvent) => {
  if (
      multiselectWrapper.value &&
      !multiselectWrapper.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
