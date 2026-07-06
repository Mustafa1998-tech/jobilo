'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Star, ThumbsUp, MessageSquare, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_RATINGS = [
  { id: '1', from: 'سارة أحمد', role: 'عميل', project: 'تطوير موقع WordPress', rating: 5, comment: 'عمل ممتاز والتسليم في الوقت المحدد. أتعامل معه مرة أخرى.', date: '2026-06-25', likes: 3 },
  { id: '2', from: 'محمد العلي', role: 'عميل', project: 'تصميم شعار', rating: 4, comment: 'تصميم احترافي وتواصل ممتاز. بعض التعديلات كانت مطلوبة.', date: '2026-06-20', likes: 1 },
  { id: '3', from: 'نورة العنزي', role: 'مستقل', project: 'كتابة محتوى للمتجر', rating: 5, comment: 'عميل محترم، تعليمات واضحة ودفع فوري.', date: '2026-06-18', likes: 5 },
  { id: '4', from: 'خالد الحربي', role: 'عميل', project: 'برمجة تطبيق جوال', rating: 3, comment: 'العمل جيد لكن تأخر قليلا في التسليم.', date: '2026-06-15', likes: 0 },
  { id: '5', from: 'فهد القحطاني', role: 'مستقل', project: 'SEO وتحسين محركات', rating: 5, comment: 'تعامل راقي ومشروع ممتع. أنصح بالتعامل معه.', date: '2026-06-12', likes: 2 },
];

const avgRating = (MOCK_RATINGS.reduce((sum, r) => sum + r.rating, 0) / MOCK_RATINGS.length).toFixed(1);

export default function RatingsPage() {
  const [filter, setFilter] = useState<number | null>(null);
  const filtered = filter ? MOCK_RATINGS.filter((r) => r.rating === filter) : MOCK_RATINGS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">التقييمات والمراجعات</h1>
            <p className="text-xs text-gray-500">آراء العملاء والمستقلين</p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-lg font-bold text-gray-900">{avgRating}</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className={s <= Math.round(+avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">{MOCK_RATINGS.length} تقييم</p>
          </div>
        </div>

        <div className="mb-4 flex gap-1">
          <button onClick={() => setFilter(null)}
            className={cn('rounded px-2.5 py-1 text-xs font-medium transition', !filter ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200')}>
            الكل
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('rounded px-2.5 py-1 text-xs font-medium transition flex items-center gap-0.5', filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200')}>
              {s} <Star size={10} className={filter === s ? 'text-white' : 'text-amber-400'} />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">{r.from.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.from}</p>
                    <span className="text-[10px] text-gray-400">{r.role}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="mb-2 text-xs text-gray-500">{r.comment}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><MessageSquare size={10} />{r.project}</span>
                <span className="flex items-center gap-1"><Calendar size={10} />{r.date}</span>
                <span className="flex items-center gap-1"><ThumbsUp size={10} />{r.likes}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-gray-400">لا توجد تقييمات</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
