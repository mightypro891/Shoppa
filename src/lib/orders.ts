
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import type { Order, OrderStatus } from './types';
import { db } from './firebase';

const ORDERS_COLLECTION = 'orders';

const toOrder = (doc: any): Order => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as Order;
};

export async function getAllOrders(): Promise<Order[]> {
  const ordersCol = collection(db, ORDERS_COLLECTION);
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return toOrder(docSnap);
  } else {
    return undefined;
  }
}

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  const orderWithTimestamp = {
      ...orderData,
      status: 'Order Placed' as OrderStatus,
      createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithTimestamp);
  return {
    id: docRef.id,
    ...orderWithTimestamp
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { status: status });
    return getOrderById(orderId);
}
