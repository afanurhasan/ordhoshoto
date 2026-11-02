'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/lib/services/userService';
import { orderService } from '@/lib/services/orderService';
import { User, Order } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Search, Phone, Trash2, Eye, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  async function loadData() {
    const [userList, orderList] = await Promise.all([
      userService.getCustomers(),
      orderService.getAll(),
    ]);
    setUsers(userList);
    setOrders(orderList);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`আপনি কি নিশ্চিত যে গ্রাহক "${name}" কে স্থায়ীভাবে ডিলিট করতে চান?`);
    if (!confirmed) return;

    const success = await userService.delete(id);
    if (success) {
      if (selectedUser?.id === id) {
        setIsDetailsModalOpen(false);
        setSelectedUser(null);
      }
      await loadData();
    }
  };

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const filteredCustomers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.addresses?.[0]?.street && u.addresses[0].street.toLowerCase().includes(q))
    );
  });

  // Calculate customer orders
  const customerOrders = selectedUser
    ? orders.filter(
        (o) =>
          o.userId === selectedUser.id ||
          (o.customerInfo.phone && selectedUser.phone && o.customerInfo.phone.replace(/[^0-9]/g, '') === selectedUser.phone.replace(/[^0-9]/g, ''))
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Registered Customers Directory (গ্রাহক তালিকা)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ওয়েবসাইটে রেজিস্ট্রেশনকৃত সাধারণ গ্রাহকবৃন্দের তালিকা, যোগাযোগের তথ্য ও ক্রয়ের ইতিহাস
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-4 shadow-sm">
        <div className="relative max-w-sm w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold">
          {filteredCustomers.length} Registered Customers
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Mobile Number</th>
                <th className="px-6 py-3.5">Default Delivery Address</th>
                <th className="px-6 py-3.5">Total Orders</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    কোনো রেজিস্টার্ড কাস্টমার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((u) => {
                  const defaultAddr = u.addresses?.[0]?.street || 'ঠিকানা দেওয়া হয়নি';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition group">
                      {/* Name & Initial Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 font-black flex items-center justify-center shrink-0 border border-primary-200">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              Registered User
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      </td>

                      {/* Default Address */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-start gap-1.5 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate block" title={defaultAddr}>
                            {defaultAddr}
                          </span>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {u.totalOrders || 0} orders
                        </span>
                      </td>

                      {/* Spent */}
                      <td className="px-6 py-4 font-black text-slate-900">
                        {formatPrice(u.totalSpent || 0)}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {formatDateTime(u.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetails(u)}
                            className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-rose-50 rounded-lg transition"
                            title="View Customer Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details & History Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Customer Profile & Order Details"
        maxWidth="2xl"
      >
        {selectedUser && (
          <div className="space-y-6 text-xs">
            {/* Customer Profile Banner */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-3 text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono font-semibold">
                      <Phone className="h-3.5 w-3.5 text-primary-600" />
                      {selectedUser.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Joined {formatDateTime(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(selectedUser.id, selectedUser.name)}
                className="self-start sm:self-auto px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold flex items-center gap-1.5 transition border border-red-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Customer</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Orders
                </span>
                <span className="text-lg font-black text-slate-900">
                  {selectedUser.totalOrders || 0} Orders
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Lifetime Spend
                </span>
                <span className="text-lg font-black text-primary-600">
                  {formatPrice(selectedUser.totalSpent || 0)}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Account Status
                </span>
                <span className="inline-block mt-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active Customer
                </span>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span>Default Delivery Address (নির্ধারিত ঠিকানা)</span>
              </div>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedUser.addresses?.[0]?.street || 'কোনো নির্ধারিত ডেলিভারি ঠিকানা সংযুক্ত করা হয়নি।'}
              </p>
            </div>

            {/* Orders Placed by this Customer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-slate-500" />
                  <span>Placed Orders History ({customerOrders.length})</span>
                </h4>
              </div>

              {customerOrders.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400">
                  এই গ্রাহকের কোনো পূর্ববর্তী অর্ডার রেকর্ড পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(ord.createdAt)} • {ord.items.length} items
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={ord.status === 'delivered' ? 'success' : 'primary'} size="sm">
                          {ord.status}
                        </Badge>
                        <span className="font-bold text-slate-900">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
