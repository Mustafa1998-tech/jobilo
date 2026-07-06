'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight, Ban, RefreshCw, Shield, Trash2, Briefcase,
  DollarSign, Star, Clock, Activity, Mail, Calendar,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
}

interface UserStats {
  projectsPosted: number;
  projectsAwarded: number;
  totalEarned: number;
  reviews: number;
}

interface Activity {
  id: string;
  action: string;
  details: string;
  createdAt: string;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-primary-50 text-primary-600 border-primary-200',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    SUSPENDED: 'bg-red-500/10 text-red-400 border-red-500/20',
    BANNED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    projectsPosted: 0, projectsAwarded: 0, totalEarned: 0, reviews: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, statsRes, activityRes] = await Promise.all([
        adminClient.get(`/super-admin/users/${id}`),
        adminClient.get(`/super-admin/users/${id}/stats`),
        adminClient.get(`/super-admin/users/${id}/activity`),
      ]);
      setUser(userRes.data);
      setStats(statsRes.data || { projectsPosted: 0, projectsAwarded: 0, totalEarned: 0, reviews: 0 });
      setActivities(activityRes.data?.activities || activityRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      await adminClient.post(`/super-admin/users/${id}/${action}`);
      fetchData();
    } catch {
      setError('فشل تنفيذ الإجراء');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-12">
        {error || 'المستخدم غير موجود'}
      </div>
    );
  }

  const statCards = [
    { label: 'المشاريع المنشورة', value: stats.projectsPosted, icon: Briefcase, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'المشاريع المسندة', value: stats.projectsAwarded, icon: Star, color: 'text-yellow-400 bg-yellow-500/10' },
    { label: 'إجمالي الأرباح', value: `${stats.totalEarned} $`, icon: DollarSign, color: 'text-primary-600 bg-primary-50' },
    { label: 'التقييمات', value: stats.reviews, icon: Activity, color: 'text-purple-400 bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowRight size={16} />
        العودة
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* User Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-2xl font-bold shrink-0">
            {user.firstName?.[0] || '?'}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(user.status)}`}>
                {user.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> انضم {new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
              {user.lastLogin && (
                <span className="flex items-center gap-1"><Clock size={14} /> آخر دخول {new Date(user.lastLogin).toLocaleDateString('ar-EG')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {user.status !== 'BANNED' ? (
          <button
            onClick={() => handleAction('ban')}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
          >
            <Ban size={15} /> حظر
          </button>
        ) : (
          <button
            onClick={() => handleAction('unban')}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 disabled:opacity-50"
          >
            <Ban size={15} /> إلغاء الحظر
          </button>
        )}
        <button
          onClick={() => handleAction('reset-password')}
          disabled={actionLoading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw size={15} /> إعادة تعيين كلمة المرور
        </button>
        <button
          onClick={() => handleAction('change-role')}
          disabled={actionLoading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          <Shield size={15} /> تغيير الصلاحية
        </button>
        <button
          onClick={() => {
            if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) handleAction('delete');
          }}
          disabled={actionLoading}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
        >
          <Trash2 size={15} /> حذف
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity size={18} className="text-primary-600" />
          النشاطات الأخيرة
        </h2>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد نشاطات</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 border-b border-gray-200/50 pb-3 last:border-0">
                <div className="rounded-full bg-gray-800 p-1.5 mt-0.5">
                  <Activity size={12} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.details || activity.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(activity.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
