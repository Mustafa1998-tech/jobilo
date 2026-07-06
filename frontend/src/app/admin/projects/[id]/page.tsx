'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight, Briefcase, DollarSign, User, Clock,
  ToggleLeft, FileText, Activity, Tag, Star,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  featured: boolean;
  category?: { name: string };
  skills?: { name: string }[];
  client?: { id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
}

interface Proposal {
  id: string;
  freelancer?: { firstName: string; lastName: string };
  amount: number;
  duration: string;
  status: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  createdAt: string;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    IN_PROGRESS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    COMPLETED: 'bg-primary-50 text-primary-600 border-primary-200',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, propRes, actRes] = await Promise.all([
        adminClient.get(`/super-admin/projects/${id}`),
        adminClient.get(`/super-admin/projects/${id}/proposals`),
        adminClient.get(`/super-admin/projects/${id}/activity`),
      ]);
      setProject(projRes.data);
      setProposals(propRes.data?.proposals || propRes.data || []);
      setActivities(actRes.data?.activities || actRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل بيانات المشروع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleToggleFeatured = async () => {
    try {
      await adminClient.post(`/super-admin/projects/${id}/toggle-featured`);
      fetchData();
    } catch {
      setError('فشل تحديث المشروع');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-center text-gray-500 py-12">{error || 'المشروع غير موجود'}</div>;
  }

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

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Project Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(project.status)}`}>
                {project.status}
              </span>
              {project.featured && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  مميز
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <DollarSign size={14} className="text-primary-600" /> {project.budget} $
              </span>
              {project.category && (
                <span className="flex items-center gap-1">
                  <Tag size={14} /> {project.category.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} /> {new Date(project.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
            {project.skills && project.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleToggleFeatured}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm shrink-0 ${
              project.featured
                ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                : 'border-gray-200 bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ToggleLeft size={15} />
            {project.featured ? 'إلغاء التميز' : 'جعله مميزاً'}
          </button>
        </div>
      </div>

      {/* Client Info */}
      {project.client && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User size={18} className="text-primary-600" />
            معلومات العميل
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold">
              {project.client.firstName?.[0] || '?'}
            </div>
            <div>
              <p className="text-gray-900 font-medium">{project.client.firstName} {project.client.lastName}</p>
              <p className="text-sm text-gray-500">{project.client.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Proposals */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={18} className="text-primary-600" />
          العروض المقدمة ({proposals.length})
        </h2>
        {proposals.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد عروض</p>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between border-b border-gray-200/50 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                    {proposal.freelancer?.firstName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {proposal.freelancer ? `${proposal.freelancer.firstName} ${proposal.freelancer.lastName}` : 'مستقل'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {proposal.duration} · {new Date(proposal.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-primary-600">{proposal.amount} $</p>
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-500/10 text-gray-400 border-gray-500/20">
                    {proposal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity size={18} className="text-primary-600" />
          النشاطات
        </h2>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد نشاطات</p>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 border-b border-gray-200/50 pb-3 last:border-0">
                <div className="rounded-full bg-gray-800 p-1.5 mt-0.5">
                  <Activity size={12} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{act.details || act.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(act.createdAt).toLocaleDateString('ar-EG')}
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
