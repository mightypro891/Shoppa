
'use server';

import type { Product, DeletedProduct } from './types';
import { initialProducts } from './seed';

// --- PROTOTYPE DATA STORE ---
// In a real application, this would be a database.
// For this prototype, we're using an in-memory array.
let products: Product[] = initialProducts.map((p, i) => ({ ...p, id: `prod_${i + 1}` }));
let deletedProductsLog: DeletedProduct[] = [];


// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getProducts(): Promise<Product[]> {
    await delay(500); // Simulate network call
    return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string): Promise<Product | undefined> {
    await delay(200);
    return products.find(p => p.id === id);
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
    };
    products.unshift(newProduct); // Add to the beginning of the list
    return newProduct;
}

export async function updateProduct(id: string, productData: Omit<Product, 'id'>): Promise<Product | undefined> {
    await delay(300);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex > -1) {
        products[productIndex] = { ...products[productIndex], ...productData };
        return products[productIndex];
    }
    return undefined;
}


export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    await delay(300);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex > -1) {
        const [deletedProduct] = products.splice(productIndex, 1);
        deletedProductsLog.push({
            product: deletedProduct,
            deletedBy,
            deletedAt: new Date().toISOString(),
        })
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    await delay(200);
    return JSON.parse(JSON.stringify(deletedProductsLog));
}


export async function resetAllProducts(): Promise<void> {
    await delay(500);
    products = initialProducts.map((p, i) => ({ ...p, id: `prod_${i + 1}` }));
    deletedProductsLog = [];
}
