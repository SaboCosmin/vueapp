export class EntityModel {
    /**
     * The unique, human-readable name for the entity (e.g., 'User').
     */
    public name: string;

    /**
     * The name of the property that serves as the primary key.
     * This is set by the @PrimaryKey decorator.
     */
    public primaryKey: string = '';

    /**
     * The name of the property to be used for display purposes in relationships.
     * This is set by the @Descriptor decorator.
     */
    public descriptor: string = '';

    /**
     * An array containing the metadata for all decorated fields in the entity.
     * This is populated by decorators like @StringField, @HasOne, etc.
     */
    public fields: FieldMetadata[] = [];

    constructor(name: string) {
        this.name = name;
    }
}
