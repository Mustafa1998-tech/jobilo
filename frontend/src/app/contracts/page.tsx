'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contract {
  id: string; project: string; client: string; amount: number; status: string; date: string; deadline: string;
}

const MOCK_CONTRACTS: Contract[] = [
  { id: '1', project: 'تطوير موقع إلكتروني', client: 'شركة المستقبل', amount: 1500, status: 'active', date: '2026-06-20', deadline: '2026-07-20' },
  { id: '2', project: 'تصميم واجهات تطبيق', client: 'منصة إبداع', amount: 2000, status: 'active', date: '2026-06-15', deadline: '2026-07-15' },
  { id: '3', project: 'برمجة API', client: 'تقنية نت', amount: 800, status: 'completed', date: '2026-05-01', deadline: '2026-05-30' },
  { id: '4', project: 'تحسين SEO', client: 'متجر الإلكتروني', amount: 500, status: 'completed', date: '2026-04-10', deadline: '2026-04-25' },
  { id: '5', project: 'تطبيق جوال', client: 'شركة زد', amount: 3500, status: 'pending', date: '2026-06-28', deadline: '2026-07-28' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'bg-emerald-50 text-emerald-700' },
  completed: { label: 'مكتمل', color: 'bg-blue-50 text-blue-700' },
  pending: { label: 'قيد الانتظار', color: 'bg-amber-50 text-amber-700' },
  cancelled: { label: 'ملغي', color: 'bg-red-50 text-red-700' },
};

export default function ContractsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? MOCK_CONTRACTS : MOCK_CONTRACTS.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900">العقود</h1>
          <p className="text-xs text-gray-500">جميع العقود النشطة والمكتملة</p>
        </div>

        <div className="mb-4 flex gap-1">
          {(['all', 'active', 'completed', 'pending', 'cancelled'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('rounded px-2.5 py-1 text-xs font-medium transition', filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {s === 'all' ? 'الكل' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-md border border-gray-200 bg-white p-4 hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{c.project}</h3>
                  <p className="text-xs text-gray-500">{c.client}</p>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', statusConfig[c.status]?.color)}>
                  {statusConfig[c.status]?.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>${c.amount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{c.date} - {c.deadline}</span>
                <button className="text-primary-600 hover:text-primary-700"><ChevronRight size={14} /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-gray-400">لا توجد عقود</p>}
        </div>
      </div>
    </div>
  );
}
