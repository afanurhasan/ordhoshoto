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
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setError('Please enter a valid 11-digit mobile phone number (e.g. 01712345678).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your delivery address.');
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
      setError(res.message || 'Registration could not be completed.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mx-auto pb-1">
            <Image
              src="/logo.png"
              alt="OrdhoSoto"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-900 font-medium">
            Register to place orders, save delivery addresses, and track your shopping history
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Hossain"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Mobile Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs font-mono text-slate-900 font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-700 font-medium mt-1">
              This number will be used for delivery confirmations and courier updates.
            </p>
          </div>

          {/* Password (1st time) */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (2nd time) */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Default Delivery Address */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Default Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <textarea
                required
                rows={2}
                placeholder="e.g. House 24, Road 11, Sector 4, Uttara, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs resize-none text-slate-900 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm mt-3 cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-900 font-medium pt-3 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-primary-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
