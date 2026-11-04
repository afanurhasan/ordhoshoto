import { Review } from '../types';
import { mockReviews } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'prodhan_reviews';

function getStoredReviews(): Review[] {
  const stored = storage.get<Review[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockReviews);
    return mockReviews;
  }
  return stored;
}

export const reviewService = {
  async getAll(): Promise<Review[]> {
    return getStoredReviews();
  },

  async getByProductId(productId: string): Promise<Review[]> {
    const list = getStoredReviews();
    return list.filter((r) => r.productId === productId && r.status === 'approved');
  },

  async addReview(data: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
    const list = getStoredReviews();
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved',
    };
    storage.set(STORAGE_KEY, [newReview, ...list]);
    return newReview;
  },

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const list = getStoredReviews();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return false;
    list[index].status = status;
    storage.set(STORAGE_KEY, list);
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const list = getStoredReviews();
    const filtered = list.filter((r) => r.id !== id);
    if (filtered.length === list.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },
};
