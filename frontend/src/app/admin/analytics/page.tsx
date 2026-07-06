'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users, Briefcase, FileText,
  TrendingUp, Award, Star,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Overview {
  totalUsers: number;
  totalProjects: number;
  totalProposals: number;
  activeFreelancers?: number;
  activeClients?: number;
  completedProjects?: number;
}

interface MonthlyData {
  month: string;
  value: number;
}

interface TopSkill {
  name: string;
  count: number;
  proposalsCount?: number;
}

interface TopFreelancer {
  id: string;
  name: string;
  projects: number;
  avatar?: string;
}

interface TopClient {
  id: string;
  name: string;
  projectCount: number;
  avatar?: string;
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [usersChart, setUsersChart] = useState<MonthlyData[]>([]);
  const [skills, setSkills] = useState<TopSkill[]>([]);
  const [freelancers, setFreelancers] = useState<TopFreelancer[]>([]);
  const [clients, setClients] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [ovRes, usrRes, skRes, frRes, clRes] = await Promise.all([
          adminClient.get('/super-admin/analytics/overview'),
          adminClient.get('/super-admin/analytics/users'),
          adminClient.get('/super-admin/analytics/skills', { params: { limit: 10 } }),
          adminClient.get('/super-admin/analytics/top-freelancers', { params: { limit: 10 } }),
          adminClient.get('/super-admin/analytics/top-clients', { params: { limit: 10 } }),
        ]);
        setOverview(ovRes.data.overview || ovRes.data || null);
        setUsersChart(usrRes.data.users || usrRes.data?.monthly || usrRes.data || []);
        setUsersChart(usrRes.data.users || usrRes.data?.monthly || usrRes.data || []);
        setSkills(skRes.data.skills || skRes.data || []);
        setFreelancers(frRes.data.freelancers || frRes.data || []);
        setClients(clRes.data.clients || clRes.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'فشل تحميل التحليلات');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التحليلات</h1>
        <p className="text-gray-500">إحصائيات المنصة والأداء</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard icon={Users} label="إجمالي المستخدمين" value={overview?.totalUsers || 0} color="bg-blue-500/10 text-blue-400" />
        <OverviewCard icon={Briefcase} label="إجمالي المشاريع" value={overview?.totalProjects || 0} color="bg-primary-50 text-primary-600" />
        <OverviewCard icon={FileText} label="إجمالي العروض" value={overview?.totalProposals || 0} color="bg-orange-500/10 text-orange-400" />
        <OverviewCard icon={Award} label="المشاريع المنجزة" value={overview?.completedProjects || 0} color="bg-purple-500/10 text-purple-400" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            المستخدمون الجدد
          </h2>
          {usersChart.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2">
              {usersChart.map((item) => {
                const maxVal = Math.max(...usersChart.map((r) => r.value), 1);
                const pct = (item.value / maxVal) * 100;
                return (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-gray-500 shrink-0">{item.month}</span>
                    <div className="flex-1 h-5 rounded bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-l from-blue-500 to-blue-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-xs text-gray-400 text-left">{item.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rankings Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Skills */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" />
            أفضل المهارات
          </h2>
          {skills.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill, idx) => {
                const maxVal = Math.max(...skills.map((s) => s.count), 1);
                const pct = (skill.count / maxVal) * 100;
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300">
                        {idx + 1}. {skill.name}
                      </span>
                      <span className="text-gray-500">{skill.count}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-l from-purple-500 to-purple-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Freelancers */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Award size={16} className="text-yellow-400" />
            أفضل المستقلين
          </h2>
          {freelancers.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {freelancers.map((f, idx) => {
                const maxVal = Math.max(...freelancers.map((x) => x.projects), 1);
                const pct = (f.projects / maxVal) * 100;
                return (
                  <div key={f.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold">
                          {f.name?.[0] || '?'}
                        </div>
                        <span className="text-gray-300">{f.name}</span>
                      </span>
                      <span className="text-gray-500">{f.projects} مشروع</span>
                    </div>
                    <div className="h-2 rounded bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-l from-yellow-500 to-yellow-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Clients */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Star size={16} className="text-cyan-400" />
            أفضل العملاء
          </h2>
          {clients.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {clients.map((c, idx) => {
                const maxVal = Math.max(...clients.map((x) => x.projectCount), 1);
                const pct = (c.projectCount / maxVal) * 100;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                          {c.name?.[0] || '?'}
                        </div>
                        <span className="text-gray-300">{c.name}</span>
                      </span>
                      <span className="text-gray-500">{c.projectCount} مشروع</span>
                    </div>
                    <div className="h-2 rounded bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-l from-cyan-500 to-cyan-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: string | number; color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
