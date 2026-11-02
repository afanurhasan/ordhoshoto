import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileMenuDrawer } from '@/components/layout/MobileMenuDrawer';
import { ScrollToTop } from '@/components/common/ScrollToTop';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <ScrollToTop />
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Global Slide-Over Drawers */}
      <CartDrawer />
      <MobileMenuDrawer />
    </div>
  );
}
