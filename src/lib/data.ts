
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import type { Product, AdminUser, DeletedProduct } from './types';
import { db } from './firebase';

const PRODUCTS_COLLECTION = 'products';
const DELETED_PRODUCTS_COLLECTION = 'deletedProducts';

// Helper function to convert Firestore doc to Product
const toProduct = (doc: any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as Product;
};

// Helper function to convert Firestore doc to DeletedProduct
const toDeletedProduct = (doc: any): DeletedProduct => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as DeletedProduct;
};


// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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

// In a real app this would query a database.
// This is a simplified client-side lookup for the prototype.
const adminUsers: AdminUser[] = [
  { email: 'promiseoyedele07@gmail.com', role: 'Super Admin' },
  { email: 'adedolapotamara@gmail.com', role: 'Products Admin' },
];

export async function getAdminUserByUid(uid: string): Promise<AdminUser | undefined> {
    // Note: This is not secure and is for prototype purposes only.
    // We are assuming the vendorId is the email.
    return adminUsers.find(admin => admin.email === uid);
}
