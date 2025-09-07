
'use server';

import type { Review } from './types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    addDoc, 
    query,
    where,
    orderBy
} from 'firebase/firestore';

// --- PRODUCTION DATA STORE ---
// This file now uses Firestore as the permanent database.

const reviewsCollection = collection(db, 'reviews');

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const q = query(
      reviewsCollection, 
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function getAllReviews(): Promise<Review[]> {
    const q = query(reviewsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReviewData = {
        ...reviewData,
        createdAt: new Date().toISOString(),
    }
    const docRef = await addDoc(reviewsCollection, newReviewData);
    return { id: docRef.id, ...newReviewData };
}
