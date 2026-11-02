'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { userService } from '@/lib/services/userService';
import { Modal } from '@/components/common/Modal';
import { ArrowRight, Phone, Lock, Eye, EyeOff, CheckCircle2, MessageSquare } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [identifier, setIdentifier] = useState('01819876543');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password OTP modal states
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'phone' | 'otp'>('phone');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError('');
    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.message || 'লগইন ব্যর্থ হয়েছে। নম্বর ও পাসওয়ার্ড যাচাই করুন।');
    }
  };

  // Step 1: Send OTP to Phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    const clean = resetPhone.replace(/[^0-9]/g, '');
    if (clean.length < 11) {
      setResetError('সঠিক ১১ ডিজিটের রেজিস্টার্ড মোবাইল নম্বর দিন।');
      return;
    }

    setResetLoading(true);
    const res = await userService.sendOtp(clean);
    setResetLoading(false);

    if (res.success && res.otp) {
      setSimulatedOtp(res.otp);
      setResetStep('otp');
    } else {
      setResetError(res.message || 'ওটিপি পাঠানো যায়নি। নম্বরটি সঠিক কি না নিশ্চিত করুন।');
    }
  };

  // Step 2: Verify OTP & Change Password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (resetOtp.trim().length !== 6) {
      setResetError('৬ ডিজিটের সঠিক ওটিপি কোড লিখুন।');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('দুটি পাসওয়ার্ড মিলছে না! পুনরায় যাচাই করুন।');
      return;
    }

    setResetLoading(true);
    const res = await userService.verifyOtpAndResetPassword(resetPhone, resetOtp, newPassword);
    setResetLoading(false);

    if (res.success) {
      setResetSuccess(res.message);
      // Pre-fill login
      setIdentifier(resetPhone);
      setPassword(newPassword);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setResetStep('phone');
        setResetSuccess('');
        setSimulatedOtp(null);
      }, 2000);
    } else {
      setResetError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">লগইন করুন</h1>
          <p className="text-xs text-slate-500">আপনার সংরক্ষিত ঠিকানা ও অর্ডার বিবরণী দেখতে প্রবেশ করুন</p>
        </div>

        {/* Standard Login Form */}

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              মোবাইল নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="যেমন: 01819876543"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetPhone(identifier);
                  setIsForgotModalOpen(true);
                  setResetStep('phone');
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-[11px] text-primary-600 hover:underline font-bold"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono"
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

          {error && <p className="text-xs text-red-500 font-semibold">⚠️ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm mt-2"
          >
            <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>একাউন্ট নেই? </span>
          <Link href="/register" className="font-bold text-primary-600 hover:underline">
            নতুন একাউন্ট খুলুন
          </Link>
        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="পাসওয়ার্ড রিসেট (OTP ভেরিফিকেশন)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Simulated SMS Notification Banner */}
          {simulatedOtp && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <MessageSquare className="h-4 w-4" />
                <span>[SMS সিমুলেশন] মোবাইল বার্তা এসেছে</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                OrdhoSoto: আপনার পাসওয়ার্ড রিসেট ওটিপি কোড হলো{' '}
                <strong className="text-sm font-mono text-emerald-950 font-black tracking-widest bg-emerald-100 px-2 py-0.5 rounded">
                  {simulatedOtp}
                </strong>
                । এটি কারো সাথে শেয়ার করবেন না।
              </p>
            </div>
          )}

          {resetSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {resetError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold">
              ⚠️ {resetError}
            </div>
          )}

          {resetStep === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-slate-600">
                আপনার রেজিস্টার্ড মোবাইল নম্বরটি নিচে লিখুন। আমরা উক্ত নম্বরে একটি ওটিপি কোড পাঠাব।
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">রেজিস্টার্ড মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01819876543"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
                >
                  {resetLoading ? 'পাঠানো হচ্ছে...' : 'ওটিপি পাঠান'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ৬ ডিজিটের ওটিপি কোড <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="যেমন: 482915"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setResetStep('phone')}
                  className="text-xs text-primary-600 font-bold hover:underline"
                >
                  ← নম্বর পরিবর্তন করুন
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
                >
                  {resetLoading ? 'যাচাই হচ্ছে...' : 'পাসওয়ার্ড নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
