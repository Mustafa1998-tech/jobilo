'use client';

import { useState } from 'react';
import { Search, CheckCircle2, XCircle, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SkillStatus = 'pending' | 'approved' | 'rejected';

interface SkillRequest {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  suggestedBy: string;
  userEmail: string;
  date: string;
  status: SkillStatus;
  category: string;
  votes: number;
}

const MOCK_REQUESTS: SkillRequest[] = [
  { id: '1', name: 'Rust', nameAr: 'رست', description: 'لغة برمجة أنظمة', suggestedBy: 'أحمد محمد', userEmail: 'ahmed@example.com', date: '2026-06-28', status: 'pending', category: 'برمجة وتطوير', votes: 5 },
  { id: '2', name: 'GraphQL', nameAr: '', description: 'لغة استعلام APIs', suggestedBy: 'سارة علي', userEmail: 'sara@example.com', date: '2026-06-27', status: 'pending', category: 'برمجة وتطوير', votes: 3 },
  { id: '3', name: 'Figma', nameAr: 'فيغما', description: 'أداة تصميم واجهات', suggestedBy: 'نورة العمري', userEmail: 'nora@example.com', date: '2026-06-26', status: 'approved', category: 'تصميم', votes: 8 },
  { id: '4', name: 'Google Analytics', nameAr: 'جوجل أناليتكس', description: 'تحليل بيانات المواقع', suggestedBy: 'خالد الحربي', userEmail: 'khaled@example.com', date: '2026-06-25', status: 'pending', category: 'تسويق', votes: 2 },
  { id: '5', name: 'Docker', nameAr: 'دوکر', description: 'حاويات برمجية', suggestedBy: 'محمد العلي', userEmail: 'mohammed@example.com', date: '2026-06-24', status: 'rejected', category: 'تقنية معلومات', votes: 1 },
  { id: '6', name: 'Kotlin', nameAr: 'كوتلن', description: 'لغة برمجة أندرويد', suggestedBy: 'فهد القحطاني', userEmail: 'fahad@example.com', date: '2026-06-23', status: 'pending', category: 'برمجة وتطوير', votes: 4 },
  { id: '7', name: 'React Native', nameAr: '', description: 'إطار تطوير تطبيقات الجوال', suggestedBy: 'أحمد محمد', userEmail: 'ahmed@example.com', date: '2026-06-22', status: 'approved', category: 'برمجة وتطوير', votes: 10 },
];

const statusColors: Record<SkillStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

const statusLabels: Record<SkillStatus, string> = {
  pending: 'بانتظار المراجعة',
  approved: 'مقبولة',
  rejected: 'مرفوضة',
};

export default function AdminSkillsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SkillStatus | 'all'>('all');
  const [selected, setSelected] = useState<SkillRequest | null>(null);

  const filtered = requests.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.suggestedBy.includes(q) || r.category.includes(q);
  });

  const updateStatus = (id: string, status: SkillStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">طلبات المهارات الجديدة</h1>
        <p className="text-xs text-gray-500">مراجعة وإدارة المهارات المقترحة من المستخدمين</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-gray-200 py-1.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              )}
            >
              {f === 'all' ? 'الكل' : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-3 py-2 font-medium">المهارة</th>
              <th className="px-3 py-2 font-medium">التصنيف</th>
              <th className="px-3 py-2 font-medium">مقدم الطلب</th>
              <th className="px-3 py-2 font-medium">التاريخ</th>
              <th className="px-3 py-2 font-medium">التأييدات</th>
              <th className="px-3 py-2 font-medium">الحالة</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2.5">
                  <span className="font-medium text-gray-900">{r.name}</span>
                  {r.nameAr && <span className="mr-1 text-gray-400">({r.nameAr})</span>}
                </td>
                <td className="px-3 py-2.5 text-gray-600">{r.category}</td>
                <td className="px-3 py-2.5 text-gray-600">{r.suggestedBy}</td>
                <td className="px-3 py-2.5 text-gray-600">{r.date}</td>
                <td className="px-3 py-2.5 text-gray-600">{r.votes}</td>
                <td className="px-3 py-2.5">
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', statusColors[r.status])}>
                    {statusLabels[r.status]}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <button onClick={() => setSelected(r)} className="text-primary-600 hover:text-primary-700">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-5 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">تفاصيل المهارة</h3>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', statusColors[selected.status])}>
                {statusLabels[selected.status]}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-400">الاسم (إنجليزي)</label><p className="text-gray-900 font-medium">{selected.name}</p></div>
                <div><label className="text-gray-400">الاسم (عربي)</label><p className="text-gray-900">{selected.nameAr || '—'}</p></div>
              </div>
              <div><label className="text-gray-400">الوصف</label><p className="text-gray-900">{selected.description || '—'}</p></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-400">التصنيف</label><p className="text-gray-900">{selected.category}</p></div>
                <div><label className="text-gray-400">التأييدات</label><p className="text-gray-900">{selected.votes}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-400">مقدم الطلب</label><p className="text-gray-900">{selected.suggestedBy}</p></div>
                <div><label className="text-gray-400">تاريخ الإرسال</label><p className="text-gray-900">{selected.date}</p></div>
              </div>
            </div>

            {selected.status === 'pending' && (
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => updateStatus(selected.id, 'approved')}
                  className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 size={12} />
                  قبول
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700"
                >
                  <XCircle size={12} />
                  رفض
                </button>
                <button onClick={() => setSelected(null)} className="mr-auto rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                  إغلاق
                </button>
              </div>
            )}

            {selected.status !== 'pending' && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <button onClick={() => setSelected(null)} className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
