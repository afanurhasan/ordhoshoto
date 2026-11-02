'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/services/productService';
import { reviewService } from '@/lib/services/reviewService';
import { useCartStore } from '@/lib/store/useCartStore';
import { Product, Review } from '@/lib/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  Plus,
  Minus,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    async function loadProduct() {
      try {
        const prod = await productService.getBySlug(resolvedParams.slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.images[0] || prod.thumbnail);
          const revs = await reviewService.getByProductId(prod.id);
          setReviews(revs);
        }
      } finally {
        setLoading(false);
        // Guarantee viewport starts at the top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    loadProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-8 w-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for may have been removed or renamed.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary-600 text-white px-5 py-2.5 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const discountPercent = getDiscountPercentage(product.regularPrice, product.discountPrice);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-80 sm:h-[450px] w-full rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden flex items-center justify-center p-6">
            <Image
              src={selectedImage || product.thumbnail}
              alt={product.name}
              fill
              priority
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-18 w-18 rounded-2xl overflow-hidden bg-slate-50 border transition ${
                    selectedImage === img
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-orange-50 px-2.5 py-1 rounded-md">
                {product.category?.name || 'OrdhoSoto Original'}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.totalReviews} verified reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <Badge variant="danger" size="sm">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary-600">
                {formatPrice(product.discountPrice ?? product.regularPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Price inclusive of all government VAT & taxes in Bangladesh</p>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Quantity & Buy Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900 select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-300 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition text-xs"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="bg-primary-600 hover:bg-primary-700 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary-600/30 text-xs"
              >
                <Zap className="h-4 w-4" />
                <span>Buy Now (Fast Checkout)</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center text-xs">
            <div className="space-y-1">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Quality Guarantee</span>
              <span className="text-[10px] text-slate-500 block">{product.warrantyInfo || '100% Authentic'}</span>
            </div>
            <div className="space-y-1">
              <Truck className="h-5 w-5 text-primary-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Home Delivery</span>
              <span className="text-[10px] text-slate-500 block">24-48 hrs in Dhaka</span>
            </div>
            <div className="space-y-1">
              <RotateCcw className="h-5 w-5 text-blue-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Easy Exchange</span>
              <span className="text-[10px] text-slate-500 block">7 Days replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Product Details &amp; Specifications
        </h3>

        {product.specifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex p-3 bg-slate-50 rounded-xl justify-between">
                <span className="font-bold text-slate-500">{key}</span>
                <span className="font-semibold text-slate-900 text-right">{val}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600">{product.description}</p>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900">
            Customer Reviews ({reviews.length})
          </h3>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500">No reviews yet for this product. Be the first to leave one!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.userName}</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600">&quot;{rev.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
