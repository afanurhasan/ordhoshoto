'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { MapPin, Phone, Mail, ShoppingCart, LogOut, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();

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
        <p className="text-xs text-slate-500 mt-1">Manage personal info, shipping addresses, and saved data</p>
      </div>

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

        <div className="pt-2 flex justify-end">
          <Link
            href="/orders"
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View All My Orders →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
