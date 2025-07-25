import { ENTITY_REGISTRY } from "~/utils/ui-metadata";

// Export this key so the @Entity decorator can use it
export const METADATA_KEY_DESCRIPTOR = 'model:descriptor';

/**
 * Property decorator to mark a field as the descriptor for an entity.
 * The descriptor field is used to display a human-readable representation of the entity.
 */
export function descriptor(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        // Instead of accessing the registry, just define metadata on the class constructor
        Reflect.defineMetadata(METADATA_KEY_DESCRIPTOR, String(propertyKey), target.constructor);
    };
}
