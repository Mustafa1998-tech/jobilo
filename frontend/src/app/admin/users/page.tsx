'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Slash, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

const roleFilters = ['ALL', 'FREELANCER', 'CLIENT', 'ADMIN'];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-primary-50 text-primary-600 border-primary-200',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    SUSPENDED: 'bg-red-500/10 text-red-400 border-red-500/20',
    BANNED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter !== 'ALL') params.role = roleFilter;
      const { data } = await adminClient.get<UsersResponse>('/super-admin/users', { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleBan = async (userId: string, currentStatus: string) => {
    setActionLoading(userId);
    try {
      const action = currentStatus === 'BANNED' ? 'unban' : 'ban';
      await adminClient.post(`/super-admin/users/${userId}/${action}`);
      fetchUsers();
    } catch {
      setError('فشل تحديث حالة المستخدم');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    setActionLoading(userId);
    try {
      await adminClient.delete(`/super-admin/users/${userId}`);
      fetchUsers();
    } catch {
      setError('فشل حذف المستخدم');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p className="text-gray-500">إجمالي {total} مستخدم</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث عن مستخدم..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {roleFilters.map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {role === 'ALL' ? 'الكل' : role === 'FREELANCER' ? 'مستقل' : role === 'CLIENT' ? 'عميل' : 'مشرف'}
            </button>
          ))}
        </div>
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
      ) : users.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <Users size={40} className="mb-3 opacity-50" />
          <p>لا يوجد مستخدمين</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الاسم</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">البريد</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الدور</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ التسجيل</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-sm font-bold">
                        {user.firstName?.[0] || '?'}
                      </div>
                      <span className="text-gray-900">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-400"
                        title="عرض"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleBan(user.id, user.status)}
                        disabled={actionLoading === user.id}
                        className={`rounded-lg p-1.5 ${
                          user.status === 'BANNED' ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-500 hover:bg-gray-50 hover:text-red-400'
                        } disabled:opacity-50`}
                        title={user.status === 'BANNED' ? 'إلغاء الحظر' : 'حظر'}
                      >
                        <Slash size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={actionLoading === user.id}
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
