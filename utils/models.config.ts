import User from '~/models/User'
import Product from '~/models/Product'

/**
 * Defines the configuration for a single manageable model.
 */
export interface ModelConfig {
    key: string;       // The unique key used in the URL (e.g., 'user')
    name: string;      // The human-readable name for display (e.g., 'Users')
    modelClass: any;   // The class constructor for the model (e.g., User)
}

/**
 * The central registry for all models managed by the dynamic UI.
 * This is the single source of truth for what can be managed.
 */
export const modelRegistry: Record<string, ModelConfig> = {
    user: {
        key: 'user',
        name: 'Users',
        modelClass: User,
    },
    product: {
        key: 'product',
        name: 'Products',
        modelClass: Product,
    }
};

/**
 * A helper function to get an array of all navigable models,
 * perfect for dynamically creating a navigation menu.
 * @returns {ModelConfig[]} An array of model configurations.
 */
export const getNavigableModels = (): ModelConfig[] => {
    return Object.values(modelRegistry);
};

/**
 * A type-safe helper for generating links to the dynamic management page.
 * Using this will solve IDE warnings about unresolved files.
 * @param modelKey The key of the model from the registry.
 * @returns {string} The URL path to the management page.
 */
export const getManageLink = (modelKey: keyof typeof modelRegistry): string => {
    return `/${modelKey}`;
};
