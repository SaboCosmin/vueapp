import type { Store } from 'pinia';

export interface EntityState<T> {
    items: T[];
    isLoading: boolean;
    error: string | null;
}

export type EntityGetters<T> = {
    allItems: (state: EntityState<T>) => T[];
    [key: string]: (state: EntityState<T>) => any;
};

export interface EntityActions<T> {
    fetchAll(): Promise<void>;
    createItem(newItem: T): Promise<void>;
    updateItem(itemToUpdate: T): Promise<void>;
    deleteItem(id: number | string): Promise<void>;
}


export type EntityStore<T> = Store<string, EntityState<T>, EntityGetters<T>, EntityActions<T>>;
