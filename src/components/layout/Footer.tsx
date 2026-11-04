'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Banknote,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { mockSiteSettings } from '@/lib/data/mockData';
import { settingsService } from '@/lib/services/settingsService';
import { SiteSettings } from '@/lib/types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);

  useEffect(() => {
    setSettings(settingsService.getSettings());

    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent?.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(settingsService.getSettings());
      }
    };

    window.addEventListener('ordhosoto_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('ordhosoto_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  const sc = settings.socialChannels || mockSiteSettings.socialChannels || {};

  const socialLinks = [
    {
      name: 'Facebook',
      label: 'Facebook Page',
      handle: sc.facebook?.handle || '@ordhosotofashion',
      href: sc.facebook?.href || 'https://facebook.com/ordhosotofashion',
      badgeColor: 'hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 hover:text-[#1877F2]',
      iconColor: 'text-[#1877F2]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      label: 'WhatsApp Chat',
      handle: sc.whatsapp?.handle || '01515-643689',
      href: sc.whatsapp?.href || 'https://wa.me/8801515643689',
      badgeColor: 'hover:bg-[#25D366]/10 hover:border-[#25D366]/50 hover:text-[#25D366]',
      iconColor: 'text-[#25D366]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      label: 'Instagram',
      handle: sc.instagram?.handle || '@ordhosoto',
      href: sc.instagram?.href || 'https://instagram.com/ordhosoto',
      badgeColor: 'hover:bg-[#E4405F]/10 hover:border-[#E4405F]/50 hover:text-[#E4405F]',
      iconColor: 'text-[#E4405F]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      label: 'YouTube Channel',
      handle: sc.youtube?.handle || 'OrdhoSoto Fashion',
      href: sc.youtube?.href || 'https://youtube.com',
      badgeColor: 'hover:bg-[#FF0000]/10 hover:border-[#FF0000]/50 hover:text-[#FF0000]',
      iconColor: 'text-[#FF0000]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      label: 'TikTok',
      handle: sc.tiktok?.handle || '@ordhosotofashion',
      href: sc.tiktok?.href || 'https://tiktok.com/@ordhosotofashion',
      badgeColor: 'hover:bg-pink-500/10 hover:border-pink-500/50 hover:text-pink-400',
      iconColor: 'text-pink-400',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      label: 'LinkedIn',
      handle: sc.linkedin?.handle || 'OrdhoSoto Fashion',
      href: sc.linkedin?.href || 'https://linkedin.com',
      badgeColor: 'hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/50 hover:text-[#0A66C2]',
      iconColor: 'text-[#0A66C2]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      label: 'X (Twitter)',
      handle: sc.twitter?.handle || '@ordhosoto',
      href: sc.twitter?.href || 'https://twitter.com',
      badgeColor: 'hover:bg-slate-700/30 hover:border-slate-500 hover:text-white',
      iconColor: 'text-slate-300',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      label: 'Pinterest',
      handle: sc.pinterest?.handle || 'ordhosotofashion',
      href: sc.pinterest?.href || 'https://pinterest.com',
      badgeColor: 'hover:bg-[#BD081C]/10 hover:border-[#BD081C]/50 hover:text-[#BD081C]',
      iconColor: 'text-[#BD081C]',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.257-.401.155-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Sleek Trust Badges Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-600/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">100% Genuine</h5>
              <p className="text-[11px] text-slate-300">Authentic materials &amp; quality</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-600/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Fast Home Delivery</h5>
              <p className="text-[11px] text-slate-300">All across Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-600/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Easy Exchange</h5>
              <p className="text-[11px] text-slate-300">7-day size &amp; item exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-600/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Cash on Delivery</h5>
              <p className="text-[11px] text-slate-300">100% Cash on delivery service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links - Nicely Arranged & Balanced */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand Info & Address */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="bg-white px-3 py-1.5 rounded-xl inline-block shadow-sm">
              <Image
                src="/logo.png"
                alt="OrdhoSoto"
                width={140}
                height={42}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pr-4">
              OrdhoSoto - Your trusted online destination for premium lifestyle fashion, modest apparel, and authentic regional delicacies. Superior quality and prompt delivery guaranteed.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-300">
              {settings.corporateOffice && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Corporate Office: </span>
                    <span>{settings.corporateOffice}</span>
                  </div>
                </div>
              )}
              {settings.factoryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Factory: </span>
                    <span>{settings.factoryAddress}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>Contact: {settings.hotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>E-mail: {settings.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Product Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/products?category=mens-fashion" className="hover:text-primary-400 transition">
                  Mens Fashion (Panjabi &amp; Shirts)
                </Link>
              </li>
              <li>
                <Link href="/products?category=womens-fashion" className="hover:text-primary-400 transition">
                  Womens Fashion (Borka &amp; Hijabs)
                </Link>
              </li>
              <li>
                <Link href="/products?category=baby-fashion-toys" className="hover:text-primary-400 transition">
                  Baby Fashion &amp; Toys (Dresses &amp; Toys)
                </Link>
              </li>
              <li>
                <Link href="/products?category=ghee-doi-organic" className="hover:text-primary-400 transition">
                  Ghee, Doi &amp; Honey (Bogura Doi &amp; Ghee)
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-living" className="hover:text-primary-400 transition">
                  Home &amp; Living (Home Decor)
                </Link>
              </li>
              <li>
                <Link href="/products?category=fragrance-attar" className="hover:text-primary-400 transition">
                  Fragrance &amp; Attar (Organic Perfumes)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media Links */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Connect on Social Media
            </h5>
            <p className="text-[11px] text-slate-300">
              Stay connected for our newest arrivals, exclusive offers, and latest updates:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 transition-all duration-200 group ${item.badgeColor}`}
                >
                  <div className={`p-1 rounded-md bg-slate-900/60 shrink-0 ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-white group-hover:text-inherit truncate">
                      {item.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {item.handle}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-3.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} OrdhoSoto. All rights reserved. | Developed by{' '}
            <a
              href="http://wavelinecorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 font-semibold hover:text-primary-400 hover:underline transition"
            >
              Waveline Corp.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
