'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { orderService } from '@/lib/services/orderService';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import {
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  LogOut,
  Shield,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (isAuthenticated && user) {
        setLoadingOrders(true);
        try {
          const list = await orderService.getByUserId(user.id, user.phone, user.email);
          setOrders(list);
        } finally {
          setLoadingOrders(false);
        }
      }
    }
    loadOrders();
  }, [isAuthenticated, user]);

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="primary" dot size="sm">Approved</Badge>;
      case 'processing':
      case 'shipped':
        return <Badge variant="warning" dot size="sm">Processing</Badge>;
      case 'delivered':
        return <Badge variant="success" dot size="sm">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">Pending</Badge>;
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 2;
      case 'processing':
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">You must be logged in to view your profile and order history.</p>
        <Link
          href="/login"
          className="inline-block bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage personal info, view real-time order status, and track purchases</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary-100 text-primary-700 font-black text-2xl flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <Shield className="h-4 w-4 text-rose-400" />
                <span>Admin Suite</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Contact Info</span>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="h-4 w-4 text-primary-600" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="h-4 w-4 text-primary-600" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Saved Address</span>
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
              <span>{user.addresses[0]?.street || 'House 24, Road 11, Sector 4, Uttara, Dhaka'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders & Live Status Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-50 text-primary-600 flex items-center justify-center font-bold">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                My Orders &amp; Status
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                Real-time tracking and fulfillment updates for your purchases
              </p>
            </div>
          </div>

          <Link
            href="/orders"
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">You have no active orders yet</p>
            <Link
              href="/products"
              className="inline-block bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const stepIndex = getStatusStepIndex(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition"
                >
                  {/* Order Top Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        #{order.orderNumber}
                      </span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-900 font-medium">{formatDateTime(order.createdAt)}</span>
                      <span className="font-black text-slate-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* 4-Step Order Progress Tracker */}
                  {!isCancelled ? (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center">
                          <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-900 mt-1">Order Placed</span>
                        </div>

                        {/* Step 2: Approved */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                              stepIndex >= 2
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-1 ${
                              stepIndex >= 2 ? 'text-emerald-700 font-black' : 'text-slate-500'
                            }`}
                          >
                            Approved
                          </span>
                        </div>

                        {/* Step 3: Processing */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                              stepIndex >= 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <Clock className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-1 ${
                              stepIndex >= 3 ? 'text-amber-700 font-black' : 'text-slate-500'
                            }`}
                          >
                            Processing
                          </span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                              stepIndex >= 4
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            <PackageCheck className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-1 ${
                              stepIndex >= 4 ? 'text-slate-900 font-black' : 'text-slate-500'
                            }`}
                          >
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-rose-700">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>This order has been cancelled.</span>
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="relative h-10 w-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0"
                        >
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[11px] font-bold text-slate-900 pl-1">
                          +{order.items.length - 3} more
                        </span>
                      )}
                      <span className="text-slate-900 font-medium pl-1 text-[11px]">
                        ({order.items.reduce((sum, it) => sum + it.quantity, 0)} items)
                      </span>
                    </div>

                    <Link
                      href="/orders"
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
