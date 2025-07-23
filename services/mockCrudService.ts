import User, { userSampleData } from '~/models/User';
import Product, { productSampleData } from '~/models/Product';

// A mock database to hold all our entity data.
const MOCK_DATABASE: Record<string, any[]> = {
    user: userSampleData,
    product: productSampleData,
    // You can add other models here, e.g., department: departmentSampleData
};

// A helper to simulate network latency.
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * A generic mock service for CRUD operations.
 */
export const mockCrudService = {
    /**
     * Fetches all items for a given entity.
     */
    async getAll(entityName: string): Promise<any[]> {
        await delay(500);
        console.log(`[Service] Fetching all ${entityName}s...`);
        // Return a deep copy to prevent direct mutation of the "database".
        return JSON.parse(JSON.stringify(MOCK_DATABASE[entityName] || []));
    },

    /**
     * Creates a new item for a given entity.
     */
    async create(entityName: string, item: any): Promise<any> {
        await delay(700);
        console.log(`[Service] Creating new ${entityName}...`, item);
        const data = MOCK_DATABASE[entityName];
        const newId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
        const newItem = { ...item, id: newId };
        data.push(newItem);
        return JSON.parse(JSON.stringify(newItem));
    },

    /**
     * Updates an existing item.
     */
    async update(entityName: string, item: any): Promise<any> {
        await delay(600);
        console.log(`[Service] Updating ${entityName} with ID ${item.id}...`, item);
        const data = MOCK_DATABASE[entityName];
        const index = data.findIndex(i => i.id === item.id);
        if (index !== -1) {
            data[index] = { ...data[index], ...item };
            return JSON.parse(JSON.stringify(data[index]));
        }
        throw new Error(`${entityName} with ID ${item.id} not found.`);
    },

    /**
     * Deletes an item by its ID.
     */
    async delete(entityName: string, id: number | string): Promise<void> {
        await delay(800);
        console.log(`[Service] Deleting ${entityName} with ID ${id}...`);
        let data = MOCK_DATABASE[entityName];
        const initialLength = data.length;
        data = data.filter(i => i.id !== id);
        if (data.length === initialLength) {
            throw new Error(`${entityName} with ID ${id} not found.`);
        }
        MOCK_DATABASE[entityName] = data;
    },
};
