
import { Product, Sale } from '@artifact/core';

const DB_NAME = 'ArtifactPOS';
const DB_VERSION = 1;

export interface OfflineSale extends Omit<Partial<Sale>, 'createdAt'> {
    tempId: string;
    createdAt: number;
    retryCount: number;
}

export class OfflineStore {
    private db: IDBDatabase | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initDB();
        }
    }

    private async initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB error:", request.error);
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = request.result;

                // Store for pending sales
                if (!db.objectStoreNames.contains('pendingSales')) {
                    db.createObjectStore('pendingSales', { keyPath: 'tempId' });
                }

                // Store for product cache
                if (!db.objectStoreNames.contains('products')) {
                    db.createObjectStore('products', { keyPath: 'id' });
                }
            };
        });
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        await this.initDB();
        if (!this.db) throw new Error("Could not initialize DB");
        return this.db;
    }

    // --- Sales Operations ---

    async savePendingSale(sale: OfflineSale): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pendingSales'], 'readwrite');
            const store = transaction.objectStore('pendingSales');
            const request = store.put(sale);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getPendingSales(): Promise<OfflineSale[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pendingSales'], 'readonly');
            const store = transaction.objectStore('pendingSales');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async removePendingSale(tempId: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['pendingSales'], 'readwrite');
            const store = transaction.objectStore('pendingSales');
            const request = store.delete(tempId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // --- Product Cache Operations ---

    async codeCachedProducts(products: Product[]): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');

            // Clear old cache first? Or just overwrite. Overwrite is safer for concurrency usually.
            // Let's clear to remove deleted products.
            store.clear().onsuccess = () => {
                let count = 0;
                if (products.length === 0) {
                    resolve();
                    return;
                }

                products.forEach(p => {
                    store.put(p); // Fire and forget inside transaction
                    count++;
                    if (count === products.length) resolve();
                });
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Naming fix: saveCachedProducts
    async saveCachedProducts(products: Product[]): Promise<void> {
        return this.codeCachedProducts(products); // Alias
    }

    async getCachedProducts(): Promise<Product[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

export const offlineStore = new OfflineStore();
