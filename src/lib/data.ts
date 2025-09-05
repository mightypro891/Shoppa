
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import type { Product, AdminUser, DeletedProduct } from './types';
import { db, adminDb } from './firebase';

const PRODUCTS_COLLECTION = 'products';
const DELETED_PRODUCTS_COLLECTION = 'deletedProducts';

// Helper function to convert Firestore doc to Product
const toProduct = (doc: admin.firestore.DocumentSnapshot | any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as Product;
};

// Helper function to convert Firestore doc to DeletedProduct
const toDeletedProduct = (doc: admin.firestore.DocumentSnapshot | any): DeletedProduct => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as DeletedProduct;
};


// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function getProducts(): Promise<Product[]> {
    if (!adminDb) {
        console.error("Admin DB not initialized. Cannot fetch products on the server.");
        return [];
    }
    const productsCol = adminDb.collection(PRODUCTS_COLLECTION);
    const q = productsCol.orderBy('name');
    const snapshot = await q.get();
    return snapshot.docs.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
     if (!adminDb) {
        console.error("Admin DB not initialized. Cannot fetch product by ID on the server.");
        return undefined;
    }
    const docRef = adminDb.collection(PRODUCTS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        return toProduct(docSnap);
    } else {
        return undefined;
    }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return {
        id: docRef.id,
        ...productData
    };
}

export async function deleteProduct(productId: string, deletedBy: string): Promise<void> {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        const productData = toProduct(productSnap);
        
        // Add to deleted products log
        await addDoc(collection(db, DELETED_PRODUCTS_COLLECTION), {
            product: productData,
            deletedBy: deletedBy,
            deletedAt: new Date().toISOString(),
        });

        // Delete from products collection
        await deleteDoc(productRef);
    } else {
        console.error("Product not found for deletion:", productId);
    }
}

export async function getDeletedProducts(): Promise<DeletedProduct[]> {
    const deletedCol = collection(db, DELETED_PRODUCTS_COLLECTION);
    const q = query(deletedCol, orderBy('deletedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as DeletedProduct); // The structure is already what we need
}
