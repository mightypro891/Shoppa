
'use server';

import type { Product, DeletedProduct } from './types';
import { initialProducts } from './seed';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';


// Helper function to simulate database latency
// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    return undefined;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, productData);
    return { id: docRef.id, ...productData };
}

export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        const productData = productSnap.data() as Product;
        const deletedRecord: DeletedProduct = {
            product: productData,
            deletedBy: deletedBy,
            deletedAt: new Date().toISOString(),
        };
        
        const deletedProductsCol = collection(db, 'deletedProducts');
        await addDoc(deletedProductsCol, deletedRecord);
        
        await deleteDoc(productRef);
    } else {
        console.error("Product not found for deletion:", productId);
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    const deletedCol = collection(db, 'deletedProducts');
    const deletedSnapshot = await getDocs(deletedCol);
    return deletedSnapshot.docs.map(doc => doc.data() as DeletedProduct);
}


export async function resetAllProducts(): Promise<void> {
    const productsCol = collection(db, 'products');
    const deletedCol = collection(db, 'deletedProducts');

    // Delete all existing products
    const existingProductsSnapshot = await getDocs(productsCol);
    const deleteProductsBatch = writeBatch(db);
    existingProductsSnapshot.docs.forEach(doc => {
        deleteProductsBatch.delete(doc.ref);
    });
    await deleteProductsBatch.commit();
    
    // Delete all existing deleted product logs
    const existingDeletedSnapshot = await getDocs(deletedCol);
    const deleteLogsBatch = writeBatch(db);
    existingDeletedSnapshot.docs.forEach(doc => {
        deleteLogsBatch.delete(doc.ref);
    });
    await deleteLogsBatch.commit();

    // Add initial products
    const addBatch = writeBatch(db);
    initialProducts.forEach(product => {
        const newDocRef = doc(productsCol);
        addBatch.set(newDocRef, product);
    });
    await addBatch.commit();
}
