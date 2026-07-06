'use client';

import { useState } from 'react';
import { Eye, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'accepted' | 'rejected';

const MOCK_PROPOSALS = [
  { id: '1', project: 'تطوير موقع WordPress', amount: 2000, status: 'ACCEPTED', date: '2026-06-26' },
  { id: '2', project: 'تصميم UI/UX لتطبيق جوال', amount: 1200, status: 'PENDING', date: '2026-06-24' },
  { id: '3', project: 'برمجة API باستخدام Node.js', amount: 800, status: 'PENDING', date: '2026-06-22' },
  { id: '4', project: 'كتابة محتوى تسويقي', amount: 300, status: 'REJECTED', date: '2026-06-20' },
  { id: '5', project: 'تطوير متجر إلكتروني', amount: 3500, status: 'ACCEPTED', date: '2026-06-18' },
  { id: '6', project: 'تطبيق React Native', amount: 2500, status: 'PENDING', date: '2026-06-16' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACCEPTED: 'bg-primary-50 text-primary-700',
    REJECTED: 'bg-red-50 text-red-700',
  };
  const labels: Record<string, string> = { PENDING: 'قيد المراجعة', ACCEPTED: 'مقبول', REJECTED: 'مرفوض' };
  return <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', map[status] || 'bg-gray-50 text-gray-500')}>{labels[status] || status}</span>;
};

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const filtered = MOCK_PROPOSALS.filter((p) => {
    if (activeTab === 'accepted') return p.status === 'ACCEPTED';
    if (activeTab === 'rejected') return p.status === 'REJECTED';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'accepted', label: 'مقبولة' },
    { key: 'rejected', label: 'مرفوضة' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-lg font-semibold text-gray-900">عروضي</h1>

        <div className="mb-4 flex gap-1 rounded border border-gray-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 rounded py-1.5 text-xs font-medium transition',
                activeTab === tab.key ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded border border-gray-200 bg-white p-10 text-center">
            <p className="text-xs text-gray-400">لا توجد عروض في هذا القسم</p>
          </div>
        ) : (
          <div className="rounded border border-gray-200 bg-white">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="px-4 py-3 font-medium">المشروع</th>
                  <th className="px-4 py-3 font-medium">المبلغ</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium">التاريخ</th>
                  <th className="px-4 py-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{p.project}</td>
                    <td className="px-4 py-3 text-gray-500">${p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-gray-400">{p.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="rounded border border-gray-200 p-1 text-gray-400 hover:border-gray-300 hover:text-gray-600">
                          <Eye size={14} />
                        </button>
                        {p.status === 'PENDING' && (
                          <button className="rounded border border-gray-200 p-1 text-gray-400 hover:border-red-300 hover:text-red-500">
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
