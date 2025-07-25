import { ENTITY_REGISTRY, METADATA_KEY } from "~/utils/ui-metadata";

/**
 * Class decorator to register a model as a manageable entity.
 * @param options - Configuration with the unique entity name.
 */
export function Entity(options: EntityOptions): ClassDecorator {
    return (target: any) => {
        const fields = Reflect.getMetadata(METADATA_KEY, target) || [];
        ENTITY_REGISTRY.set(target, {
            name: options.name,
            primaryKey: '',
            descriptor: '',
            fields: fields,
        });
    };
}

/**
 * Property decorator to mark a field as the primary key for an entity.
 */
export function primaryKey(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const entityMeta = ENTITY_REGISTRY.get(target.constructor);
        console.log("primaryKey",entityMeta);
        if (entityMeta) {
            entityMeta.primaryKey = String(propertyKey);
        }
    };
}
