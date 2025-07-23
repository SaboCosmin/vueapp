import * as yup from 'yup';
import type {NumberFieldProps} from "~/utils/ui-metadata";

/**
 * Decorator for a number field. Renders as a number input.
 * @param options - Configuration with the display name.
 */
export function number(options: NumberFieldProps): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let numberValidation: yup.NumberSchema = yup.number()
            .transform((value, originalValue) => {
                return String(originalValue).trim() === '' ? undefined : value;
            });

        if (options.required) {
            numberValidation = numberValidation.required(`${options.name} is required`);
        }
        if (options.min !== undefined) {
            numberValidation = numberValidation.min(options.min, `${options.name} must be at least ${options.min}`);
        }
        if (options.max !== undefined) {
            numberValidation = numberValidation.max(options.max, `${options.name} cannot be more than ${options.max}`);
        }

        const finalValidation = options.validation
            ? numberValidation.concat(options.validation)
            : numberValidation;

        const {name, validation, ...props} = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'number',
            props: props,
            validation: finalValidation,
        });
    };
}
