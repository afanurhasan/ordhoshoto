'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import { Product, Category } from '@/lib/types';
import {
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allProds, cats] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setFeaturedProducts(allProds.filter((p) => p.isFeatured));
        const flash = allProds.filter((p) => p.isFlashSale);
        setFlashSaleProducts(flash.length > 0 ? flash : allProds.filter((p) => p.discountPrice));
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white pt-6 pb-10">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Main Hero Banner with hero.png */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-200/80 bg-white group">
            <div className="relative aspect-[2/1] sm:aspect-[2.2/1] w-full">
              <Image
                src="/hero.png"
                alt="OrdhoSoto - Shop Smart • Live Better"
                fill
                priority
                className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>

            {/* Subtle Gradient Overlay on Bottom for Mobile Quick CTAs */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Official Launch Collection
                </span>
                <p className="text-sm sm:text-base font-extrabold text-white drop-shadow">
                  Authentic Taste &amp; Premium Lifestyle Fashion Destination
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/products"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary-600/40 flex items-center gap-2 transition text-xs sm:text-sm active:scale-95"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Flagship Category Direct Quick Cards matching hero.png */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <Link
              href="/products?category=mens-fashion"
              className="group bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👔</span>
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  Mens Fashion
                </h3>
                <span className="text-[11px] text-orange-100 font-medium">
                  Panjabi, Shirts &amp; T-Shirts
                </span>
              </div>
            </Link>

            <Link
              href="/products?category=womens-fashion"
              className="group bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧕</span>
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  Womens Fashion
                </h3>
                <span className="text-[11px] text-pink-100 font-medium">
                  Borka, Hijabs &amp; Three-Piece
                </span>
              </div>
            </Link>

            <Link
              href="/products?category=baby-fashion-toys"
              className="group bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧸</span>
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  Baby Fashion, Toys
                </h3>
                <span className="text-[11px] text-amber-100 font-medium">
                  Baby Rompers &amp; Fun Toys
                </span>
              </div>
            </Link>

            <Link
              href="/products?category=ghee-doi-organic"
              className="group bg-gradient-to-br from-amber-600 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🍯</span>
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  Ghee, Doi (Organic)
                </h3>
                <span className="text-[11px] text-emerald-100 font-medium">
                  Bogura Doi, Gawa Ghee &amp; Honey
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-900 font-medium mt-0.5">
              Authentic regional delicacies and premium fashion collections
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-primary-500/50 hover:shadow-hover text-center transition flex flex-col items-center justify-center space-y-3"
            >
              <div className="relative h-16 w-16 rounded-2xl bg-orange-50/60 p-2 group-hover:bg-primary-50 transition overflow-hidden">
                <Image
                  src={cat.image || ''}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                  sizes="64px"
                />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-primary-600 transition line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {cat.subcategories?.length || 4}+ Items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-950 via-primary-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white text-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <Flame className="h-6 w-6 fill-primary-600 text-primary-600 animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Super Flash Deals
                </h2>
                <p className="text-xs text-orange-200">
                  Limited time offers! Grab authentic items at best prices before stock runs out.
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="self-start md:self-auto bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition shadow"
            >
              Shop All Products
            </Link>
          </div>

          {/* Flash Sale Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-900">
            {flashSaleProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 text-primary-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs text-slate-900 font-medium">Top-rated items handpicked with guaranteed authentic quality</p>
            </div>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
