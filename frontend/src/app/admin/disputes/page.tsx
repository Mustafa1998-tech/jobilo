'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, CheckCircle, XCircle, Scale, ChevronRight, ChevronLeft } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Dispute {
  id: string;
  project?: { title: string };
  raisedBy?: { firstName: string; lastName: string };
  against?: { firstName: string; lastName: string };
  reason: string;
  status: string;
  createdAt: string;
}

interface DisputesResponse {
  disputes: Dispute[];
  total: number;
  page: number;
  totalPages: number;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    OPEN: 'bg-red-500/10 text-red-400 border-red-500/20',
    INVESTIGATING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    RESOLVED: 'bg-primary-50 text-primary-600 border-primary-200',
    CLOSED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      const { data } = await adminClient.get<DisputesResponse>('/super-admin/disputes', { params });
      setDisputes(data.disputes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل النزاعات');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  const handleStatusChange = async (disputeId: string, status: string) => {
    setActionLoading(disputeId);
    try {
      await adminClient.post(`/super-admin/disputes/${disputeId}/status`, { status });
      fetchDisputes();
      setSelectedDispute(null);
    } catch {
      setError('فشل تحديث النزاع');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">النزاعات</h1>
        <p className="text-gray-500">إجمالي {total} نزاع</p>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
        />
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
      ) : disputes.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <Scale size={40} className="mb-3 opacity-50" />
          <p>لا توجد نزاعات</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المعرف</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المشروع</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">مرفوع من</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">ضد</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">السبب</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{dispute.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-900">{dispute.project?.title || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {dispute.raisedBy ? `${dispute.raisedBy.firstName} ${dispute.raisedBy.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {dispute.against ? `${dispute.against.firstName} ${dispute.against.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">{dispute.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(dispute.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        onClick={() => setSelectedDispute(dispute)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-400"
                        title="عرض"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(dispute.id, 'RESOLVED')}
                        disabled={actionLoading === dispute.id || dispute.status === 'RESOLVED'}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600 disabled:opacity-50"
                        title="حل"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(dispute.id, 'CLOSED')}
                        disabled={actionLoading === dispute.id || dispute.status === 'CLOSED'}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-400 disabled:opacity-50"
                        title="إغلاق"
                      >
                        <XCircle size={15} />
                      </button>
                    </div>
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

      {/* Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedDispute(null)}>
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">تفاصيل النزاع</h2>
              <button onClick={() => setSelectedDispute(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">المشروع: </span>
                <span className="text-gray-900">{selectedDispute.project?.title || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500">مرفوع من: </span>
                <span className="text-gray-900">
                  {selectedDispute.raisedBy ? `${selectedDispute.raisedBy.firstName} ${selectedDispute.raisedBy.lastName}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">ضد: </span>
                <span className="text-gray-900">
                  {selectedDispute.against ? `${selectedDispute.against.firstName} ${selectedDispute.against.lastName}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">السبب: </span>
                <p className="text-gray-300 mt-1">{selectedDispute.reason}</p>
              </div>
              <div>
                <span className="text-gray-500">الحالة: </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(selectedDispute.status)}`}>
                  {selectedDispute.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500">تاريخ الإنشاء: </span>
                <span className="text-gray-900">{new Date(selectedDispute.createdAt).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {selectedDispute.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleStatusChange(selectedDispute.id, 'RESOLVED')}
                  disabled={actionLoading === selectedDispute.id}
                  className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
                >
                  حل النزاع
                </button>
              )}
              {selectedDispute.status !== 'CLOSED' && (
                <button
                  onClick={() => handleStatusChange(selectedDispute.id, 'CLOSED')}
                  disabled={actionLoading === selectedDispute.id}
                  className="flex-1 rounded-lg bg-gray-800 border border-gray-200 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
