'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { Drawer } from '@/components/common/Drawer';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    deliveryZone,
    setDeliveryZone,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSummary,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const summary = getSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponError('');
      setInputCoupon('');
    } else {
      setCouponError('Invalid coupon. Try "FIRST500" or "PRODHAN10"');
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      position="right"
      size="md"
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary-600" />
          <span>Shopping Cart ({summary.totalItemsCount})</span>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-rose-50 text-primary-500 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Looks like you haven&apos;t added any tech products or accessories to your cart yet.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition"
          >
            Explore Hot Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full space-y-5">
          {/* Item List */}
          <div className="space-y-4 divide-y divide-slate-100 flex-1 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                  <Image
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                    {item.product.name}
                  </h4>
                  {item.selectedVariant && (
                    <p className="text-[11px] text-slate-500">{item.selectedVariant.name}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-primary-600">
                      {formatPrice(item.unitPrice)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Zone Selector */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
            <span className="font-semibold text-slate-700 block">Delivery Location:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryZone('inside_dhaka')}
                className={`py-2 px-2.5 rounded-lg border text-left transition font-medium ${
                  deliveryZone === 'inside_dhaka'
                    ? 'border-primary-500 bg-white text-primary-700 shadow-sm ring-1 ring-primary-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="block font-bold">Inside Dhaka</span>
                <span className="text-[10px] text-slate-500">৳60 (24-48 hrs)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryZone('outside_dhaka')}
                className={`py-2 px-2.5 rounded-lg border text-left transition font-medium ${
                  deliveryZone === 'outside_dhaka'
                    ? 'border-primary-500 bg-white text-primary-700 shadow-sm ring-1 ring-primary-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="block font-bold">Outside Dhaka</span>
                <span className="text-[10px] text-slate-500">৳120 (48-72 hrs)</span>
              </button>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="space-y-1">
            {couponCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1.5 font-medium">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Coupon &quot;{couponCode}&quot; applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. FIRST500)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
          </div>

          {/* Order Summary & Checkout Trigger */}
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatPrice(summary.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span>{formatPrice(summary.deliveryCharge)}</span>
            </div>
            {summary.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(summary.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
              <span>Grand Total</span>
              <span className="text-primary-600 text-base">{formatPrice(summary.grandTotal)}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-primary-500/20 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-xl flex items-center justify-center text-xs transition"
              >
                View Detailed Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
