
import type { Review } from './types';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const REVIEWS_COLLECTION = 'reviews';

const toReview = (doc: any): Review => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data
    } as Review;
}

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const reviewsCol = collection(db, REVIEWS_COLLECTION);
  const q = query(reviewsCol, where("productId", "==", productId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toReview);
}

export async function getAllReviews(): Promise<Review[]> {
    const reviewsCol = collection(db, REVIEWS_COLLECTION);
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(toReview);
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const reviewWithTimestamp = {
      ...reviewData,
      createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewWithTimestamp);
  return {
      id: docRef.id,
      ...reviewWithTimestamp
  };
}
