export function custom(options: CustomFieldProps): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const { name, validation, formComponent, cellComponent, ...props } = options;
        registerFieldMetadata(target, String(propertyKey), {
            label: name,
            type: 'custom',
            props: props,
            validation: validation,
            formComponent: formComponent,
            cellComponent: cellComponent,
        });
    };
}
