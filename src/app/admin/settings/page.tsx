'use client';

import React, { useState } from 'react';
import { mockSiteSettings } from '@/lib/data/mockData';
import { Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(mockSiteSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure store identity, delivery charges, customer support hotline, and address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Store Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Hotline Number</label>
            <input
              type="text"
              value={settings.hotline}
              onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">WhatsApp Support</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Support Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Currency Symbol</label>
            <input
              type="text"
              value={settings.currencySymbol}
              onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Inside Dhaka Shipping Fee (৳)</label>
            <input
              type="number"
              value={settings.insideDhakaShippingFee}
              onChange={(e) => setSettings({ ...settings, insideDhakaShippingFee: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Outside Dhaka Shipping Fee (৳)</label>
            <input
              type="number"
              value={settings.outsideDhakaShippingFee}
              onChange={(e) => setSettings({ ...settings, outsideDhakaShippingFee: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Corporate Office</label>
            <input
              type="text"
              value={settings.corporateOffice || ''}
              onChange={(e) => setSettings({ ...settings, corporateOffice: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Factory Address</label>
            <input
              type="text"
              value={settings.factoryAddress || ''}
              onChange={(e) => setSettings({ ...settings, factoryAddress: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          {saved && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check className="h-4 w-4" /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            className="ml-auto bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
