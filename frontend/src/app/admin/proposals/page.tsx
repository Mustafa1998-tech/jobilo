'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Proposal {
  id: string;
  freelancer?: { firstName: string; lastName: string };
  project?: { title: string };
  amount: number;
  duration: string;
  status: string;
  createdAt: string;
}

interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  totalPages: number;
}

const statusFilters = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    ACCEPTED: 'bg-primary-50 text-primary-600 border-primary-200',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
    WITHDRAWN: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const { data } = await adminClient.get<ProposalsResponse>('/super-admin/proposals', { params });
      setProposals(data.proposals || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل العروض');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const handleDelete = async (proposalId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
    setActionLoading(proposalId);
    try {
      await adminClient.delete(`/super-admin/proposals/${proposalId}`);
      fetchProposals();
    } catch {
      setError('فشل حذف العرض');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">العروض</h1>
        <p className="text-gray-500">إجمالي {total} عرض</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث باسم المستقل..."
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
              {s === 'ALL' ? 'جميع الحالات' : s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <FileText size={40} className="mb-3 opacity-50" />
          <p>لا توجد عروض</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المستقل</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المشروع</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المبلغ</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المدة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                        {proposal.freelancer?.firstName?.[0] || '?'}
                      </div>
                      <span className="text-gray-900">
                        {proposal.freelancer ? `${proposal.freelancer.firstName} ${proposal.freelancer.lastName}` : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{proposal.project?.title || '—'}</td>
                  <td className="px-4 py-3 text-primary-600 font-medium">{proposal.amount} $</td>
                  <td className="px-4 py-3 text-gray-400">{proposal.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(proposal.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      disabled={actionLoading === proposal.id}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
