'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { campaignService } from '@/lib/services/campaignService';
import { productService } from '@/lib/services/productService';
import { Campaign, Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Flame, Clock } from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [flashProducts, setFlashProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const [camps, prods] = await Promise.all([
        campaignService.getActive(),
        productService.getAll({ isFlashSale: true }),
      ]);
      setCampaigns(camps);
      setFlashProducts(prods);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Flame className="h-4 w-4 fill-primary-600" />
          <span>Exclusive Promotions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Flash Sales & Seasonal Campaigns
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Huge savings on premium fashion apparel, baby toys, and authentic organic food with limited quantities
        </p>
      </div>

      {/* Campaigns Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="group relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6"
          >
            <Image
              src={camp.bannerImage}
              alt={camp.title}
              fill
              className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="relative z-10 space-y-2">
              <span className="bg-primary-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Up to {camp.discountPercentage}% OFF
              </span>
              <h3 className="text-xl sm:text-2xl font-black">{camp.title}</h3>
              <div className="flex items-center gap-2 text-xs text-rose-200">
                <Clock className="h-3.5 w-3.5" />
                <span>Active Campaign • Hurry while stock lasts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flash Sale Products */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary-600 fill-primary-600" />
          <span>Active Flash Sale Items</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
