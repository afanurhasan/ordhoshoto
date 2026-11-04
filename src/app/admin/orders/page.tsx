'use client';

import React, { useState, useEffect } from 'react';
import { orderService } from '@/lib/services/orderService';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';
import { Search, CheckCircle2, Clock, PackageCheck, XCircle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [guestOnly, setGuestOnly] = useState(false);

  async function loadOrders() {
    const list = await orderService.getAll({
      status: statusFilter,
      query: searchQuery,
      isGuest: guestOnly ? true : undefined,
    });
    setOrders(list);
  }

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery, guestOnly]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateStatus(orderId, newStatus);
    if (updated) {
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      loadOrders();
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success" dot size="sm">Delivered</Badge>;
      case 'processing':
      case 'shipped':
        return <Badge variant="warning" dot size="sm">Processing</Badge>;
      case 'confirmed':
        return <Badge variant="primary" dot size="sm">Approved</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Management &amp; Fulfillment</h1>
        <p className="text-xs text-slate-900 font-medium mt-0.5">
          Process customer orders, update dispatch status, and manage guest checkouts
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-900" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-900 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-white outline-none focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Approved</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Guest Checkout Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <input
              type="checkbox"
              id="guestCheck"
              checked={guestOnly}
              onChange={(e) => setGuestOnly(e.target.checked)}
              className="h-3.5 w-3.5 text-primary-600 rounded"
            />
            <label htmlFor="guestCheck" className="text-xs font-bold text-slate-900 cursor-pointer">
              Guest Orders Only
            </label>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Order</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Customer & Phone</th>
                <th className="px-6 py-3.5">Zone</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-primary-600 block">{order.orderNumber}</span>
                    {order.isGuest && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Guest
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{order.customerInfo.fullName}</span>
                    <span className="text-slate-400 text-[11px] font-mono">{order.customerInfo.phone}</span>
                  </td>
                  <td className="px-6 py-4 capitalize text-[11px]">
                    {order.customerInfo.deliveryZone.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 uppercase text-[11px] font-semibold">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Quick Status Bar & Actions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-900 font-black uppercase block">Current Status</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Status Update Actions (4 Distinct Statuses) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                  className={cn(
                    'font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm',
                    selectedOrder.status === 'confirmed'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-2 scale-105'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approved</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  className={cn(
                    'font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm',
                    selectedOrder.status === 'processing'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-500 ring-offset-2 scale-105'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Processing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  className={cn(
                    'font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm',
                    selectedOrder.status === 'delivered'
                      ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2 scale-105'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                  )}
                >
                  <PackageCheck className="h-3.5 w-3.5" />
                  <span>Delivered</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  className={cn(
                    'font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm',
                    selectedOrder.status === 'cancelled'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-500 ring-offset-2 scale-105'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  )}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 font-medium">
              <div>
                <h4 className="font-black uppercase text-[10px] text-slate-900 mb-2">Customer Details</h4>
                <p><strong>Name:</strong> {selectedOrder.customerInfo.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                {selectedOrder.customerInfo.email && <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>}
                <p><strong>Customer Type:</strong> {selectedOrder.isGuest ? 'Guest Checkout' : 'Registered User'}</p>
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] text-slate-900 mb-2">Shipping Address</h4>
                <p>{selectedOrder.customerInfo.deliveryAddress}</p>
                <p>{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.district}</p>
                <p><strong>Zone:</strong> {selectedOrder.customerInfo.deliveryZone}</p>
                {selectedOrder.customerInfo.orderNotes && (
                  <p className="mt-1 text-slate-900 italic font-medium">
                    Note: &quot;{selectedOrder.customerInfo.orderNotes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div>
              <h4 className="font-black uppercase text-[10px] text-slate-900 mb-2">Ordered Items</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      <span className="text-slate-900 font-medium text-[11px] block font-mono">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-900 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-medium">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedOrder.deliveryCharge)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount</span>
                <span className="text-primary-600 text-base">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
