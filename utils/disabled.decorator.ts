import { ENTITY_METADATA_KEY } from "~/utils/entity-system";

/**
 * A "modifier" decorator that applies a conditional disabled rule
 * to the field it is stacked with.
 * @param expression A function that returns true if the field should be disabled.
 */
export function disabled(expression: ConditionExpression): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const fields: FieldMetadata[] = Reflect.getMetadata(ENTITY_METADATA_KEY, target.constructor) || [];

        // Decorators are applied bottom-up, so the field we want to modify
        // is the last one that was added to the metadata array.
        const lastField = fields[fields.length - 1];

        if (lastField && lastField.key === propertyKey) {
            lastField.disabled = expression;
        } else {
            console.warn(`@Disabled decorator couldn't find a field to attach to for property: ${String(propertyKey)}`);
        }
    };
}
