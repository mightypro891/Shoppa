
// NOTE: intentionally NOT 'use server'. Every caller of these functions is a
// 'use client' component, so they run directly in the browser and use the
// browser's real, authenticated Firebase session — which Firestore Security
// Rules require for anything gated by `request.auth`. Firebase Auth state
// does not automatically propagate into genuine Next.js Server Actions
// (that only happens automatically on Firebase App Hosting, not on Vercel
// or other generic hosts), so making these real Server Actions would cause
// every authenticated read/write here to fail with permission-denied.

import type { DeliveryRoute } from './types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    addDoc, 
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';


const deliveryRoutesCollection = collection(db, 'deliveryRoutes');

export async function getDeliveryRoutes(): Promise<DeliveryRoute[]> {
    const q = query(deliveryRoutesCollection, orderBy('from'), orderBy('to'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DeliveryRoute));
}

export async function addDeliveryRoute(routeData: Omit<DeliveryRoute, 'id'>): Promise<DeliveryRoute> {
    const docRef = await addDoc(deliveryRoutesCollection, routeData);
    return { id: docRef.id, ...routeData };
}

export async function deleteDeliveryRoute(routeId: string): Promise<void> {
    const routeRef = doc(db, 'deliveryRoutes', routeId);
    await deleteDoc(routeRef);
}

    