'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBrandsPage() {
  const router = useRouter();

  useEffect(() => {
    // Brands are disabled across OrdhoSoto
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-500">
      Redirecting to Products management...
    </div>
  );
}
