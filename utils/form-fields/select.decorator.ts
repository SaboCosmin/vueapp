import {registerFieldMetadata, type SelectFieldProps} from '../ui-metadata';
import * as yup from 'yup';

/**
 * Decorator for a select field. Renders as a dropdown.
 * This is now explicit and type-safe, requiring an 'options' array.
 * @param options - Configuration with the display name AND the array of options.
 */
export function select(options: SelectFieldProps): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        let selectValidation: yup.StringSchema = yup.string();

        if (options.required) {
            selectValidation = selectValidation.required(`${options.name} is required`);
        }

        const finalValidation = options.validation
            ? selectValidation.concat(options.validation)
            : selectValidation;

        const {name, validation, ...props} = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'select',
            props: props,
            validation: finalValidation,
        });
    };
}
