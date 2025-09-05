
'use server';

import type { Review } from './types';
import { db } from './firebase';
import { collection, doc, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const reviewsCol = collection(db, 'reviews');
  const q = query(
      reviewsCol, 
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
  const reviewSnapshot = await getDocs(q);
  return reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function getAllReviews(): Promise<Review[]> {
    const reviewsCol = collection(db, 'reviews');
    const q = query(reviewsCol, orderBy('createdAt', 'desc'));
    const reviewSnapshot = await getDocs(q);
    return reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReviewData = {
        ...reviewData,
        createdAt: new Date().toISOString(),
    };
    const reviewsCol = collection(db, 'reviews');
    const docRef = await addDoc(reviewsCol, newReviewData);
    return { id: docRef.id, ...newReviewData };
}
