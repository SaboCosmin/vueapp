<template>
  <div ref="multiselectWrapper" class="relative w-full">
    <div
        class="input input-bordered flex h-auto min-h-12 overflow-y-auto max-h-36 w-full items-center gap-2 p-2 pr-12 flex-wrap"
        @click="toggleDropdown"
    >
      <!-- Use a fallback for modelValue to prevent crashes -->
      <div v-for="item in modelValue || []" :key="item.id" class="badge badge-ghost gap-2">
        {{ item[descriptor] || item.id }}
        <button class="btn btn-circle btn-ghost btn-xs" @click.stop="removeItem(item)">✕</button>
      </div>

      <input
          ref="inputRef"
          v-model="searchTerm"
          type="text"
          :placeholder="placeholderText"
          class="input input-ghost h-auto flex-grow p-0 focus:border-none focus:outline-none min-w-[100px]"
          @focus="openDropdown"
      />

      <div class="absolute right-2 transform cursor-pointer p-2 hover:bg-base-300 rounded-full" @click.stop="openAdvancedSearch">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
          <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>

    <ul v-show="isOpen" class="menu menu-horizontal absolute z-10 w-full gap-1 overflow-y-auto min-h-auto max-h-52 bg-base-200 rounded-box shadow">
      <li v-if="filteredOptions.length === 0"><span class="text-base-content/60">No options found.</span></li>
      <li v-for="option in filteredOptions" :key="option.id" class="w-full">
        <a :class="{ 'bg-primary text-primary-content': isSelected(option) }" @click.prevent="selectOption(option)">
          {{ option[descriptor] || option.id }}
        </a>
      </li>
    </ul>

    <dialog ref="modalRef" class="modal">
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="text-lg font-bold">Advanced Search for {{ relatedEntityName }}</h3>

        <div class="py-4">
          <AdvancedSearchTable
              :model-class="relatedEntityClass"
              :data="relatedData"
              v-model="temporarySelection"
          />
        </div>

        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button class="btn btn-ghost" @click="cancelAdvancedSearch">Cancel</button>
            <button class="btn btn-primary" @click="confirmAdvancedSearch">Confirm Selection</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getEntityModel } from '~/utils/entity-system';

const props = defineProps<{
  modelValue: { id: any; [key: string]: any }[];
  relatedEntityClass: any;
  relatedData: { id: any; [key: string]: any }[];
  descriptor: string;
}>();

const emit = defineEmits(['update:modelValue']);

const relatedEntityName = getEntityModel(props.relatedEntityClass)?.name || '';

const isOpen = ref(false);
const searchTerm = ref('');
const multiselectWrapper = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const temporarySelection = ref<{ id: any; [key: string]: any }[]>([]);

const placeholderText = computed(() => (props.modelValue || []).length > 0 ? '' : `Select ${relatedEntityName}`);

const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.relatedData;
  return props.relatedData.filter((option) =>
      String(option[props.descriptor] || '').toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) inputRef.value?.focus();
};
const openDropdown = () => { isOpen.value = true; };
const closeDropdown = () => { isOpen.value = false; };
const isSelected = (option: { id: any }) => (props.modelValue || []).some((item) => item.id === option.id);

const selectOption = (option: { id: any; }) => {
  const currentSelection = props.modelValue || [];
  if (isSelected(option)) {
    removeItem(option);
  } else {
    emit('update:modelValue', [...currentSelection, option]);
  }
  searchTerm.value = '';
  inputRef.value?.focus();
};

const removeItem = (itemToRemove: { id: any }) => {
  emit('update:modelValue', (props.modelValue || []).filter((item) => item.id !== itemToRemove.id));
};

const openAdvancedSearch = () => {
  temporarySelection.value = [...(props.modelValue || [])];
  modalRef.value?.showModal();
};

const confirmAdvancedSearch = () => {
  emit('update:modelValue', temporarySelection.value);
  modalRef.value?.close();
};

const cancelAdvancedSearch = () => {
  temporarySelection.value = [];
  modalRef.value?.close();
};

const handleClickOutside = (event: MouseEvent) => {
  if (multiselectWrapper.value && !multiselectWrapper.value.contains(event.target as Node)) {
    closeDropdown();
  }
};
onMounted(() => { document.addEventListener('click', handleClickOutside); });
onUnmounted(() => { document.removeEventListener('click', handleClickOutside); });
</script>
