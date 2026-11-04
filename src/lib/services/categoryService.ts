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

  // Clean any bracketed translations if present in stored categories
  let modified = false;
  const cleaned = stored.map((cat) => {
    const cleanCatName = cat.name.replace(/\s*\([^)]*[\u0980-\u09FF][^)]*\)/g, '').trim();
    let catChanged = cleanCatName !== cat.name;

    const cleanedSubs = (cat.subcategories || []).map((sub) => {
      const cleanSubName = sub.name.replace(/\s*\([^)]*[\u0980-\u09FF][^)]*\)/g, '').trim();
      if (cleanSubName !== sub.name) catChanged = true;
      return { ...sub, name: cleanSubName };
    });

    if (catChanged) {
      modified = true;
      return { ...cat, name: cleanCatName, subcategories: cleanedSubs };
    }
    return cat;
  });

  if (modified) {
    storage.set(STORAGE_KEY, cleaned);
    return cleaned;
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

  async addSubcategory(categoryId: string, subData: { name: string; slug?: string }): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return null;

    const cleanName = subData.name.replace(/\s*\([^)]*[\u0980-\u09FF][^)]*\)/g, '').trim();
    if (!cleanName) return null;

    const slug =
      subData.slug ||
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newSub: Category = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      slug,
      parentId: categoryId,
    };

    const existingSubs = categories[index].subcategories || [];
    categories[index] = {
      ...categories[index],
      subcategories: [...existingSubs, newSub],
    };

    storage.set(STORAGE_KEY, categories);
    return categories[index];
  },

  async updateSubcategory(categoryId: string, subcategoryId: string, newName: string): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return null;

    const cleanName = newName.replace(/\s*\([^)]*[\u0980-\u09FF][^)]*\)/g, '').trim();
    if (!cleanName) return null;

    const existingSubs = categories[index].subcategories || [];
    categories[index] = {
      ...categories[index],
      subcategories: existingSubs.map((s) =>
        s.id === subcategoryId
          ? {
              ...s,
              name: cleanName,
              slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            }
          : s
      ),
    };

    storage.set(STORAGE_KEY, categories);
    return categories[index];
  },

  async deleteSubcategory(categoryId: string, subcategoryId: string): Promise<Category | null> {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return null;

    const existingSubs = categories[index].subcategories || [];
    categories[index] = {
      ...categories[index],
      subcategories: existingSubs.filter((s) => s.id !== subcategoryId),
    };

    storage.set(STORAGE_KEY, categories);
    return categories[index];
  },
};
