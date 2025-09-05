
import type { Review } from './types';

// --- In-memory database for prototype ---
let reviews: Review[] = [
    {
        id: 'rev_1',
        productId: 'prod_1',
        authorName: 'Aisha Bello',
        rating: 5,
        text: 'This Ofada rice is the best! It has that authentic, local flavor I was looking for. Will definitely buy again.',
        createdAt: new Date('2023-10-20T10:00:00Z').toISOString(),
    },
    {
        id: 'rev_2',
        productId: 'prod_1',
        authorName: 'Chidi Okoro',
        rating: 4,
        text: 'Very good quality rice, but a bit pricey compared to the market. Still, worth it for the convenience.',
        createdAt: new Date('2023-10-22T14:30:00Z').toISOString(),
    }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  await delay(100);
  const productReviews = reviews.filter(r => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return JSON.parse(JSON.stringify(productReviews));
}

export async function getAllReviews(): Promise<Review[]> {
    await delay(100);
    const allReviews = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return JSON.parse(JSON.stringify(allReviews));
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await delay(150);
  const newReview: Review = {
    id: `rev_${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  return JSON.parse(JSON.stringify(newReview));
}
