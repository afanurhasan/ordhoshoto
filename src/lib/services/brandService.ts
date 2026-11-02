import { Brand } from '../types';
import { mockBrands } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'ordhosoto_brands_v2';

function getStoredBrands(): Brand[] {
  const stored = storage.get<Brand[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockBrands);
    return mockBrands;
  }
  return stored;
}

export const brandService = {
  async getAll(): Promise<Brand[]> {
    return getStoredBrands();
  },

  async getPopular(): Promise<Brand[]> {
    const brands = getStoredBrands();
    return brands.filter((b) => b.isPopular);
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    const brands = getStoredBrands();
    return brands.find((b) => b.slug === slug) || null;
  },

  async create(data: Omit<Brand, 'id'>): Promise<Brand> {
    const brands = getStoredBrands();
    const newBrand: Brand = {
      ...data,
      id: `brand-${Date.now()}`,
    };
    storage.set(STORAGE_KEY, [...brands, newBrand]);
    return newBrand;
  },

  async update(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    const brands = getStoredBrands();
    const index = brands.findIndex((b) => b.id === id);
    if (index === -1) return null;
    brands[index] = { ...brands[index], ...updates };
    storage.set(STORAGE_KEY, brands);
    return brands[index];
  },

  async delete(id: string): Promise<boolean> {
    const brands = getStoredBrands();
    const filtered = brands.filter((b) => b.id !== id);
    if (filtered.length === brands.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },
};
