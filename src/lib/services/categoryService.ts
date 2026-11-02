import { Category } from '../types';
import { mockCategories } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'ordhosoto_categories_v2';

function getStoredCategories(): Category[] {
  const stored = storage.get<Category[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockCategories);
    return mockCategories;
  }
  return stored;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return getStoredCategories();
  },

  async getFeatured(): Promise<Category[]> {
    const categories = getStoredCategories();
    return categories.filter((c) => c.isFeatured);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = getStoredCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    const categories = getStoredCategories();
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
    };
    storage.set(STORAGE_KEY, [...categories, newCategory]);
    return newCategory;
  },

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    storage.set(STORAGE_KEY, categories);
    return categories[index];
  },

  async delete(id: string): Promise<boolean> {
    const categories = getStoredCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },
};
