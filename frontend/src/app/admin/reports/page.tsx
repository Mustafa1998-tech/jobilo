'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Flag, ChevronRight, ChevronLeft } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Report {
  id: string;
  reporter?: { firstName: string; lastName: string };
  reportedUser?: { firstName: string; lastName: string };
  reportedProject?: { title: string };
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    INVESTIGATING: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    RESOLVED: 'bg-primary-50 text-primary-600 border-primary-200',
    DISMISSED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      const { data } = await adminClient.get<ReportsResponse>('/super-admin/reports', { params });
      setReports(data.reports || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل البلاغات');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleReview = async (reportId: string, status: string) => {
    setActionLoading(reportId);
    try {
      await adminClient.post(`/super-admin/reports/${reportId}/review`, { status, note: reviewNote });
      fetchReports();
      setSelectedReport(null);
      setReviewNote('');
    } catch {
      setError('فشل مراجعة البلاغ');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">البلاغات</h1>
        <p className="text-gray-500">إجمالي {total} بلاغ</p>
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
      ) : reports.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <Flag size={40} className="mb-3 opacity-50" />
          <p>لا توجد بلاغات</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المعرف</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المبلغ</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المُبلغ عنه</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">النوع</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الوصف</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{report.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {report.reporter ? `${report.reporter.firstName} ${report.reporter.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {report.reportedUser
                      ? `${report.reportedUser.firstName} ${report.reportedUser.lastName}`
                      : report.reportedProject?.title || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">
                    {report.description?.slice(0, 50)}{report.description?.length > 50 ? '...' : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedReport(report); setReviewNote(''); }}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                      title="مراجعة"
                    >
                      <Eye size={15} />
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

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedReport(null)}>
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">مراجعة البلاغ</h2>
              <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-3 text-sm mb-4">
              <div>
                <span className="text-gray-500">المبلغ: </span>
                <span className="text-gray-900">
                  {selectedReport.reporter ? `${selectedReport.reporter.firstName} ${selectedReport.reporter.lastName}` : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">المُبلغ عنه: </span>
                <span className="text-gray-900">
                  {selectedReport.reportedUser
                    ? `${selectedReport.reportedUser.firstName} ${selectedReport.reportedUser.lastName}`
                    : selectedReport.reportedProject?.title || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">النوع: </span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {selectedReport.type}
                </span>
              </div>
              <div>
                <span className="text-gray-500">الوصف: </span>
                <p className="text-gray-300 mt-1">{selectedReport.description}</p>
              </div>
              <div>
                <span className="text-gray-500">الحالة: </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>
            <textarea
              placeholder="ملاحظات المراجعة..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReview(selectedReport.id, 'RESOLVED')}
                disabled={actionLoading === selectedReport.id}
                className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
              >
                قبول وحل
              </button>
              <button
                onClick={() => handleReview(selectedReport.id, 'DISMISSED')}
                disabled={actionLoading === selectedReport.id}
                className="flex-1 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
              >
                رفض
              </button>
              <button
                onClick={() => handleReview(selectedReport.id, 'INVESTIGATING')}
                disabled={actionLoading === selectedReport.id}
                className="flex-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50"
              >
                قيد التحقيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
