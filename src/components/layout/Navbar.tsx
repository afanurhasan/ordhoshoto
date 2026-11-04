'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  Shirt,
  Sparkles,
  Smile,
  Utensils,
  Home,
  Heart,
  Grid,
} from 'lucide-react';
import { mockCategories } from '@/lib/data/mockData';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  interface NavLinkItem {
    label: string;
    href: string;
    badge?: string;
    icon?: React.ReactNode;
  }

  // Exactly 5 categories shown in the horizontal bar + main links
  const navLinks: NavLinkItem[] = [
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
    <nav className="bg-white border-b border-slate-200 shadow-sm hidden lg:block relative z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* All Categories Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-5 py-3 flex items-center gap-2.5 transition rounded-t-lg select-none cursor-pointer"
              aria-label="All Categories"
            >
              <Menu className="h-4 w-4" />
              <span>All Categories</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isCategoryOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Category Dropdown Menu (Shows ALL categories when clicked) */}
            {isCategoryOpen && (
              <div className="absolute left-0 top-full w-72 bg-white rounded-b-2xl shadow-2xl border border-slate-200 border-t-0 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Grid className="h-3.5 w-3.5 text-primary-500" />
                  <span>All Categories ({mockCategories.length})</span>
                </div>

                {mockCategories.map((cat) => (
                  <div key={cat.id} className="group/item relative">
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-primary-600 hover:bg-orange-50/70 transition"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-slate-50 group-hover/item:bg-white group-hover/item:text-primary-600 transition">
                          {getCategoryIcon(cat.icon)}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-slate-400" />
                    </Link>

                    {/* Subcategories Flyout */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="hidden group-hover/item:block absolute left-full top-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 pl-2 pr-4 z-50">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 px-3 pb-2 border-b border-slate-100 mb-2">
                          {cat.name}
                        </div>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products?category=${sub.slug}`}
                            onClick={() => setIsCategoryOpen(false)}
                            className="block px-3 py-1.5 text-xs text-slate-600 hover:text-primary-600 hover:bg-orange-50 rounded-lg transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* View All Categories Link */}
                <div className="border-t border-slate-100 pt-2 px-3 mt-1">
                  <Link
                    href="/categories"
                    onClick={() => setIsCategoryOpen(false)}
                    className="block text-center py-2 px-3 text-xs font-bold text-primary-600 hover:bg-orange-50 rounded-xl transition"
                  >
                    View All Categories ({mockCategories.length}) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation Links (Max 5 categories, No Brands, No Right-side promo) */}
          <div className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'px-3 py-3 text-xs xl:text-sm font-medium transition flex items-center gap-1.5 rounded-md relative whitespace-nowrap',
                    isActive
                      ? 'text-primary-600 font-semibold'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-primary-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
