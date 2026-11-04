'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ShoppingBag, User as UserIcon, Menu, PhoneCall } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { formatPrice } from '@/lib/utils';
import { mockSiteSettings } from '@/lib/data/mockData';

export const Header: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { getSummary, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleMobileMenu } = useUIStore();

  const summary = getSummary();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center gap-2 group py-1">
              <Image
                src="/logo.png"
                alt="OrdhoSoto"
                width={170}
                height={52}
                priority
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-[1.02] transition-transform"
              />
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-primary-500 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 bg-white transition"
          >

            <input
              type="text"
              placeholder="Search products, fashion, honey, ghee, toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none font-medium"
            />

            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 flex items-center justify-center font-semibold text-sm transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4 mr-1.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Helpline quick dial (hidden on smaller screens) */}
            <a
              href={`tel:${mockSiteSettings.hotline}`}
              className="hidden xl:flex items-center gap-2.5 text-left border-r border-slate-200 pr-4"
            >
              <div className="h-9 w-9 rounded-full bg-rose-50 text-primary-600 flex items-center justify-center">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div className="text-xs leading-tight">
                <span className="text-slate-600 font-medium block">24/7 Support</span>
                <span className="font-bold text-slate-900">{mockSiteSettings.hotline}</span>
              </div>
            </a>

            {/* User Account / Auth */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition"
                >
                  <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <span className="text-slate-600 block">Hello,</span>
                    <span className="font-bold text-slate-900 block truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </div>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50 w-48">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 text-sm">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-rose-50 text-primary-600 font-semibold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-red-600 border-t border-slate-100 mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition text-slate-700"
              >
                <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <span className="text-slate-600 block">Sign In</span>
                  <span className="font-bold text-slate-900 block">Account</span>
                </div>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2.5 bg-rose-50 hover:bg-rose-100/80 text-primary-600 p-2 sm:px-3 sm:py-2 rounded-xl transition group"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-primary-600 group-hover:scale-105 transition" />
                {summary.totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {summary.totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="text-slate-600 text-[10px] block uppercase font-bold">Cart</span>
                <span className="font-bold text-slate-900 block">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search products, fashion, honey, ghee, toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};
