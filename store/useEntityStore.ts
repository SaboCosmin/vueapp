import { defineStore } from 'pinia';
import { mockCrudService } from '~/services/mockCrudService';
import type { EntityState, EntityGetters, EntityActions } from './types';

/**
 * A factory function that creates a Pinia store for a specific entity.
 * @param entityName The key for the entity (e.g., 'user', 'product').
 */
export const defineEntityStore = <T>(entityName: string) => {
    // The explicit generic here is now correct with the updated types
    return defineStore<string, EntityState<T>, EntityGetters<T>, EntityActions<T>>(entityName, {
        state: (): EntityState<T> => ({
            items: [],
            isLoading: false,
            error: null,
        }),

        getters: {
            allItems: (state) => state.items,
        },

        actions: {
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

            async createItem(newItem: T) {
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

            async updateItem(itemToUpdate: T) {
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
