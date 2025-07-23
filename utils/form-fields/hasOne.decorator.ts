import * as yup from "yup";
import { type HasOneOptions } from "~/utils/ui-metadata";

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
