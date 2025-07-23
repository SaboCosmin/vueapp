// utils/entity-system.ts

import 'reflect-metadata';
import type { FieldMetadata } from './ui-metadata'; // We will import from our other file

// --- Registry & Keys ---
export const ENTITY_METADATA_KEY = 'entity:metadata';
export const ENTITY_REGISTRY = new Map<any, EntityModel>();

// --- The EntityModel Class ---
// This class holds all the parsed metadata for a single entity.
export class EntityModel {
    public name: string = '';
    public primaryKey: string = '';
    public descriptor: string = '';
    public fields: FieldMetadata[] = [];

    constructor(public target: any) {}
}

// --- Utility Functions ---

/**
 * This is the key function. It gets the EntityModel for a class,
 * creating it if it doesn't exist yet.
 */
export function ensureEntityModel(target: any): EntityModel {
    if (ENTITY_REGISTRY.has(target)) {
        return ENTITY_REGISTRY.get(target)!;
    }

    const model = new EntityModel(target);
    Reflect.defineMetadata(ENTITY_METADATA_KEY, model, target);
    ENTITY_REGISTRY.set(target, model);
    return model;
}

/**
 * Retrieves the EntityModel instance from a class constructor.
 */
export function getEntityModel(target: any): EntityModel | undefined {
    return Reflect.getMetadata(ENTITY_METADATA_KEY, target);
}

/**
 * A schema parser that reads the fields from the EntityModel.
 */
export function parseEntitySchema(modelClass: any): FieldMetadata[] {
    const meta = getEntityModel(modelClass);
    return meta ? meta.fields : [];
}


// --- Core Decorators ---

/**
 * Class decorator to set the display name for an entity.
 */
export function Entity(name: string): ClassDecorator {
    return (target: any) => {
        const model = ensureEntityModel(target);
        model.name = name;
    };
}

/**
 * Property decorator to mark a field as the primary key.
 */
export function primaryKey(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const model = ensureEntityModel(target.constructor);
        model.primaryKey = String(propertyKey);
    };
}

/**
 * Property decorator to mark a field as the display descriptor.
 */
export function descriptor(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const model = ensureEntityModel(target.constructor);
        model.descriptor = String(propertyKey);
    };
}
