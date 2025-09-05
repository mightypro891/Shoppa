
'use server';

import type { Review } from './types';

// --- PROTOTYPE DATA STORE ---
let reviews: Review[] = [
    {
        id: 'rev_1',
        productId: 'prod_1',
        userId: 'user_1',
        authorName: 'Adebayo',
        rating: 5,
        text: "This Ofada rice is the real deal! Tastes just like the one my grandma makes. Will definitely buy again.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'rev_2',
        productId: 'prod_1',
        userId: 'user_2',
        authorName: 'Chioma',
        rating: 4,
        text: "Good quality rice, but had a few stones. Once picked, it was perfect.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  await delay(300);
  return reviews
    .filter(r => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllReviews(): Promise<Review[]> {
    await delay(300);
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await delay(300);
    const newReview: Review = {
        ...reviewData,
        id: `rev_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return newReview;
}
