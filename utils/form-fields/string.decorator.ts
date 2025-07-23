import * as yup from 'yup';
import type {StringFieldProps} from "~/utils/ui-metadata";

/**
 * Decorator for a string field. Renders as a text input.
 * @param options - Configuration with the display name.
 */
export function string(options: StringFieldProps): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let stringValidation: yup.StringSchema = yup.string();

        if (options.required) {
            stringValidation = stringValidation.required(`${options.name} is required`);
        }

        const finalValidation = options.validation
            ? stringValidation.concat(options.validation)
            : stringValidation;

        const {name, validation, ...props} = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'string',
            props: props,
            validation: finalValidation,
        });
    };
}
