import {type BooleanFieldPros, registerFieldMetadata} from '../ui-metadata';

/**
 * Decorator for a boolean field. Renders as a toggle/checkbox.
 * @param options - Configuration with the display name.
 */
export function boolean(options: BooleanFieldPros): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const {name, validation, ...props} = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'boolean',
            props: props,
            validation: validation,
        });
    };
}
