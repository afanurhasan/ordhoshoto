'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { ArrowRight, Lock, Phone, User as UserIcon, MapPin, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।');
      return;
    }

    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setError('দুটি পাসওয়ার্ড মিলছে না! উভয় ঘরে একই পাসওয়ার্ড দিন।');
      return;
    }

    if (!address.trim()) {
      setError('অর্ডার ডেলিভারির সুবিধার্থে আপনার ঠিকানা লিখুন।');
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      phone: cleanPhone,
      password,
      address: address.trim(),
    });
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.message || 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি।');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto pb-1">
            <Image
              src="/logo.png"
              alt="OrdhoSoto - অর্ধশত"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">নতুন একাউন্ট খুলুন</h1>
          <p className="text-xs text-slate-500">
            অর্ডার করতে, ঠিকানা সংরক্ষণ করতে এবং কেনাকাটার হিস্ট্রি দেখতে রেজিস্ট্রেশন করুন
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              পুরো নাম <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="যেমন: তানভীর হোসেন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              মোবাইল নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="যেমন: 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">ক্যাশ অন ডেলিভারি নিশ্চিত করতে এই নম্বরে যোগাযোগ করা হবে।</p>
          </div>

          {/* Password (1st time) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (2nd time) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              পাসওয়ার্ড পুনরায় লিখুন <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="পাসওয়ার্ড পুনরায় নিশ্চিত করুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs"
              />
            </div>
          </div>

          {/* Default Delivery Address */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              ডিফল্ট ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <textarea
                required
                rows={2}
                placeholder="যেমন: বাড়ি ২৪, রোড ১১, সেক্টর ৪, উত্তরা, ঢাকা"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm mt-3"
          >
            <span>{loading ? 'একাউন্ট তৈরি হচ্ছে...' : 'রেজিস্ট্রেশন সম্পূর্ণ করুন'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>ইতিমধ্যে একাউন্ট আছে? </span>
          <Link href="/login" className="font-bold text-primary-600 hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
