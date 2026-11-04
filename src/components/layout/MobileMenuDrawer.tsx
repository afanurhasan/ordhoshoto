'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/lib/store/useUIStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Drawer } from '@/components/common/Drawer';
import { mockCategories, mockSiteSettings } from '@/lib/data/mockData';
import {
  Phone,
  ShieldCheck,
  User as UserIcon,
  Grid,
  ChevronRight,
  Shirt,
  Sparkles,
  Smile,
  Utensils,
  Home,
  Heart,
  Package,
  UserCircle,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileMenuDrawer: React.FC = () => {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleClose = () => setMobileMenuOpen(false);

  // Exact same nav links as desktop Navbar.tsx
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/products' },
    { label: 'Mens Fashion', href: '/products?category=mens-fashion' },
    { label: 'Womens Fashion', href: '/products?category=womens-fashion' },
    { label: 'Baby & Toys', href: '/products?category=baby-fashion-toys' },
    { label: 'Ghee & Doi', href: '/products?category=ghee-doi-organic' },
    { label: 'Home & Living', href: '/products?category=home-living' },
    { label: 'Contact', href: '/contact' },
  ];

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className="h-4 w-4 text-primary-600" />;
      case 'Utensils':
        return <Utensils className="h-4 w-4 text-primary-600" />;
      case 'Smile':
        return <Smile className="h-4 w-4 text-primary-600" />;
      case 'Home':
        return <Home className="h-4 w-4 text-primary-600" />;
      case 'Heart':
        return <Heart className="h-4 w-4 text-primary-600" />;
      case 'Sparkles':
      default:
        return <Sparkles className="h-4 w-4 text-primary-600" />;
    }
  };

  return (
    <Drawer
      isOpen={isMobileMenuOpen}
      onClose={handleClose}
      position="left"
      title={
        <div className="flex items-center gap-2 py-0.5">
          <Image
            src="/logo.png"
            alt="OrdhoSoto"
            width={140}
            height={42}
            className="h-8 w-auto object-contain"
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Card (matches laptop Header account dropdown behavior) */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          {isAuthenticated && user ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{user.name}</span>
                    <span className="text-slate-500 block truncate max-w-[150px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
              <div className="pt-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-primary-600 rounded-lg transition"
                >
                  <UserCircle className="h-3.5 w-3.5 text-slate-500" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/orders"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-primary-600 rounded-lg transition"
                >
                  <Package className="h-3.5 w-3.5 text-slate-500" />
                  <span>My Orders</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={handleClose}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-primary-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Welcome, Guest</span>
                  <span className="text-slate-500 block">Log in to save orders & cart</span>
                </div>
              </div>
              <Link
                href="/login"
                onClick={handleClose}
                className="text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links (Matches laptop Navbar.tsx exactly) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </h4>
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleClose}
                  className={cn(
                    'block px-3 py-2 text-sm font-semibold rounded-xl transition',
                    isActive
                      ? 'bg-rose-50 text-primary-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Categories Section (Matches laptop All Categories dropdown exactly) */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            <Grid className="h-3.5 w-3.5 text-primary-500" />
            <span>All Categories ({mockCategories.length})</span>
          </div>
          <div className="space-y-1">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={handleClose}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-orange-50/70 hover:text-primary-600 rounded-xl transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-md bg-slate-50">
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span>{cat.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-2 px-1">
            <Link
              href="/categories"
              onClick={handleClose}
              className="block text-center py-2 px-3 text-xs font-bold text-primary-600 hover:bg-orange-50 rounded-xl transition border border-orange-200/60"
            >
              View All Categories ({mockCategories.length}) →
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
          <a
            href={`tel:${mockSiteSettings.hotline}`}
            className="flex items-center gap-2 hover:text-primary-600 transition"
          >
            <Phone className="h-4 w-4 text-primary-600" />
            <span>24/7 Support: {mockSiteSettings.hotline}</span>
          </a>
          <div className="flex items-center gap-2 text-slate-900 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>100% Authentic Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
