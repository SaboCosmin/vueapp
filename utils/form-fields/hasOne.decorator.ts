import { ENTITY_REGISTRY, type HasOneProps, METADATA_KEY } from "~/utils/ui-metadata";

/**
 * Property decorator for a HasOne relationship. Renders as a single-select dropdown.
 */
export function hasOne(options: HasOneProps): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const fields: FieldMetadata[] = Reflect.getMetadata(METADATA_KEY, target.constructor) || [];
        const relatedEntity = options.type();

        fields.push({
            key: String(propertyKey),
            label: options.name,
            type: 'hasOne',
            props: {
                relatedEntityName: ENTITY_REGISTRY.get(relatedEntity)?.name,
                descriptor: options.descriptor,
            },
        });
        Reflect.defineMetadata(METADATA_KEY, fields, target.constructor);
    };
}
