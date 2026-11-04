'use client';

import React, { useState, useEffect } from 'react';
import { settingsService } from '@/lib/services/settingsService';
import { SiteSettings } from '@/lib/types';
import { mockSiteSettings } from '@/lib/data/mockData';
import { Save, Check, Globe, Share2 } from 'lucide-react';

interface PlatformMeta {
  key: keyof NonNullable<SiteSettings['socialChannels']>;
  name: string;
  placeholderUrl: string;
  placeholderHandle: string;
  badgeBg: string;
  textColor: string;
  icon: React.ReactNode;
}

const SOCIAL_PLATFORMS: PlatformMeta[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    placeholderUrl: 'https://facebook.com/ordhosotofashion',
    placeholderHandle: '@ordhosotofashion',
    badgeBg: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30',
    textColor: 'text-[#1877F2]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    placeholderUrl: 'https://wa.me/8801515643689',
    placeholderHandle: '01515-643689',
    badgeBg: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30',
    textColor: 'text-[#25D366]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    name: 'Instagram',
    placeholderUrl: 'https://instagram.com/ordhosoto',
    placeholderHandle: '@ordhosoto',
    badgeBg: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30',
    textColor: 'text-[#E4405F]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    name: 'YouTube',
    placeholderUrl: 'https://youtube.com/@OrdhoSotoFashion',
    placeholderHandle: 'OrdhoSoto Fashion',
    badgeBg: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
    textColor: 'text-[#FF0000]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    placeholderUrl: 'https://tiktok.com/@ordhosotofashion',
    placeholderHandle: '@ordhosotofashion',
    badgeBg: 'bg-pink-50 text-pink-600 border-pink-200',
    textColor: 'text-pink-600',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    placeholderUrl: 'https://linkedin.com/company/ordhosoto',
    placeholderHandle: 'OrdhoSoto Fashion',
    badgeBg: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30',
    textColor: 'text-[#0A66C2]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    name: 'X (Twitter)',
    placeholderUrl: 'https://x.com/ordhosoto',
    placeholderHandle: '@ordhosoto',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
    textColor: 'text-slate-900',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'pinterest',
    name: 'Pinterest',
    placeholderUrl: 'https://pinterest.com/ordhosotofashion',
    placeholderHandle: 'ordhosotofashion',
    badgeBg: 'bg-[#BD081C]/10 text-[#BD081C] border-[#BD081C]/30',
    textColor: 'text-[#BD081C]',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.257-.401.155-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const current = settingsService.getSettings();
    setSettings(current);
  }, []);

  const handleSocialChange = (
    platformKey: keyof NonNullable<SiteSettings['socialChannels']>,
    field: 'href' | 'handle',
    value: string
  ) => {
    const currentChannels = settings.socialChannels || {};
    const platformData = currentChannels[platformKey] || { href: '', handle: '', enabled: true };

    setSettings({
      ...settings,
      socialChannels: {
        ...currentChannels,
        [platformKey]: {
          ...platformData,
          [field]: value,
        },
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website Settings</h1>
        <p className="text-xs text-slate-900 font-medium mt-0.5">
          Configure store identity, delivery charges, customer support hotline, addresses, and footer social links
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="h-5 w-5 text-primary-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Store Identity & Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Hotline Number</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-mono bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">WhatsApp Support</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-mono bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 font-bold bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Inside Dhaka Shipping Fee (৳)</label>
              <input
                type="number"
                value={settings.insideDhakaShippingFee}
                onChange={(e) => setSettings({ ...settings, insideDhakaShippingFee: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Outside Dhaka Shipping Fee (৳)</label>
              <input
                type="number"
                value={settings.outsideDhakaShippingFee}
                onChange={(e) => setSettings({ ...settings, outsideDhakaShippingFee: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-900 block mb-1">Corporate Office</label>
              <input
                type="text"
                value={settings.corporateOffice || ''}
                onChange={(e) => setSettings({ ...settings, corporateOffice: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-900 block mb-1">Factory Address</label>
              <input
                type="text"
                value={settings.factoryAddress || ''}
                onChange={(e) => setSettings({ ...settings, factoryAddress: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links & Handles Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Footer Social Media Links & Handles
                </h2>
                <p className="text-[11px] text-slate-900 font-medium mt-0.5">
                  Set channel URLs and display handles shown in the footer social badges
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {SOCIAL_PLATFORMS.map((platform) => {
              const currentData = settings.socialChannels?.[platform.key] || {
                href: '',
                handle: '',
              };

              return (
                <div
                  key={platform.key}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${platform.badgeBg}`}>
                        {platform.icon}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{platform.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                        Target Link / URL
                      </label>
                      <input
                        type="text"
                        placeholder={platform.placeholderUrl}
                        value={currentData.href}
                        onChange={(e) => handleSocialChange(platform.key, 'href', e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-primary-500 bg-white text-slate-900 font-mono text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                        Display Handle / Text
                      </label>
                      <input
                        type="text"
                        placeholder={platform.placeholderHandle}
                        value={currentData.handle}
                        onChange={(e) => handleSocialChange(platform.key, 'handle', e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            {saved && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                <Check className="h-4 w-4" /> Settings & social media links updated successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
