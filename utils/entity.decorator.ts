import { ENTITY_NAME_REGISTRY, ENTITY_REGISTRY, METADATA_KEY } from "~/utils/ui-metadata";
// Import the keys from the other decorator files
import { METADATA_KEY_DESCRIPTOR } from '~/utils/descriptor.decorator';

// Define and export the key for the primary key
export const METADATA_KEY_PRIMARY = 'model:primaryKey';

/**
 * Class decorator to register a model as a manageable entity.
 * @param options - Configuration with the unique entity name.
 */
export function Entity(options: EntityOptions): ClassDecorator {
    return (target: any) => {
        // Now, the @Entity decorator will collect all metadata
        const fields = Reflect.getMetadata(METADATA_KEY, target) || [];
        const primaryKey = Reflect.getMetadata(METADATA_KEY_PRIMARY, target);
        const descriptor = Reflect.getMetadata(METADATA_KEY_DESCRIPTOR, target);

        const entityMetadata = {
            name: options.name,
            primaryKey: primaryKey || 'id',
            descriptor: descriptor || '',
            fields: fields,
        };

        ENTITY_REGISTRY.set(target, entityMetadata);
        // Populate the reverse map
        ENTITY_NAME_REGISTRY.set(options.name.toLowerCase(), target);
    };
}

/**
 * Property decorator to mark a field as the primary key for an entity.
 */
export function primaryKey(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        // Just like @descriptor, this now only stores the metadata
        Reflect.defineMetadata(METADATA_KEY_PRIMARY, String(propertyKey), target.constructor);
    };
}
