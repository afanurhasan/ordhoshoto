'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderService } from '@/lib/services/orderService';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Order } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import {
  ShoppingBag,
  MapPin,
  Phone,
  Calendar,
  Banknote,
  ArrowRight,
  LogIn,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      setLoading(true);
      try {
        if (isAuthenticated && user) {
          const orders = await orderService.getByUserId(user.id, user.phone, user.email);
          setUserOrders(orders);
        } else {
          // Fallback if not logged in
          setUserOrders([]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, [isAuthenticated, user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success" dot>Delivered</Badge>;
      case 'shipped':
      case 'processing':
        return <Badge variant="warning" dot>Processing</Badge>;
      case 'confirmed':
        return <Badge variant="primary" dot>Approved</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot>Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot>Pending</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-xs text-slate-900 font-medium mt-1">
          View all your previous purchases, tracking details, and ordered item specifications.
        </p>
      </div>

      {/* Guest / Not logged in state */}
      {!isAuthenticated ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="h-16 w-16 rounded-full bg-orange-50 text-primary-600 flex items-center justify-center mx-auto">
            <LogIn className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Sign in to view your orders</h2>
          <p className="text-xs text-slate-900 font-medium leading-relaxed">
            Sign in to your account to track orders and view your purchase history.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded" />
              <div className="h-20 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">You have no orders yet</h2>
          <p className="text-xs text-slate-900 font-medium">
            You have not placed any orders yet. Explore our latest arrivals!
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List with Full Product Details */
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition space-y-0"
            >
              {/* Order Header Bar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Order #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-900 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-900" />
                    <span>{formatDateTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-black text-slate-900 block">Total Amount</span>
                  <span className="text-base font-black text-primary-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Items Details */}
              <div className="p-6 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                  Ordered Items ({order.items.length} items)
                </h4>

                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.productName}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-900 font-medium mt-0.5">
                            <span className="font-bold text-slate-900">{formatPrice(item.price)}</span>
                            <span>×</span>
                            <span className="font-bold text-primary-600">{item.quantity} Qty</span>
                            {item.sku && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-mono text-[10px] text-slate-900 font-bold">SKU: {item.sku}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information & Payment Footer */}
                <div className="border-t border-slate-200 pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-900 font-medium bg-slate-50 p-4 rounded-2xl">
                  {/* Shipping Info */}
                  <div className="space-y-1.5">
                    <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider block">
                      Delivery Address
                    </span>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">{order.customerInfo.fullName}</p>
                        <p className="text-slate-900">{order.customerInfo.deliveryAddress}, {order.customerInfo.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Phone className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span className="font-bold text-slate-900">{order.customerInfo.phone}</span>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="space-y-1 text-right md:border-l md:border-slate-200 md:pl-4">
                    <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider block">
                      Payment Summary
                    </span>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-900 font-medium">Subtotal:</span>
                      <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-900 font-medium">Delivery Fee:</span>
                      <span className="font-bold text-slate-900">{formatPrice(order.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-t border-slate-200 pt-1 font-black text-slate-900">
                      <span>Payment Method:</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <Banknote className="h-3.5 w-3.5" /> Cash on Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
