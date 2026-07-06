'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Shield, Plus, Edit3, Trash2, X, Check, Users,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
}

interface Permission {
  module: string;
  actions: { id: string; name: string; description: string }[];
}

const MODULE_LABELS: Record<string, string> = {
  users: 'المستخدمين',
  projects: 'المشاريع',
  proposals: 'العروض',
  subscriptions: 'الاشتراكات',
  reports: 'البلاغات',
  disputes: 'النزاعات',
  reviews: 'التقييمات',
  categories: 'التصنيفات',
  skills: 'المهارات',
  content: 'المحتوى',
  roles: 'الأدوار',
  settings: 'الإعدادات',
  logs: 'السجلات',
  notifications: 'الإشعارات',
  analytics: 'التحليلات',
  security: 'الأمان',
  banners: 'البنرات',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'إنشاء',
  read: 'عرض',
  update: 'تعديل',
  delete: 'حذف',
  view: 'مشاهدة',
  manage: 'إدارة',
  approve: 'موافقة',
  reject: 'رفض',
  ban: 'حظر',
  export: 'تصدير',
};

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; role?: Role }>({ open: false });
  const [editForm, setEditForm] = useState({ name: '', description: '', isSystem: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/roles');
      setRoles(data.roles || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل الأدوار');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const { data } = await adminClient.get('/super-admin/roles/permissions/list');
      setPermissions(data.modules || data || []);
    } catch (e) { console.error('Failed to fetch permissions:', e); }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setRolePermissions([...role.permissions]);
  };

  const togglePermission = (permId: string) => {
    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId],
    );
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSavingPermissions(true);
    try {
      await adminClient.put(`/super-admin/roles/${selectedRole.id}/permissions`, { permissionIds: rolePermissions });
      setSelectedRole({ ...selectedRole, permissions: rolePermissions });
    } catch {
      setError('فشل حفظ الصلاحيات');
    } finally {
      setSavingPermissions(false);
    }
  };

  const openEditModal = (role?: Role) => {
    setEditForm({
      name: role?.name || '',
      description: role?.description || '',
      isSystem: role?.isSystem || false,
    });
    setEditModal({ open: true, role });
  };

  const handleSaveRole = async () => {
    if (!editForm.name.trim()) return;
    setActionLoading('save');
    try {
      if (editModal.role) {
        await adminClient.put(`/super-admin/roles/${editModal.role.id}`, editForm);
      } else {
        await adminClient.post('/super-admin/roles', editForm);
      }
      setEditModal({ open: false });
      fetchRoles();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل حفظ الدور');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (roleId: string) => {
    setActionLoading(roleId);
    try {
      await adminClient.delete(`/super-admin/roles/${roleId}`);
      setDeleteConfirm(null);
      if (selectedRole?.id === roleId) setSelectedRole(null);
      fetchRoles();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل حذف الدور');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأدوار والصلاحيات</h1>
          <p className="text-gray-500">إدارة أدوار المشرفين والصلاحيات</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30"
        >
          <Plus size={16} />
          دور جديد
        </button>
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
      ) : roles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
          <Shield size={40} className="mb-3 opacity-50" />
          <p>لا توجد أدوار</p>
        </div>
      ) : (
        <>
          {/* Roles Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => selectRole(role)}
                className={`rounded-xl border p-4 text-right transition-colors ${
                  selectedRole?.id === role.id
                    ? 'border-primary-200 bg-primary-600/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${role.isSystem ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <Shield size={18} />
                  </div>
                  {role.isSystem && (
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                      نظام
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">{role.name}</p>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{role.description || '—'}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  <span>{role.userCount || 0} مستخدم</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Role - Permission Grid */}
          {selectedRole && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  صلاحيات: {selectedRole.name}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedRole)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                    title="تعديل الدور"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(selectedRole.id)}
                    disabled={selectedRole.isSystem}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="حذف الدور"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {permissions.length === 0 ? (
                <p className="text-gray-500 text-sm">لا توجد صلاحيات متاحة</p>
              ) : (
                <div className="space-y-6">
                  {permissions.map((mod) => (
                    <div key={mod.module}>
                      <h3 className="mb-2 text-sm font-medium text-gray-400">
                        {MODULE_LABELS[mod.module] || mod.module}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mod.actions.map((action) => {
                          const enabled = rolePermissions.includes(action.id);
                          return (
                            <button
                              key={action.id}
                              onClick={() => togglePermission(action.id)}
                              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                enabled
                                  ? 'border-primary-200 bg-primary-50 text-primary-600'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                            >
                              {enabled && <Check size={12} />}
                              {ACTION_LABELS[action.name] || action.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={savePermissions}
                  disabled={savingPermissions}
                  className="rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
                >
                  {savingPermissions ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
                </button>
                <button
                  onClick={() => setRolePermissions([...selectedRole.permissions])}
                  className="rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Create Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditModal({ open: false })}>
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editModal.role ? 'تعديل الدور' : 'دور جديد'}
              </h2>
              <button onClick={() => setEditModal({ open: false })} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
                  placeholder="اسم الدور"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
                  placeholder="وصف الدور"
                  rows={3}
                />
              </div>
              {editModal.role && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isSystem}
                    onChange={(e) => setEditForm({ ...editForm, isSystem: e.target.checked })}
                    className="rounded border-gray-200 bg-gray-800 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-400">دور نظام</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveRole}
                disabled={actionLoading === 'save' || !editForm.name.trim()}
                className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
              >
                {actionLoading === 'save' ? 'جاري...' : 'حفظ'}
              </button>
              <button
                onClick={() => setEditModal({ open: false })}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">تأكيد الحذف</h2>
            <p className="text-sm text-gray-400 mb-6">هل أنت متأكد من حذف هذا الدور؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                {actionLoading === deleteConfirm ? 'جاري...' : 'تأكيد الحذف'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
