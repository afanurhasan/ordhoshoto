'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categoryService } from '@/lib/services/categoryService';
import { Category } from '@/lib/types';
import { Layers, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const data = await categoryService.getAll();
      setCategories(data);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>Product Catalog Hierarchy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          All Categories & Subcategories
        </h1>
        <p className="text-xs text-slate-900 font-medium mt-1">
          Explore products organized by categories and subcategories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group bg-white rounded-3xl border border-slate-200 p-6 hover:border-primary-500 hover:shadow-hover transition space-y-4"
          >
            <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src={cat.image || ''}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition"
                >
                  {cat.name}
                </Link>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition" />
              </div>

              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/products?category=${sub.slug}`}
                      className="bg-slate-100 hover:bg-rose-50 text-slate-900 hover:text-primary-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
