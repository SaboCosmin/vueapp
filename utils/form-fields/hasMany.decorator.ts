import { ENTITY_REGISTRY, type HasManyProps, METADATA_KEY } from "~/utils/ui-metadata";

/**
 * Property decorator for a HasMany relationship. Renders as a multi-select component.
 */
export function hasMany(options: HasManyProps): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const fields: FieldMetadata[] = Reflect.getMetadata(METADATA_KEY, target.constructor) || [];
        const relatedEntity = options.type();

        fields.push({
            key: String(propertyKey),
            label: options.name,
            type: 'hasMany',
            props: {
                relatedEntityName: ENTITY_REGISTRY.get(relatedEntity)?.name,
                descriptor: options.descriptor,
            },
        });
        Reflect.defineMetadata(METADATA_KEY, fields, target.constructor);
    };
}
