'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import { ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const discountPercent = getDiscountPercentage(product.regularPrice, product.discountPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-primary-500/50 hover:shadow-hover transition-all duration-300 flex flex-col h-full relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-primary-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
            -{discountPercent}% OFF
          </span>
        )}
        {product.isHot && (
          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm uppercase">
            HOT
          </span>
        )}
      </div>

      {/* Stock status badge top right */}
      <div className="absolute top-3 right-3 z-10">
        {product.stock <= 0 ? (
          <Badge variant="danger" size="sm">
            Out of Stock
          </Badge>
        ) : product.stock <= 5 ? (
          <Badge variant="warning" size="sm">
            Only {product.stock} left
          </Badge>
        ) : (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In Stock
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full pt-[90%] bg-slate-50/70 overflow-hidden group-hover:bg-rose-50/20 transition-colors"
      >
        <Image
          src={product.thumbnail || product.images[0] || '/logo.png'}
          alt={product.name}
          fill
          unoptimized={typeof (product.thumbnail || product.images?.[0]) === 'string' && (product.thumbnail || product.images?.[0]).startsWith('data:')}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-900">
            <span className="uppercase text-[10px] font-bold tracking-wider text-slate-800">
              {product.category?.name || 'OrdhoSoto'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-800 font-medium">({product.totalReviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Warranty tag */}
          {product.warrantyInfo && (
            <div className="flex items-center gap-1 text-[11px] text-slate-800 font-medium">
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">{product.warrantyInfo}</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-primary-600">
                {formatPrice(product.discountPrice ?? product.regularPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 sm:px-3 sm:py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-200 text-white rounded-xl flex items-center gap-1.5 text-xs font-bold transition shadow-sm hover:shadow"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
