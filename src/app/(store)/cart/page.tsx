'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryZone,
    setDeliveryZone,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSummary,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = React.useState('');
  const [couponMsg, setCouponMsg] = React.useState('');

  const summary = getSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponMsg('Coupon successfully applied!');
      setInputCoupon('');
    } else {
      setCouponMsg('Invalid coupon. Try "FIRST500" or "PRODHAN10"');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="h-20 w-20 bg-rose-50 text-primary-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Browse our wide catalog of fashion apparel, baby toys, and authentic organic food to add products to your cart.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition hover:bg-primary-700"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({summary.totalItemsCount} Items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your chosen tech items before advancing to secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <Image
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                      <Link href={`/products/${item.product.slug}`} className="hover:text-primary-600 transition">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SKU: <span className="font-mono text-slate-700">{item.product.sku}</span>
                    </p>
                    <div className="text-xs font-bold text-primary-600 mt-1">
                      {formatPrice(item.unitPrice)} each
                    </div>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-900 min-w-[80px] text-right">
                    {formatPrice(item.totalPrice)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-primary-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Delivery Zone selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Delivery Zone</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('inside_dhaka')}
                  className={`p-2.5 rounded-xl border text-left transition font-medium ${
                    deliveryZone === 'inside_dhaka'
                      ? 'border-primary-500 bg-rose-50/40 text-primary-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  Inside Dhaka
                  <span className="block text-[10px] text-slate-500 font-normal">৳60 (Standard)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside_dhaka')}
                  className={`p-2.5 rounded-xl border text-left transition font-medium ${
                    deliveryZone === 'outside_dhaka'
                      ? 'border-primary-500 bg-rose-50/40 text-primary-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  Outside Dhaka
                  <span className="block text-[10px] text-slate-500 font-normal">৳120 (Nationwide)</span>
                </button>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-700 block">Discount Voucher</label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl">
                  <span>Coupon &quot;{couponCode}&quot; Active</span>
                  <button onClick={removeCoupon} className="text-red-500 font-bold text-xs">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && <p className="text-[11px] text-slate-500">{couponMsg}</p>}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({summary.totalItemsCount} items)</span>
                <span className="font-semibold text-slate-900">{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery Fee</span>
                <span>{formatPrice(summary.deliveryCharge)}</span>
              </div>
              {summary.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(summary.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3">
                <span>Grand Total</span>
                <span className="text-primary-600 text-lg">{formatPrice(summary.grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary-600/25 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Login NOT required to complete order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
