
'use server';

import type { Product, DeletedProduct, DealSubmission, DealStatus } from './types';
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
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';


// --- PRODUCTION DATA STORE ---
// This file now uses Firestore as the permanent database.

const productsCollection = collection(db, 'products');
const deletedProductsLogCollection = collection(db, 'deletedProductsLog');
const dealSubmissionsCollection = collection(db, 'dealSubmissions');


export async function getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : undefined;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const docRef = await addDoc(productsCollection, productData);
    return { id: docRef.id, ...productData };
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | undefined> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Product : undefined;
}


export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
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
    const snapshot = await getDocs(deletedProductsLogCollection);
    return snapshot.docs.map(doc => doc.data() as DeletedProduct);
}


export async function resetAllProducts(): Promise<{success: boolean, message: string}> {
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

// --- DEAL SUBMISSION FUNCTIONS ---

export async function submitDeal(submission: Omit<DealSubmission, 'id' | 'submittedAt' | 'status'>): Promise<void> {
    await addDoc(dealSubmissionsCollection, {
        ...submission,
        status: 'pending',
        submittedAt: new Date().toISOString(),
    });
}

export async function getDealSubmissions(): Promise<DealSubmission[]> {
    const q = query(dealSubmissionsCollection, orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DealSubmission));
}

export async function approveDeal(submissionId: string, productId: string, salePrice: number): Promise<void> {
    const batch = writeBatch(db);
    
    const submissionRef = doc(db, 'dealSubmissions', submissionId);
    batch.update(submissionRef, { status: 'approved' });

    const productRef = doc(db, 'products', productId);
    batch.update(productRef, { salePrice });

    await batch.commit();
}

export async function rejectDeal(submissionId: string, productId: string): Promise<void> {
     const batch = writeBatch(db);

    const submissionRef = doc(db, 'dealSubmissions', submissionId);
    batch.update(submissionRef, { status: 'rejected' });
    
    // Also remove the sale price from the product if it was somehow set
    const productRef = doc(db, 'products', productId);
    batch.update(productRef, { salePrice: undefined });

    await batch.commit();
}
