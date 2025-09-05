
'use server';

import type { Order, OrderStatus } from './types';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';


export async function getAllOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const orderSnapshot = await getDocs(q);
  return orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orderRef = doc(db, 'orders', id);
  const orderSnap = await getDoc(orderRef);
  if (orderSnap.exists()) {
    return { id: orderSnap.id, ...orderSnap.data() } as Order;
  }
  return undefined;
}

export async function getOrderByUserEmail(email: string): Promise<Order | undefined> {
    const ordersCol = collection(db, 'orders');
    const q = query(
        ordersCol, 
        where('customer.email', '==', email),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Order;
    }
    return undefined;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  const newOrderData = {
    ...orderData,
    status: 'Order Placed' as OrderStatus,
    createdAt: new Date().toISOString(),
  };
  const ordersCol = collection(db, 'orders');
  const docRef = await addDoc(ordersCol, newOrderData);
  return { id: docRef.id, ...newOrderData };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: status });
    return await getOrderById(orderId);
}
