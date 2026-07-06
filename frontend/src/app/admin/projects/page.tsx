'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, ToggleLeft, Trash2, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Project {
  id: string;
  title: string;
  client?: { firstName: string; lastName: string };
  category?: { name: string };
  budget: number;
  status: string;
  proposalsCount: number;
  featured: boolean;
  createdAt: string;
}

interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

const statusFilters = ['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    IN_PROGRESS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    COMPLETED: 'bg-primary-50 text-primary-600 border-primary-200',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const { data } = await adminClient.get<ProjectsResponse>('/super-admin/projects', { params });
      setProjects(data.projects || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleToggleFeatured = async (projectId: string) => {
    setActionLoading(projectId);
    try {
      await adminClient.post(`/super-admin/projects/${projectId}/toggle-featured`);
      fetchProjects();
    } catch {
      setError('فشل تحديث المشروع');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    setActionLoading(projectId);
    try {
      await adminClient.delete(`/super-admin/projects/${projectId}`);
      fetchProjects();
    } catch {
      setError('فشل حذف المشروع');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المشاريع</h1>
        <p className="text-gray-500">إجمالي {total} مشروع</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث عن مشروع..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          {statusFilters.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'جميع الحالات' : s === 'IN_PROGRESS' ? 'قيد التنفيذ' : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <Briefcase size={40} className="mb-3 opacity-50" />
          <p>لا يوجد مشاريع</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">العنوان</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">العميل</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">التصنيف</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الميزانية</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">العروض</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    <div className="flex items-center gap-2">
                      {project.featured && <span className="text-yellow-400 text-xs">⭐</span>}
                      {project.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {project.client ? `${project.client.firstName} ${project.client.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{project.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-primary-600">{project.budget} $</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{project.proposalsCount}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-400"
                        title="عرض"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(project.id)}
                        disabled={actionLoading === project.id}
                        className={`rounded-lg p-1.5 ${
                          project.featured ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-500 hover:bg-gray-50 hover:text-yellow-400'
                        } disabled:opacity-50`}
                        title={project.featured ? 'إلغاء المميز' : 'جعله مميزاً'}
                      >
                        <ToggleLeft size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={actionLoading === project.id}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                page === p
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'border border-gray-200 text-gray-400 hover:bg-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
