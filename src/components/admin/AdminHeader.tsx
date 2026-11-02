'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  ShieldCheck,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  href: string;
  type: 'order' | 'stock' | 'system';
  isRead: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user } = useAuthStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'নতুন ক্যাশ অন ডেলিভারি অর্ডার!',
      message: 'অর্ডার #PRD-2026-9281 (৳৪,২১০) - তানভীর হোসেন। ফোন ভেরিফিকেশন প্রয়োজন।',
      time: '১০ মিনিট আগে',
      href: '/admin/orders',
      type: 'order',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'লো স্টক অ্যালার্ট!',
      message: 'বগুড়ার খাঁটি গাওয়া ঘি (৫০০ গ্রাম) স্টকে মাত্র ৫টি বাকি রয়েছে।',
      time: '১ ঘণ্টা আগে',
      href: '/admin/products',
      type: 'stock',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'নতুন কাস্টমার রিভিউ',
      message: 'রয়েল কটন এমব্রয়ডারি পাঞ্জাবিতে ৫ স্টার রিভিউ দেওয়া হয়েছে।',
      time: '৩ ঘণ্টা আগে',
      href: '/admin/reviews',
      type: 'system',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Open Admin Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
          OrdhoSoto Administration
        </span>
      </div>

      {/* Right: Notifications & User Info */}
      <div className="flex items-center gap-3">
        {/* Working Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-primary-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Flyout */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-primary-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    onClick={() => setIsNotifOpen(false)}
                    className={`block p-3.5 hover:bg-slate-50 transition text-xs ${
                      !notif.isRead ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-orange-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type === 'order' && <ShoppingBag className="h-4 w-4" />}
                        {notif.type === 'stock' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        {notif.type === 'system' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-slate-900 text-xs truncate">
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dropdown Footer */}
              <div className="pt-2 px-3 border-t border-slate-100">
                <Link
                  href="/admin/orders"
                  onClick={() => setIsNotifOpen(false)}
                  className="block text-center py-2 text-xs font-bold text-primary-600 hover:bg-orange-50 rounded-xl transition"
                >
                  Manage All Orders →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {user?.name || 'Tauhid Admin'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3" /> Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
