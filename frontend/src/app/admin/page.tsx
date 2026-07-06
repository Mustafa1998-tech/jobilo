'use client';

import { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, Scale, Flag, TrendingUp, Package } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

const defaultStats = {
  totalUsers: 0, totalFreelancers: 0, totalClients: 0,
  totalProjects: 0, openProjects: 0, completedProjects: 0,
  totalProposals: 0, pendingDisputes: 0, pendingReports: 0,
  activeSubscriptions: 0,
  newUsersToday: 0, newProjectsToday: 0,
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  emerald: 'bg-primary-50 text-primary-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  pink: 'bg-pink-50 text-pink-600',
  indigo: 'bg-indigo-50 text-indigo-600',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminClient.get('/super-admin/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => { console.error('Dashboard stats fetch failed:', err); setStats(defaultStats); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, change: `+${stats.newUsersToday} اليوم`, color: 'blue' },
    { label: 'المستقلين', value: stats.totalFreelancers, icon: Users, color: 'purple' },
    { label: 'العملاء', value: stats.totalClients, icon: Users, color: 'cyan' },
    { label: 'المشاريع', value: stats.totalProjects, icon: Briefcase, change: `+${stats.newProjectsToday} اليوم`, color: 'emerald' },
    { label: 'مشاريع مفتوحة', value: stats.openProjects, icon: Briefcase, color: 'amber' },
    { label: 'مشاريع مكتملة', value: stats.completedProjects, icon: Briefcase, color: 'green' },
    { label: 'العروض', value: stats.totalProposals, icon: FileText, color: 'orange' },
    { label: 'نزاعات معلقة', value: stats.pendingDisputes, icon: Scale, color: 'red' },
    { label: 'بلاغات معلقة', value: stats.pendingReports, icon: Flag, color: 'pink' },
    { label: 'اشتراكات نشطة', value: stats.activeSubscriptions, icon: Package, color: 'indigo' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">لوحة التحكم</h1>
        <p className="text-xs text-gray-400">ملخص المنصة</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className={`rounded p-1.5 ${colorMap[card.color]}`}>
                  <Icon size={15} />
                </div>
                {card.change && (
                  <span className="flex items-center gap-0.5 text-[11px] text-primary-600">
                    <TrendingUp size={10} />
                    {card.change}
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-lg font-semibold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
