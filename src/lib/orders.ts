
'use server';

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

// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ordersCollection = collection(db, 'orders');

export async function getAllOrders(): Promise<Order[]> {
    await delay(500); // Simulate network call
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(200);
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : undefined;
}

export async function getOrderByUserEmail(email: string): Promise<Order | undefined> {
    await delay(300);
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
  await delay(400);
  const orderPayload = {
      ...orderData,
      status: 'Order Placed' as OrderStatus,
      createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(ordersCollection, orderPayload);
  
  return { id: docRef.id, ...orderPayload };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    await delay(300);
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Order : undefined;
}
