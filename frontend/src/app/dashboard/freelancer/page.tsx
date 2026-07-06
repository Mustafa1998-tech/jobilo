'use client';

import { useState } from 'react';
import { FileText, CheckCircle2, Clock, DollarSign, Search, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

const MOCK_STATS = { totalProposals: 24, activeProjects: 2, completedProjects: 15, totalEarned: 12450 };

const MOCK_PROPOSALS = [
  { id: '1', project: 'تطوير موقع WordPress', status: 'ACCEPTED', amount: 2000, date: '2026-06-26' },
  { id: '2', project: 'تصميم UI/UX لتطبيق', status: 'PENDING', amount: 1200, date: '2026-06-24' },
  { id: '3', project: 'برمجة API Node.js', status: 'PENDING', amount: 800, date: '2026-06-22' },
  { id: '4', project: 'كتابة محتوى تسويقي', status: 'REJECTED', amount: 300, date: '2026-06-20' },
  { id: '5', project: 'تطوير متجر إلكتروني', status: 'ACCEPTED', amount: 3500, date: '2026-06-18' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACCEPTED: 'bg-primary-50 text-primary-700',
    REJECTED: 'bg-red-50 text-red-700',
  };
  const labels: Record<string, string> = { PENDING: 'قيد المراجعة', ACCEPTED: 'مقبول', REJECTED: 'مرفوض' };
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status] || 'bg-gray-50 text-gray-600'}`}>{labels[status] || status}</span>;
};

export default function FreelancerDashboardPage() {
  const [stats] = useState(MOCK_STATS);
  const [proposals] = useState(MOCK_PROPOSALS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">لوحة تحكم المستقل</h1>
        <p className="text-xs text-gray-400">ملخص نشاطك وعروضك</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'إجمالي العروض', value: stats.totalProposals, icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { label: 'المشاريع النشطة', value: stats.activeProjects, icon: Clock, color: 'bg-primary-50 text-primary-600' },
          { label: 'المشاريع المكتملة', value: stats.completedProjects, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
          { label: 'إجمالي الأرباح', value: `$${stats.totalEarned.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded border border-gray-200 bg-white p-4">
              <div className={`rounded p-1.5 w-fit ${card.color}`}><Icon size={14} /></div>
              <p className="mt-2.5 text-lg font-semibold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">آخر العروض</h2>
          <Link href="/proposals" className="text-xs text-primary-600 hover:text-primary-700">عرض الكل</Link>
        </div>
        <table className="w-full text-right text-xs">
          <thead><tr className="border-b border-gray-100 text-gray-400"><th className="pb-2 font-medium">المشروع</th><th className="pb-2 font-medium">الحالة</th><th className="pb-2 font-medium">المبلغ</th><th className="pb-2 font-medium">التاريخ</th></tr></thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2 text-gray-900">{p.project}</td>
                <td className="py-2">{statusBadge(p.status)}</td>
                <td className="py-2 text-gray-500">${p.amount.toLocaleString()}</td>
                <td className="py-2 text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { href: '/projects', icon: Search, label: 'تصفح المشاريع' },
          { href: '/proposals', icon: Send, label: 'عروضي' },
          { href: '/messages', icon: MessageSquare, label: 'الرسائل' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex items-center gap-2 rounded border border-gray-200 bg-white p-3 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all">
            <Icon size={14} className="text-primary-600" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
