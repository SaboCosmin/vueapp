import { ENTITY_METADATA_KEY } from "~/utils/entity-system";

/**
 * A "modifier" decorator that applies a conditional clear rule
 * to the field it is stacked with.
 * @param expression A function that returns true if the field's value should be cleared.
 */
export function clear(expression: ConditionExpression): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const fields: FieldMetadata[] = Reflect.getMetadata(ENTITY_METADATA_KEY, target.constructor) || [];
        const lastField = fields[fields.length - 1];

        if (lastField && lastField.key === propertyKey) {
            lastField.clear = expression;
        } else {
            console.warn(`@Clear decorator couldn't find a field to attach to for property: ${String(propertyKey)}`);
        }
    };
}
