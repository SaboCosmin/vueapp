import { defineStore } from 'pinia';
import { mockCrudService } from '~/services/mockCrudService';

/**
 * A factory function that creates a Pinia store for a specific entity.
 * @param entityName The key for the entity (e.g., 'user', 'product').
 */
export const defineEntityStore = (entityName: string) => {
    return defineStore(entityName, {
        // STATE: The data for our store
        state: () => ({
            items: [] as any[],
            isLoading: false,
            error: null as string | null,
        }),

        // GETTERS: Computed properties derived from state
        getters: {
            allItems: (state) => state.items,
        },

        // ACTIONS: Functions that perform asynchronous operations and mutate state
        actions: {
            /**
             * Fetches all items from the service and populates the store.
             */
            async fetchAll() {
                this.isLoading = true;
                this.error = null;
                try {
                    this.items = await mockCrudService.getAll(entityName);
                } catch (e: any) {
                    this.error = e.message;
                } finally {
                    this.isLoading = false;
                }
            },

            /**
             * Creates a new item and then refreshes the list.
             */
            async createItem(newItem: any) {
                this.isLoading = true;
                this.error = null;
                try {
                    await mockCrudService.create(entityName, newItem);
                    await this.fetchAll(); // Refresh the list after creation
                } catch (e: any) {
                    this.error = e.message;
                } finally {
                    this.isLoading = false;
                }
            },

            /**
             * Updates an item and then refreshes the list.
             */
            async updateItem(itemToUpdate: any) {
                this.isLoading = true;
                this.error = null;
                try {
                    await mockCrudService.update(entityName, itemToUpdate);
                    await this.fetchAll(); // Refresh the list after update
                } catch (e: any) {
                    this.error = e.message;
                } finally {
                    this.isLoading = false;
                }
            },

            /**
             * Deletes an item and then refreshes the list.
             */
            async deleteItem(id: number | string) {
                this.isLoading = true;
                this.error = null;
                try {
                    await mockCrudService.delete(entityName, id);
                    await this.fetchAll(); // Refresh the list after deletion
                } catch (e: any) {
                    this.error = e.message;
                } finally {
                    this.isLoading = false;
                }
            },
        },
    });
};
