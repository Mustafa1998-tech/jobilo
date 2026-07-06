'use client';

import { useState } from 'react';
import { FolderOpen, CheckCircle2, Clock, DollarSign, PlusCircle, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const MOCK_STATS = { totalProjects: 12, activeProjects: 3, completedProjects: 8, totalSpent: 4850 };

const MOCK_PROJECTS = [
  { id: '1', title: 'تطوير موقع إلكتروني', status: 'ACTIVE', budget: 1500, date: '2026-06-25', proposals: 5 },
  { id: '2', title: 'تصميم شعار احترافي', status: 'COMPLETED', budget: 300, date: '2026-06-20', proposals: 12 },
  { id: '3', title: 'تطبيق جوال متكامل', status: 'ACTIVE', budget: 3500, date: '2026-06-18', proposals: 3 },
  { id: '4', title: 'كتابة محتوى تسويقي', status: 'COMPLETED', budget: 200, date: '2026-06-15', proposals: 8 },
  { id: '5', title: 'تحسين محركات البحث SEO', status: 'PENDING', budget: 750, date: '2026-06-10', proposals: 0 },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    ACTIVE: 'bg-primary-50 text-primary-700',
    COMPLETED: 'bg-blue-50 text-blue-700',
    PENDING: 'bg-amber-50 text-amber-700',
    CANCELLED: 'bg-red-50 text-red-700',
  };
  const labels: Record<string, string> = { ACTIVE: 'نشط', COMPLETED: 'مكتمل', PENDING: 'قيد الانتظار', CANCELLED: 'ملغي' };
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status] || 'bg-gray-50 text-gray-600'}`}>{labels[status] || status}</span>;
};

export default function ClientDashboardPage() {
  const [stats] = useState(MOCK_STATS);
  const [projects] = useState(MOCK_PROJECTS);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">لوحة تحكم العميل</h1>
        <p className="text-xs text-gray-400">ملخص مشاريعك ونشاطك</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'إجمالي المشاريع', value: stats.totalProjects, icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
          { label: 'المشاريع النشطة', value: stats.activeProjects, icon: Clock, color: 'bg-primary-50 text-primary-600' },
          { label: 'المشاريع المكتملة', value: stats.completedProjects, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
          { label: 'إجمالي المصروف', value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
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
          <h2 className="text-sm font-semibold text-gray-900">آخر المشاريع</h2>
          <Link href="/projects" className="text-xs text-primary-600 hover:text-primary-700">عرض الكل</Link>
        </div>
        <table className="w-full text-right text-xs">
          <thead><tr className="border-b border-gray-100 text-gray-400"><th className="pb-2 font-medium">المشروع</th><th className="pb-2 font-medium">الحالة</th><th className="pb-2 font-medium">الميزانية</th><th className="pb-2 font-medium">التاريخ</th><th className="pb-2 font-medium">العروض</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2 text-gray-900">{p.title}</td>
                <td className="py-2">{statusBadge(p.status)}</td>
                <td className="py-2 text-gray-500">${p.budget.toLocaleString()}</td>
                <td className="py-2 text-gray-500">{p.date}</td>
                <td className="py-2 text-gray-500">{p.proposals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { href: '/post-project', icon: PlusCircle, label: 'نشر مشروع جديد' },
          { href: '/projects', icon: Users, label: 'تصفح المستقلين' },
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
