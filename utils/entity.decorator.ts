/**
 * Class decorator to register a model as a manageable entity.
 * @param options - Configuration with the unique entity name.
 */
export function Entity(name: string): ClassDecorator {
    return (target: any) => {
        const model = ensureEntityModel(target);
        model.name = name;
    };
}
