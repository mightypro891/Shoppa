
'use server';

import type { Review } from './types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    addDoc, 
    doc,
    updateDoc,
    deleteDoc,
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
      where('isApproved', '==', true), // Only get approved reviews
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

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Promise<Review> {
    const newReviewData = {
        ...reviewData,
        createdAt: new Date().toISOString(),
        isApproved: false, // Reviews are pending by default
    }
    const docRef = await addDoc(reviewsCollection, newReviewData);
    return { id: docRef.id, ...newReviewData };
}

export async function approveReview(reviewId: string): Promise<void> {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
        isApproved: true,
    });
}

export async function deleteReview(reviewId: string): Promise<void> {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
}
