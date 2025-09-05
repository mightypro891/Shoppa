
'use server';

import type { Product, DeletedProduct } from './types';
import { initialProducts } from './seed';

// --- In-memory database for prototype ---
let products: Product[] = [];
let deletedProducts: DeletedProduct[] = [];

// Function to initialize/reset the product list
function initializeProducts() {
    products = initialProducts.map((p, index) => ({
        ...p,
        id: `prod_${index + 1}`
    }));
}

// Initialize on first load
if (products.length === 0) {
    initializeProducts();
}

// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getProducts(): Promise<Product[]> {
    await delay(100);
    return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string): Promise<Product | undefined> {
    await delay(50);
    const product = products.find(p => p.id === id);
    return product ? JSON.parse(JSON.stringify(product)) : undefined;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await delay(150);
    const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`
    };
    products.push(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
}

export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    await delay(150);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex > -1) {
        const [productToDelete] = products.splice(productIndex, 1);
        
        const deletedRecord: DeletedProduct = {
            product: productToDelete,
            deletedBy: deletedBy,
            deletedAt: new Date().toISOString(),
        };
        deletedProducts.push(deletedRecord);
    } else {
        console.error("Product not found for deletion:", productId);
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    await delay(100);
    return JSON.parse(JSON.stringify(deletedProducts));
}

export async function resetAllProducts(): Promise<void> {
    await delay(50);
    initializeProducts();
    deletedProducts = [];
}
