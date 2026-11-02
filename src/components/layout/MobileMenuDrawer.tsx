'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/lib/store/useUIStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Drawer } from '@/components/common/Drawer';
import { mockCategories, mockSiteSettings } from '@/lib/data/mockData';
import { Phone, ShieldCheck, User as UserIcon, LayoutDashboard, Truck } from 'lucide-react';

export const MobileMenuDrawer: React.FC = () => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleClose = () => setMobileMenuOpen(false);

  return (
    <Drawer
      isOpen={isMobileMenuOpen}
      onClose={handleClose}
      position="left"
      title={
        <div className="flex items-center gap-2 py-0.5">
          <Image
            src="/logo.png"
            alt="OrdhoSoto - অর্ধশত"
            width={140}
            height={42}
            className="h-8 w-auto object-contain"
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{user.name}</span>
                <span className="text-slate-500 block truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Welcome, Guest</span>
                <span className="text-slate-500 block">Log in to save orders & cart</span>
              </div>
            </div>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                handleClose();
              }}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleClose}
              className="text-xs font-bold bg-primary-600 text-white px-3 py-1.5 rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Quick Nav Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </h4>
          <div className="space-y-1">
            <Link
              href="/"
              onClick={handleClose}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-primary-600 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={handleClose}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-primary-600 rounded-lg"
            >
              All Products
            </Link>
            <Link
              href="/campaigns"
              onClick={handleClose}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-rose-50 rounded-lg"
            >
              <span>Flash Deals & Campaigns</span>
              <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                HOT
              </span>
            </Link>
            <Link
              href="/orders"
              onClick={handleClose}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-primary-600 rounded-lg"
            >
              <Truck className="h-4 w-4 text-primary-600" />
              <span>Track Your Order</span>
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={handleClose}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg mt-2"
            >
              <LayoutDashboard className="h-4 w-4 text-primary-600" />
              <span>Admin Dashboard Portal</span>
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Browse Categories
          </h4>
          <div className="space-y-1">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={handleClose}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {cat.subcategories?.length || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary-600" />
            <span>Hotline: {mockSiteSettings.hotline}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>100% খাঁটি উপাদান ও কোয়ালিটি গ্যারান্টি</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
