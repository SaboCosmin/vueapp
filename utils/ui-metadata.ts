// utils/ui-metadata.ts

import 'reflect-metadata';
import * as yup from 'yup';
import { ensureEntityModel } from './entity-system';

// --- Interfaces & Types ---
export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'hasOne' | 'hasMany' | 'custom';
export type ConditionExpression = (formData: Record<string, any>) => boolean;

// --- Metadata Structure ---
export interface FieldMetadata {
    key: string;
    label: string;
    type: FieldType;
    props: Record<string, any>;
    validation?: yup.AnySchema;
    disabled?: ConditionExpression;
    clear?: ConditionExpression;
    formComponent?: any;
    cellComponent?: any;
}

// --- Internal Helper Function ---
export function registerFieldMetadata(target: any, propertyKey: string, metadata: Omit<FieldMetadata, 'key'>) {
    const entityModel = ensureEntityModel(target.constructor);
    entityModel.fields.push({ key: propertyKey, ...metadata });
}


