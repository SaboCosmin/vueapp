// utils/ui-metadata.ts

import 'reflect-metadata';
import * as yup from 'yup';
import type { AnySchema } from 'yup';
import { ensureEntityModel, getEntityModel } from './entity-system';

// --- Interfaces & Types ---
export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'hasOne' | 'hasMany' | 'custom';
export type ConditionExpression = (formData: Record<string, any>) => boolean;

// --- Option Interfaces for Decorators ---
export interface StringFieldOptions { name: string; required?: boolean; validation?: yup.StringSchema; }
export interface NumberFieldOptions { name: string; required?: boolean; min?: number; max?: number; validation?: yup.NumberSchema; }
export interface BooleanFieldOptions { name: string; required?: boolean; validation?: yup.BooleanSchema; }
export interface SelectFieldOptions { name: string; required?: boolean; options: string[]; validation?: yup.StringSchema; }
export interface HasOneOptions { name: string; type: () => any; descriptor: string; }
export interface HasManyOptions extends HasOneOptions {}
export interface CustomFieldOptions { name: string; formComponent: any; cellComponent?: any; validation?: AnySchema; }

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
function registerFieldMetadata(target: any, propertyKey: string, metadata: Omit<FieldMetadata, 'key'>) {
    const entityModel = ensureEntityModel(target.constructor);
    entityModel.fields.push({ key: propertyKey, ...metadata });
}

// --- Modifier Decorators ---
export function clear(expression: ConditionExpression): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const entityModel = ensureEntityModel(target.constructor);
        const lastField = entityModel.fields.find(f => f.key === propertyKey);
        if (lastField) {
            lastField.clear = expression;
        }
    };
}

export function disabled(expression: ConditionExpression): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const entityModel = ensureEntityModel(target.constructor);
        const lastField = entityModel.fields.find(f => f.key === propertyKey);
        if (lastField) {
            lastField.disabled = expression;
        }
    };
}

// --- Public Field Decorators ---

export function string(options: StringFieldOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let stringValidation: yup.StringSchema = yup.string();
        if (options.required) {
            stringValidation = stringValidation.required(`${options.name} is required`);
        }
        const finalValidation = options.validation ? stringValidation.concat(options.validation) : stringValidation;
        const { name, validation, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'string',
            props: props,
            validation: finalValidation,
        });
    };
}

export function number(options: NumberFieldOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let numberValidation: yup.NumberSchema = yup.number().transform((value, originalValue) => String(originalValue).trim() === '' ? undefined : value);
        if (options.required) {
            numberValidation = numberValidation.required(`${options.name} is required`);
        }
        if (options.min !== undefined) {
            numberValidation = numberValidation.min(options.min);
        }
        if (options.max !== undefined) {
            numberValidation = numberValidation.max(options.max);
        }
        const finalValidation = options.validation ? numberValidation.concat(options.validation) : numberValidation;
        const { name, validation, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'number',
            props: props,
            validation: finalValidation,
        });
    };
}

export function boolean(options: BooleanFieldOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let booleanValidation: yup.BooleanSchema = yup.boolean();
        if (options.required) {
            booleanValidation = booleanValidation.oneOf([true], `${options.name} is required`);
        }
        const finalValidation = options.validation ? booleanValidation.concat(options.validation) : booleanValidation;
        const { name, validation, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'boolean',
            props: props,
            validation: finalValidation,
        });
    };
}

export function select(options: SelectFieldOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let selectValidation: yup.StringSchema = yup.string();
        if (options.required) {
            selectValidation = selectValidation.required(`${options.name} is required`);
        }
        const finalValidation = options.validation ? selectValidation.concat(options.validation) : selectValidation;
        const { name, validation, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'select',
            props: props,
            validation: finalValidation,
        });
    };
}

export function hasOne(options: HasOneOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const { name, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'hasOne',
            props: {
                ...props,
                relatedEntityClass: options.type(),
            },
            validation: yup.mixed().nullable(),
        });
    };
}

export function hasMany(options: HasManyOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const { name, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'hasMany',
            props: {
                ...props,
                relatedEntityClass: options.type(),
            },
            validation: yup.array().nullable(),
        });
    };
}

export function custom(options: CustomFieldOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const { name, validation, formComponent, cellComponent, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'custom',
            props: props,
            validation: validation,
            formComponent: formComponent,
            cellComponent: cellComponent,
        });
    };
}
