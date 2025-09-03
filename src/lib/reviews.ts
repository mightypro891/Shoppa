
import type { Review } from './types';

// In-memory store for prototype purposes. In a real app, use a database.
let reviews: Review[] = [];
const REVIEWS_STORAGE_KEY = 'lautech_shoppa_reviews';

const loadReviews = () => {
    if (typeof window !== 'undefined') {
        const savedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
        if (savedReviews) {
            reviews = JSON.parse(savedReviews);
        }
    }
};

const saveReviews = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    }
};

// Load reviews on initial load
loadReviews();


// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  await delay(50);
  return reviews
    .filter(review => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllReviews(): Promise<Review[]> {
    await delay(50);
    return [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await delay(100);
  const newReview: Review = {
    ...reviewData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  reviews = [newReview, ...reviews];
  saveReviews();
  return newReview;
}
