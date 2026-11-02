'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { orderService } from '@/lib/services/orderService';
import { formatPrice } from '@/lib/utils';
import { Order, PaymentMethod } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, getSummary, clearCart, deliveryZone, setDeliveryZone } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const summary = getSummary();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.addresses[0]?.street || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || 'Dhaka');
  const [district, setDistrict] = useState(user?.addresses[0]?.district || 'Dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const paymentMethod: PaymentMethod = 'cod';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !deliveryAddress) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.thumbnail || item.product.images[0],
        sku: item.product.sku,
        price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.totalPrice,
      }));

      const newOrder = await orderService.create({
        userId: isAuthenticated && user ? user.id : null,
        isGuest: !isAuthenticated,
        customerInfo: {
          fullName,
          phone,
          email: email || undefined,
          deliveryAddress,
          city,
          district,
          division: district === 'Dhaka' ? 'Dhaka' : 'Other',
          deliveryZone,
          orderNotes,
        },
        items: orderItems,
        subtotal: summary.subtotal,
        deliveryCharge: summary.deliveryCharge,
        discount: summary.discountTotal,
        total: summary.grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        status: 'pending',
      });

      setPlacedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed State
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Order Placed Successfully!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We have received your order. Our customer care team will call your phone (
              <strong className="text-slate-800">{placedOrder.customerInfo.phone}</strong>) shortly to confirm delivery.
            </p>
          </div>

          {/* Tracking Ticket */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Order Number</span>
                <p className="font-mono font-bold text-base text-primary-600">{placedOrder.orderNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Amount</span>
                <p className="font-bold text-base text-slate-900">{formatPrice(placedOrder.total)}</p>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <p>
                <strong>Recipient:</strong> {placedOrder.customerInfo.fullName}
              </p>
              <p>
                <strong>Delivery Address:</strong> {placedOrder.customerInfo.deliveryAddress},{' '}
                {placedOrder.customerInfo.city}
              </p>
              <p>
                <strong>Payment Method:</strong>{' '}
                <span className="uppercase font-semibold">{placedOrder.paymentMethod}</span> (
                {placedOrder.paymentStatus})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition shadow-lg shadow-primary-600/30 active:scale-95"
            >
              Continue Shopping (আরও কেনাকাটা করুন)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-block bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your order in minutes. No mandatory login required!
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Guest Checkout Notice */}
          {!isAuthenticated && (
            <div className="bg-rose-50/60 border border-primary-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-primary-900 block">Fast Guest Checkout</span>
                <span className="text-slate-600">You are checking out as a guest. No account required.</span>
              </div>
              <Link href="/login" className="font-bold text-primary-600 hover:underline shrink-0 ml-3">
                Already have an account? Sign In
              </Link>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary-600" />
              <span>Delivery Information (ডেলিভারি তথ্য)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hossain"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (Active) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. tanvir@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House number, road number, area, landmark..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City / District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka, Chittagong, Sylhet..."
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setCity(e.target.value);
                  }}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Zone</label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500 bg-white"
                >
                  <option value="inside_dhaka">Inside Dhaka (৳60)</option>
                  <option value="outside_dhaka">Outside Dhaka (৳120)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver after 3 PM or call alternative number"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 sticky top-24">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Review ({items.length} items)
            </h3>

            {/* Compact items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                    <p className="text-slate-500 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span>{formatPrice(summary.deliveryCharge)}</span>
              </div>
              {summary.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(summary.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3">
                <span>Total Payable</span>
                <span className="text-primary-600 text-xl">{formatPrice(summary.grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xl shadow-primary-600/30 text-sm"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm Order'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Safe & Verified Bangladeshi Retail Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
