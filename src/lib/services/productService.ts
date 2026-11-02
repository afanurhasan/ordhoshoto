import { Product } from '../types';
import { mockProducts, mockCategories, mockBrands } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'ordhosoto_products_v2';

export interface ProductFilterParams {
  categorySlug?: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'rating' | 'popular';
}

function getStoredProducts(): Product[] {
  const stored = storage.get<Product[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockProducts);
    return mockProducts;
  }
  let changed = false;
  const synchronized = stored.map((p) => {
    if (!p.subcategoryId) {
      const mock = mockProducts.find((m) => m.id === p.id);
      if (mock && mock.subcategoryId) {
        changed = true;
        return { ...p, subcategoryId: mock.subcategoryId };
      }
    }
    return p;
  });
  if (changed) {
    storage.set(STORAGE_KEY, synchronized);
  }
  return synchronized;
}

export const productService = {
  async getAll(params?: ProductFilterParams): Promise<Product[]> {
    let products = getStoredProducts();

    // Attach category, subcategory, and brand details
    products = products.map((p) => {
      const cat = mockCategories.find((c) => c.id === p.categoryId);
      const sub = cat?.subcategories?.find((s) => s.id === p.subcategoryId);
      return {
        ...p,
        category: cat,
        subcategory: sub,
        brand: mockBrands.find((b) => b.id === p.brandId),
      };
    });

    if (!params) return products;

    if (params.categorySlug) {
      const cat = mockCategories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        products = products.filter((p) => p.categoryId === cat.id);
      } else {
        // Also check if categorySlug matches a subcategory slug
        let foundSubId: string | null = null;
        for (const parent of mockCategories) {
          const sub = parent.subcategories?.find((s) => s.slug === params.categorySlug);
          if (sub) {
            foundSubId = sub.id;
            break;
          }
        }
        if (foundSubId) {
          products = products.filter((p) => p.subcategoryId === foundSubId);
        }
      }
    }

    if (params.subcategoryId) {
      products = products.filter((p) => p.subcategoryId === params.subcategoryId);
    }

    if (params.brandSlug) {
      const brand = mockBrands.find((b) => b.slug === params.brandSlug);
      if (brand) {
        products = products.filter((p) => p.brandId === brand.id);
      }
    }

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.minPrice !== undefined) {
      products = products.filter((p) => (p.discountPrice ?? p.regularPrice) >= (params.minPrice ?? 0));
    }

    if (params.maxPrice !== undefined) {
      products = products.filter((p) => (p.discountPrice ?? p.regularPrice) <= (params.maxPrice ?? Infinity));
    }

    if (params.inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }

    if (params.isFeatured) {
      products = products.filter((p) => p.isFeatured);
    }

    if (params.isFlashSale) {
      products = products.filter((p) => p.isFlashSale);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_low':
          products.sort((a, b) => (a.discountPrice ?? a.regularPrice) - (b.discountPrice ?? b.regularPrice));
          break;
        case 'price_high':
          products.sort((a, b) => (b.discountPrice ?? b.regularPrice) - (a.discountPrice ?? a.regularPrice));
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return products;
  },

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.slug === slug) || null;
  },

  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const products = getStoredProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    storage.set(STORAGE_KEY, updated);
    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct: Product = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updatedProduct;
    storage.set(STORAGE_KEY, products);
    return updatedProduct;
  },

  async delete(id: string): Promise<boolean> {
    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },
};
