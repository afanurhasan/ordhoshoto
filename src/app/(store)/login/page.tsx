'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { userService } from '@/lib/services/userService';
import { Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Reset with OTP States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'phone' | 'otp'>('phone');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

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
      setError(res.message || 'Login failed. Please verify your phone number and password.');
    }
  };

  // Step 1: Send OTP to Phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    const clean = resetPhone.replace(/[^0-9]/g, '');
    if (clean.length < 11) {
      setResetError('Please enter a valid 11-digit registered phone number.');
      return;
    }

    setResetLoading(true);
    const res = await userService.sendOtp(clean);
    setResetLoading(false);

    if (res.success && res.otp) {
      setSimulatedOtp(res.otp);
      setResetStep('otp');
    } else {
      setResetError(res.message || 'Could not send OTP. Please ensure the phone number is correct.');
    }
  };

  // Step 2: Verify OTP & Change Password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (resetOtp.trim().length !== 6) {
      setResetError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match. Please re-enter.');
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
              alt="OrdhoSoto"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h1>
          <p className="text-xs text-slate-900 font-medium">
            Sign in to access your saved addresses, track orders, and view order history
          </p>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. 01819876543"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-900">
                Password <span className="text-red-500">*</span>
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
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono text-slate-900 font-medium"
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

          {error && <p className="text-xs text-red-600 font-bold">⚠️ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm mt-2 cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-900 font-medium pt-2 border-t border-slate-100">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="font-bold text-primary-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Password (OTP Verification)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Simulated SMS Notification Banner */}
          {simulatedOtp && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <MessageSquare className="h-4 w-4" />
                <span>[SMS Simulator] OTP Message Received</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                OrdhoSoto: Your password reset verification code is{' '}
                <strong className="text-sm font-mono text-emerald-950 font-black tracking-widest bg-emerald-100 px-2 py-0.5 rounded">
                  {simulatedOtp}
                </strong>
                . Do not share this with anyone.
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
              <p className="text-slate-900 font-medium">
                Enter your registered mobile phone number. We will send a 6-digit verification code.
              </p>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Registered Phone Number</label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01819876543"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 font-mono text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
                >
                  {resetLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  6-Digit OTP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 482915"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-primary-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setResetStep('phone')}
                  className="text-xs text-primary-600 font-bold hover:underline"
                >
                  ← Change Number
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
                >
                  {resetLoading ? 'Verifying...' : 'Set New Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
