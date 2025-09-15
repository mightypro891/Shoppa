
'use server';

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

    