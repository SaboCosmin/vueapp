import 'reflect-metadata';
import * as yup from 'yup';

export const METADATA_KEY = 'model:form-fields';
export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'hasOne' | 'hasMany' | 'custom';
export const ENTITY_REGISTRY = new Map<any, EntityMetadata>();
export type ConditionExpression = (formData: Record<string, any>) => boolean;
import type { AnySchema } from 'yup';


export interface EntityOptions {
    name: string;
}

export interface EntityMetadata {
    name: string;
    primaryKey: string;
    descriptor: string;
    fields: FieldMetadata[];
}

export interface CustomFieldProps {
    name: string;
    formComponent: any;
    cellComponent?: any;
    validation?: AnySchema;
}

export interface StringFieldProps {
    name: string;
    required?: boolean;
    validation?: yup.StringSchema;
}

export interface NumberFieldProps {
    name: string;
    required?: boolean;
    min?: number;
    max?: number;
    validation?: yup.NumberSchema;
}

export interface BooleanFieldPros {
    name: string;
    required?: boolean;
    validation?: yup.BooleanSchema;
}

export interface SelectFieldProps {
    name: string;
    required?: boolean;
    options: string[];
    validation?: yup.StringSchema;
}

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


export interface HasOneProps {
    name: string;
    type: () => any;
    descriptor: string;
}

export interface HasManyProps extends HasOneProps {}

/**
 * A private helper function to handle the logic of attaching metadata to a class.
 * This avoids duplicating the Reflect.get/defineMetadata calls in each decorator.
 * @param target The prototype of the class.
 * @param propertyKey The name of the property being decorated.
 * @param metadata The metadata object for the field.
 */
export function registerFieldMetadata(target: any, propertyKey: string, metadata: Omit<FieldMetadata, 'key'>) {
    const fields: FieldMetadata[] = Reflect.getMetadata(METADATA_KEY, target.constructor) || [];
    fields.push({key: propertyKey, ...metadata});
    Reflect.defineMetadata(METADATA_KEY, fields, target.constructor);
}

/**
 * Retrieves the full entity metadata for a given class.
 */
export function getEntityMetadata(modelClass: any): EntityMetadata | undefined {
    return ENTITY_REGISTRY.get(modelClass);
}

/**
 * A new schema parser that uses the central entity registry.
 */
export function parseEntitySchema(modelClass: any): FieldMetadata[] {
    const meta = getEntityMetadata(modelClass);
    return meta ? meta.fields : [];
}

