'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { mockSiteSettings } from '@/lib/data/mockData';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left items: Hotline & Delivery Promise */}
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 hover:text-white transition">
            <Phone className="h-3.5 w-3.5 text-primary-400" />
            <span>Hotline: <strong className="text-white">{mockSiteSettings.hotline}</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>100% খাঁটি উপাদান ও প্রিমিয়াম কোয়ালিটি নিশ্চয়তা</span>
          </div>
        </div>

        {/* Right items: Tracking, Locations, Admin Link */}
        <div className="flex items-center gap-4 flex-wrap justify-center text-slate-400">
          <Link
            href="/orders"
            className="flex items-center gap-1 hover:text-white transition"
          >
            <Truck className="h-3.5 w-3.5 text-primary-400" />
            <span>Track Order</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/contact"
            className="flex items-center gap-1 hover:text-white transition"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Showroom Locations</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/admin/dashboard"
            className="bg-primary-600/30 text-rose-300 hover:text-white hover:bg-primary-600 px-2 py-0.5 rounded text-[11px] font-semibold transition flex items-center gap-1"
          >
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
