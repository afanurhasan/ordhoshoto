import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'OrdhoSoto | Premium Fashion & Online Shopping in Bangladesh',
    template: '%s | OrdhoSoto',
  },
  description:
    'OrdhoSoto - Premium fashion, apparel, and lifestyle destination in Bangladesh. Fast home delivery and official quality guarantee.',
  keywords: [
    'OrdhoSoto',
    'ordhosoto fashion',
    'ecommerce bangladesh',
    'fashion sirajganj',
    'clothing bogura',
    'online shopping bd',
    'cash on delivery',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
