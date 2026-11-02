'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderService } from '@/lib/services/orderService';
import { DashboardStats, Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadData() {
      const [dashStats, allOrders] = await Promise.all([
        orderService.getDashboardStats(),
        orderService.getAll(),
      ]);
      setStats(dashStats);
      setRecentOrders(allOrders.slice(0, 5));
    }
    loadData();
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success" dot size="sm">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="info" dot size="sm">Shipped</Badge>;
      case 'processing':
        return <Badge variant="warning" dot size="sm">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="primary" dot size="sm">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for OrdhoSoto retail store orders, sales, and catalog status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Package className="h-4 w-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>All Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {stats ? formatPrice(stats.totalRevenue) : '৳0'}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +14.8% from last month
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">
              {stats?.guestOrdersCount || 0} Guest Orders • {stats?.deliveredOrders || 0} Delivered
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-600">{stats?.pendingOrders || 0}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Require customer phone confirmation</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Alerts</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-600">{stats?.lowStockProducts || 0}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Products running low on inventory</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Live feed of registered & guest checkout orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Total (BDT)</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono font-bold text-primary-600">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{order.customerInfo.fullName}</span>
                    <span className="text-slate-400 text-[11px]">{order.customerInfo.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    {order.isGuest ? (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Guest Checkout
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Registered User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 uppercase font-semibold text-[11px]">
                    {order.paymentMethod} ({order.paymentStatus})
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-primary-600 hover:text-primary-800 font-bold hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
