import { ENTITY_REGISTRY } from "~/utils/ui-metadata";

/**
 * Property decorator to mark a field as the descriptor for an entity.
 * The descriptor field is used to display a human-readable representation of the entity.
 */
export function descriptor(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const entityMeta = ENTITY_REGISTRY.get(target.constructor);
        console.log(target);
        if (entityMeta) {
            entityMeta.descriptor = String(propertyKey);
        }
    };
}
