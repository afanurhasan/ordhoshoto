'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/services/productService';
import { reviewService } from '@/lib/services/reviewService';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
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
  MessageSquare,
  Send,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newRev = await reviewService.addReview({
        productId: product.id,
        userName: user?.name || 'Valued Customer',
        rating: reviewRating,
        comment: reviewComment.trim(),
        isVerifiedPurchase: true,
      });

      setReviews((prev) => [newRev, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    async function loadProduct() {
      if (!slug) return;
      try {
        const prod = await productService.getBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.thumbnail || prod.images?.[0] || '/logo.png');
          const revs = await reviewService.getByProductId(prod.id);
          setReviews(revs || []);
        }
      } finally {
        setLoading(false);
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      }
    }
    loadProduct();
  }, [slug]);

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
      <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-80 sm:h-[450px] w-full rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden flex items-center justify-center p-6">
            <Image
              src={selectedImage || product.thumbnail || product.images?.[0] || '/logo.png'}
              alt={product.name}
              fill
              priority
              unoptimized={typeof (selectedImage || product.thumbnail || product.images?.[0]) === 'string' && (selectedImage || product.thumbnail || product.images?.[0])?.startsWith('data:')}
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
          {product.images && product.images.filter(Boolean).length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-18 w-18 rounded-2xl overflow-hidden bg-slate-50 border transition ${
                    selectedImage === img
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={img || '/logo.png'}
                    alt=""
                    fill
                    unoptimized={typeof img === 'string' && img.startsWith('data:')}
                    className="object-contain p-1"
                    sizes="72px"
                  />
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
              <span className="text-xs text-slate-900 font-mono font-bold">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-900 font-medium">({product.totalReviews} verified reviews)</span>
              </div>
              <span className="text-slate-400">|</span>
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
                <span className="text-sm text-slate-500 line-through font-semibold">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-900 font-medium">Price inclusive of all government VAT &amp; taxes in Bangladesh</p>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Quantity & Buy Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-900">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-900 hover:bg-slate-100 transition"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900 select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-900 hover:bg-slate-100 transition"
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
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center text-xs">
            <div className="space-y-1">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Quality Guarantee</span>
              <span className="text-[10px] text-slate-900 font-medium block">{product.warrantyInfo || '100% Authentic'}</span>
            </div>
            <div className="space-y-1">
              <Truck className="h-5 w-5 text-primary-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Home Delivery</span>
              <span className="text-[10px] text-slate-900 font-medium block">24-48 hrs in Dhaka</span>
            </div>
            <div className="space-y-1">
              <RotateCcw className="h-5 w-5 text-blue-500 mx-auto" />
              <span className="font-bold text-slate-900 block text-[11px]">Easy Exchange</span>
              <span className="text-[10px] text-slate-900 font-medium block">7 Days replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Full Description Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Product Details &amp; Specifications
        </h3>

        {/* Full Product Description */}
        {product.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Description
            </h4>
            <div className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {product.description}
            </div>
          </div>
        )}

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Specifications &amp; Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex p-3.5 bg-slate-50 rounded-xl justify-between items-center border border-slate-200">
                  <span className="font-bold text-slate-900">{key}</span>
                  <span className="font-bold text-slate-900 text-right pl-3">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">
              Customer Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Review Submission Area: Logged In users get form, Guests get prompt */}
        {isAuthenticated && user ? (
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-primary-600" />
                <span>Write a Review</span>
              </h4>
              <span className="text-xs text-slate-900 font-medium">
                Posting as: <strong className="text-slate-900">{user.name}</strong>
              </span>
            </div>

            {reviewSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your review has been submitted successfully.</span>
              </div>
            )}

            {/* Star Rating Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">Your Rating:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHoverRating(star)}
                    onMouseLeave={() => setReviewHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        (reviewHoverRating || reviewRating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-600 ml-2">
                  {reviewRating} {reviewRating === 5 ? '★ Excellent' : reviewRating === 4 ? '★ Good' : reviewRating === 3 ? '★ Average' : '★ Poor'}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">Your Review:</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your honest feedback regarding product quality, packaging, and delivery..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-primary-500 text-slate-900 font-medium resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-center sm:text-left">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                Want to write a review?
              </span>
              <p className="text-slate-900 text-xs mt-0.5 font-medium">
                Only logged-in customers can submit reviews. Please sign in to share your experience.
              </p>
            </div>
            <Link
              href="/login"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-xl transition text-xs shrink-0 shadow-sm"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Existing Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-900 font-medium">No reviews yet for this product. Be the first to leave one!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl space-y-1 text-xs border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.userName}</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-900 font-medium">&quot;{rev.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
