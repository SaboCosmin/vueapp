import * as yup from "yup";
import { type HasManyOptions } from "~/utils/ui-metadata";

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
