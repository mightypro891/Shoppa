
'use server';

import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import type { Product, DeletedProduct } from './types';
import { db } from './firebase'; 

// Helper function to convert Firestore doc to Product
const toProduct = (docSnapshot: any): Product => {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        ...data,
    } as Product;
};

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(toProduct);
}


export async function getProductById(id: string): Promise<Product | undefined> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return toProduct(docSnap);
    } else {
        return undefined;
    }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return {
        id: docRef.id,
        ...productData
    };
}

export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        const productData = toProduct(productSnap);
        
        await addDoc(collection(db, 'deletedProducts'), {
            product: productData,
            deletedBy: deletedBy,
            deletedAt: new Date().toISOString(),
        });

        await deleteDoc(productRef);
    } else {
        console.error("Product not found for deletion:", productId);
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    const deletedCol = collection(db, 'deletedProducts');
    const q = query(deletedCol, orderBy('deletedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as DeletedProduct);
}
