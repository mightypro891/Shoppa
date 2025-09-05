
'use server';

import type { Product, DeletedProduct } from './types';
import { initialProducts } from './seed';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    writeBatch, 
} from 'firebase/firestore';


// --- PRODUCTION DATA STORE ---
// This file now uses Firestore as the permanent database.

// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const productsCollection = collection(db, 'products');
const deletedProductsLogCollection = collection(db, 'deletedProductsLog');

export async function getProducts(): Promise<Product[]> {
    await delay(500); // Simulate network call
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | undefined> {
    await delay(200);
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : undefined;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const docRef = await addDoc(productsCollection, productData);
    return { id: docRef.id, ...productData };
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | undefined> {
    await delay(300);
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Product : undefined;
}


export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    await delay(300);
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        const deletedProductData = productSnap.data() as Omit<Product, 'id'>;
        
        // Add to deleted products log
        await addDoc(deletedProductsLogCollection, {
            product: deletedProductData,
            deletedBy,
            deletedAt: new Date().toISOString(),
        });
        
        // Delete from products collection
        await deleteDoc(productRef);
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    await delay(200);
    const snapshot = await getDocs(deletedProductsLogCollection);
    return snapshot.docs.map(doc => doc.data() as DeletedProduct);
}


export async function resetAllProducts(): Promise<{success: boolean, message: string}> {
    await delay(500);
    
    // Check if products already exist
    const productsSnapshot = await getDocs(productsCollection);
    if (!productsSnapshot.empty) {
        return { success: false, message: "Products collection is not empty. Seeding aborted to prevent data loss." };
    }

    // Use a batch write for efficiency
    const batch = writeBatch(db);
    initialProducts.forEach(productData => {
        const docRef = doc(productsCollection); // Automatically generate unique ID
        batch.set(docRef, productData);
    });

    await batch.commit();
    return { success: true, message: "Initial products seeded successfully." };
}
