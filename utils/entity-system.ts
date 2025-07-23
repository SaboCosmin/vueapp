// utils/entity-system.ts

import 'reflect-metadata';
import type { FieldMetadata } from './ui-metadata';

// --- Registry & Keys ---
const ENTITY_METADATA_KEY = 'entity:metadata';
const ENTITY_REGISTRY = new Map<any, EntityModel>();

// --- The EntityModel Class ---
export class EntityModel {
    public name: string = '';
    public primaryKey: string = '';
    public descriptor: string = '';
    public fields: FieldMetadata[] = [];

    constructor(public target: any) {}
}

// --- Utility Functions ---
export function ensureEntityModel(target: any): EntityModel {
    if (ENTITY_REGISTRY.has(target)) {
        return ENTITY_REGISTRY.get(target)!;
    }

    const model = new EntityModel(target);
    Reflect.defineMetadata(ENTITY_METADATA_KEY, model, target);
    ENTITY_REGISTRY.set(target, model);
    return model;
}

export function getEntityModel(target: any): EntityModel | undefined {
    return Reflect.getMetadata(ENTITY_METADATA_KEY, target);
}

export function parseEntitySchema(modelClass: any): FieldMetadata[] {
    const meta = getEntityModel(modelClass);
    return meta ? meta.fields : [];
}

// --- Core Decorators ---
export function Entity(name: string): ClassDecorator {
    return (target: any) => {
        const model = ensureEntityModel(target);
        model.name = name;
    };
}

export function primaryKey(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const model = ensureEntityModel(target.constructor);
        model.primaryKey = String(propertyKey);
    };
}

export function descriptor(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const model = ensureEntityModel(target.constructor);
        model.descriptor = String(propertyKey);
    };
}
