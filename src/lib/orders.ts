
// NOTE: intentionally NOT 'use server'. Every caller of these functions is a
// 'use client' component, so they run directly in the browser and use the
// browser's real, authenticated Firebase session — which Firestore Security
// Rules require for anything gated by `request.auth`. Firebase Auth state
// does not automatically propagate into genuine Next.js Server Actions
// (that only happens automatically on Firebase App Hosting, not on Vercel
// or other generic hosts), so making these real Server Actions would cause
// every authenticated read/write here to fail with permission-denied.

import type { Order, OrderStatus } from './types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';


// --- PRODUCTION DATA STORE ---
// This file now uses Firestore as the permanent database.

const ordersCollection = collection(db, 'orders');

export async function getAllOrders(): Promise<Order[]> {
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : undefined;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    const q = query(
        ordersCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}


export async function getOrderByUserEmail(email: string): Promise<Order | undefined> {
    const q = query(
        ordersCollection, 
        where('customer.email', '==', email),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return undefined;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Order;
}


export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  const orderPayload = {
      ...orderData,
      status: 'Order Placed' as OrderStatus,
      createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(ordersCollection, orderPayload);
  
  return { id: docRef.id, ...orderPayload };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Order : undefined;
}
