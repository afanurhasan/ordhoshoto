'use client';

import React from 'react';
import { mockSiteSettings } from '@/lib/data/mockData';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Support &amp; Help Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Have a question about our products, delivery status, or order details? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <h3 className="text-base font-black text-slate-900">Direct Support Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Hotline</span>
                  <span className="text-slate-600">{mockSiteSettings.hotline} (10:00 AM - 8:00 PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Support</span>
                  <span className="text-slate-600">{mockSiteSettings.whatsapp}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Support</span>
                  <span className="text-slate-600">{mockSiteSettings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Corporate Office</span>
                  <span className="text-slate-600">{mockSiteSettings.corporateOffice || mockSiteSettings.address}</span>
                </div>
              </div>

              {mockSiteSettings.factoryAddress && (
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Factory Address</span>
                    <span className="text-slate-600">{mockSiteSettings.factoryAddress}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Working Hours</span>
                  <span className="text-slate-600">Saturday to Thursday: 10:00 AM - 8:00 PM (Closed Friday mornings)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-black text-slate-900">Send Us an Inquiry</h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <h4 className="font-bold text-sm">Inquiry Received!</h4>
                <p className="text-xs">
                  Thank you for reaching out. One of our customer care executives will reply via email or phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01712345678"
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Product inquiry, order status, or delivery question..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
