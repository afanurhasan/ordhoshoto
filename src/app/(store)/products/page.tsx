'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import { Product, Category } from '@/lib/types';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(categoryParam || '');
  }, [categoryParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const [filteredProds, cats] = await Promise.all([
          productService.getAll({
            categorySlug: selectedCategory || undefined,
            query: queryParam || undefined,
            sortBy,
            inStockOnly,
          }),
          categoryService.getAll(),
        ]);
        setProducts(filteredProds);
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, queryParam, sortBy, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            All Products (সকল পণ্য)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {queryParam
              ? `Search results for "${queryParam}" (${products.length} products found)`
              : `Showing ${products.length} products available for delivery across Bangladesh`}
          </p>
        </div>

        {/* Sort and mobile filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="outline-none bg-transparent font-bold text-slate-900 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="h-4 w-4 text-primary-600" />
                <span>Filters</span>
              </div>
              {(selectedCategory || inStockOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setInStockOnly(false);
                  }}
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* In Stock toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stockFilter"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <label htmlFor="stockFilter" className="text-xs font-bold text-slate-700 cursor-pointer">
                In Stock Only
              </label>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    !selectedCategory
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === cat.slug
                        ? 'bg-primary-50 text-primary-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your category or query filters to see available inventory.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setInStockOnly(false);
                }}
                className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading catalog...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
