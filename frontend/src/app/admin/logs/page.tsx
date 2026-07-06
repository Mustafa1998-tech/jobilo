'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ClipboardList, LogIn, AlertTriangle, Shield,
  Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

type Tab = 'audit' | 'login' | 'errors' | 'security';

interface LogEntry {
  id: string;
  [key: string]: any;
}

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'audit', label: 'سجل التدقيق', icon: ClipboardList },
  { key: 'login', label: 'تسجيل الدخول', icon: LogIn },
  { key: 'errors', label: 'الأخطاء', icon: AlertTriangle },
  { key: 'security', label: 'الأمان', icon: Shield },
];

const API_PATHS: Record<Tab, string> = {
  audit: '/super-admin/logs/audit',
  login: '/super-admin/logs/login',
  errors: '/super-admin/logs/errors',
  security: '/super-admin/logs/security',
};

const levelBadge = (level: string) => {
  const styles: Record<string, string> = {
    ERROR: 'bg-red-500/10 text-red-400 border-red-500/20',
    WARN: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    INFO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return styles[level] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    SUCCESS: 'bg-primary-50 text-primary-600 border-primary-200',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminLogsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('audit');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">السجلات</h1>
        <p className="text-gray-500">سجلات النشاط والأحداث</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <TabIcon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <LogTable tab={activeTab} apiPath={API_PATHS[activeTab]} />
    </div>
  );
}

function LogTable({ tab, apiPath }: { tab: Tab; apiPath: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const { data } = await adminClient.get(apiPath, { params });
      const logData = data.logs || data.entries || data;
      setLogs(Array.isArray(logData) ? logData : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل السجلات');
    } finally {
      setLoading(false);
    }
  }, [page, search, dateFrom, dateTo, apiPath]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const columns = getColumns(tab);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
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
      ) : logs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <ClipboardList size={40} className="mb-3 opacity-50" />
          <p>لا توجد سجلات</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 text-gray-400 font-medium ${col.align === 'left' ? 'text-left' : 'text-right'}`}>
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-gray-400 font-medium">تفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr
                    key={log.id}
                    className="border-b border-gray-200/50 hover:bg-white/50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.render ? '' : 'text-gray-400'}`}>
                        {col.render ? col.render(log) : formatValue(log[col.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button className="text-gray-500 hover:text-gray-900">
                        {expandedId === log.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-expanded`} className="border-b border-gray-200/50 bg-white">
                      <td colSpan={columns.length + 1} className="px-4 py-3">
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
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

function getColumns(tab: Tab): { key: string; label: string; align?: string; render?: (log: any) => React.ReactNode }[] {
  const timeRender = (log: any) => (
    <span className="text-gray-400">{new Date(log.createdAt || log.timestamp).toLocaleString('ar-EG')}</span>
  );

  switch (tab) {
    case 'audit':
      return [
        { key: 'admin', label: 'المشرف', render: (log: any) => <span className="text-gray-900">{log.admin?.email || log.adminEmail || log.admin || '—'}</span> },
        { key: 'action', label: 'الإجراء', render: (log: any) => <span className="text-gray-900">{log.action}</span> },
        { key: 'targetType', label: 'نوع الهدف', render: (log: any) => <span className="text-gray-400">{log.targetType}</span> },
        { key: 'targetId', label: 'معرف الهدف', render: (log: any) => <span className="text-gray-400 font-mono text-xs">{log.targetId}</span> },
        { key: 'ip', label: 'IP', render: (log: any) => <span className="text-gray-500">{log.ip}</span> },
        { key: 'createdAt', label: 'التاريخ', render: timeRender },
      ];
    case 'login':
      return [
        { key: 'email', label: 'البريد', render: (log: any) => <span className="text-gray-900">{log.email}</span> },
        { key: 'ip', label: 'IP', render: (log: any) => <span className="text-gray-500">{log.ip}</span> },
        { key: 'device', label: 'الجهاز', render: (log: any) => <span className="text-gray-400">{log.device || log.userAgent || '—'}</span> },
        { key: 'browser', label: 'المتصفح', render: (log: any) => <span className="text-gray-400">{log.browser || '—'}</span> },
        { key: 'status', label: 'الحالة', render: (log: any) => (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(log.status)}`}>{log.status}</span>
        )},
        { key: 'createdAt', label: 'التاريخ', render: timeRender },
      ];
    case 'errors':
      return [
        { key: 'level', label: 'المستوى', render: (log: any) => (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${levelBadge(log.level)}`}>{log.level}</span>
        )},
        { key: 'message', label: 'الرسالة', render: (log: any) => <span className="text-gray-900 max-w-[200px] truncate block">{log.message}</span> },
        { key: 'endpoint', label: 'ال端点', render: (log: any) => <span className="text-gray-400 font-mono text-xs">{log.endpoint || log.path || '—'}</span> },
        { key: 'ip', label: 'IP', render: (log: any) => <span className="text-gray-500">{log.ip}</span> },
        { key: 'createdAt', label: 'التاريخ', render: timeRender },
      ];
    case 'security':
      return [
        { key: 'event', label: 'الحدث', render: (log: any) => <span className="text-gray-900">{log.event || log.type}</span> },
        { key: 'admin', label: 'المشرف', render: (log: any) => <span className="text-gray-900">{log.admin?.email || log.adminEmail || log.admin || '—'}</span> },
        { key: 'ip', label: 'IP', render: (log: any) => <span className="text-gray-500">{log.ip}</span> },
        { key: 'details', label: 'التفاصيل', render: (log: any) => <span className="text-gray-400 max-w-[200px] truncate block">{log.details || log.description || '—'}</span> },
        { key: 'severity', label: 'الخطورة', render: (log: any) => (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${levelBadge(log.severity || log.level)}`}>{log.severity || log.level}</span>
        )},
        { key: 'createdAt', label: 'التاريخ', render: timeRender },
      ];
  }
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'string') return val;
  return String(val);
}
