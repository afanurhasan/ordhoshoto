'use client';

import React, { useState, useEffect } from 'react';
import { reviewService } from '@/lib/services/reviewService';
import { Review } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  async function loadData() {
    const list = await reviewService.getAll();
    setReviews(list);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await reviewService.updateStatus(id, 'approved');
    loadData();
  };

  const handleReject = async (id: string) => {
    await reviewService.updateStatus(id, 'rejected');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete review?')) {
      await reviewService.delete(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Reviews Moderation</h1>
        <p className="text-xs text-slate-500 mt-0.5">Approve, moderate, or remove product feedback</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant={rev.status === 'approved' ? 'success' : rev.status === 'rejected' ? 'danger' : 'neutral'} size="sm">
                    {rev.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">&quot;{rev.comment}&quot;</p>
                <span className="text-[11px] text-slate-400 block">{formatDateTime(rev.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(rev.id)}
                    className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
