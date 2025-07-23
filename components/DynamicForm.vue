<template>
  <div class="bg-base-100 p-6 rounded-lg shadow-md sticky top-8 h-full flex flex-col">
    <h3 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Item' : 'Create New Item' }}</h3>

    <VeeForm
        :key="formKey"
        :validation-schema="validationSchema"
        :initial-values="formData"
        ref="veeForm"
        @submit="save"
        v-slot="{ isSubmitting, values }"
        class="flex-col flex justify-between h-full"
    >
      <div>
        <div v-for="field in schema" :key="field.key" class="form-control w-full mb-2">
          <label class="label"><span class="label-text">{{ field.label }}</span></label>

          <VeeField :name="field.key" v-slot="{ field: veeField, errors, handleChange }">
            <component
                :is="resolveFieldComponent(field)"
                :modelValue="veeField.value"
                @update:modelValue="handleChange"
                v-bind="field.props"
                :class="{ 'input-error': errors.length > 0 }"
                :relatedData="getRelatedDataForField(field)"
                :onFetchData="onFetchRelatedData"
                :disabled="field.disabled ? field.disabled(values) : false"
            />
            <VeeErrorMessage :name="field.key" class="text-error text-xs mt-1"/>
          </VeeField>
        </div>
      </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button type="button" @click="$emit('cancel')" class="btn btn-ghost">Cancel</button>
          <button type="submit" class="btn btn-success" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            Save
          </button>
        </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue';
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate';
import { object as yupObject } from 'yup';
import type { FieldMetadata } from '~/utils/ui-metadata';

// --- Component Mapping ---
const fieldComponentMap: Record<string, any> = {
  string: defineAsyncComponent(() => import('~/components/form-fields/StringField.vue')),
  number: defineAsyncComponent(() => import('~/components/form-fields/NumberField.vue')),
  boolean: defineAsyncComponent(() => import('~/components/form-fields/BooleanField.vue')),
  select: defineAsyncComponent(() => import('~/components/form-fields/SelectField.vue')),
  hasOne: defineAsyncComponent(() => import('~/components/form-fields/HasOneField.vue')),
  hasMany: defineAsyncComponent(() => import('~/components/form-fields/HasManyField.vue')),
};

// --- Props and Emits ---
const props = defineProps({
  schema: {
    type: Array as PropType<FieldMetadata[]>,
    required: true,
  },
  initialData: {
    type: Object as PropType<any | null>,
    default: null,
  },
  relatedData: {
    type: Object as PropType<Record<string, any[]>>,
    default: () => ({}),
  },
  onFetchRelatedData: {
    type: Function as PropType<(entityName: string) => Promise<void>>,
    required: true,
  }
});

const emit = defineEmits(['save', 'cancel']);

// Helper to pass the correct related data to the child component
const getRelatedDataForField = (field: FieldMetadata) => {
  if ((field.type === 'hasOne' || field.type === 'hasMany') && field.props.relatedEntityName) {
    const key = field.props.relatedEntityName.toLowerCase();
    return props.relatedData[key] || [];
  }
  return undefined;
};

const resolveFieldComponent = (field: FieldMetadata) => {
  if (field.type === 'custom' && field.formComponent) {
    return field.formComponent;
  }
  return fieldComponentMap[field.type] || 'div';
};

// --- Validation Schema Generation ---
const validationSchema = computed(() => {
  const schemaShape = props.schema.reduce((acc, field) => {
    if (field.validation) {
      acc[field.key] = field.validation;
    }
    return acc;
  }, {});
  return yupObject(schemaShape);
});

// --- Form State Management ---
const formData = ref({});
const formKey = ref(0);
const isEditing = computed(() => !!props.initialData);
const veeForm = ref<any>(null);

const getDefaultValue = (field: FieldMetadata) => {
  switch (field.type) {
    case 'string':
      return '';
    case 'number':
      return field.props.min ?? 0;
    case 'boolean':
      return false;
    case 'select':
      return field.props.options?.[0] || '';
    case 'hasOne':
      return null;
    case 'hasMany':
      return [];
    case 'custom':
      return null;
    default:
      return null;
  }
}

watchEffect(() => {
  if (props.initialData) {
    formData.value = {...props.initialData};
  } else {
    const blankForm = {};
    props.schema.forEach(field => {
      blankForm[field.key] = getDefaultValue(field);
    });
    formData.value = blankForm;
  }
  formKey.value++;
});

watch(
    // Source: The form values from our template ref
    () => veeForm.value?.values,
    (currentValues) => {
      if (!currentValues) return;

      props.schema.forEach(field => {
        // Check for the clear condition
        if (field.clear && field.clear(currentValues)) {
          const defaultValue = getDefaultValue(field);
          const currentValue = currentValues[field.key];

          // Only clear the field if its value isn't already the default.
          // This check is crucial to prevent the infinite loop.
          if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
            veeForm.value?.setFieldValue(field.key, defaultValue);
          }
        }
      });
    },
    {deep: true}
);

const save = (values: any) => {
  const dataToSave = isEditing.value ? {...values, id: props.initialData.id} : values;
  emit('save', dataToSave);
};
</script>
