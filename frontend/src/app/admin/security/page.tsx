'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Shield, ShieldOff, Smartphone, Activity,
  Plus, Trash2, X, Monitor, Globe,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface IpEntry {
  id: string;
  ip: string;
  description: string;
  createdBy?: string;
  createdAt: string;
}

interface Device {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
  user?: { firstName: string; lastName: string; email: string };
}

interface Session {
  id: string;
  admin?: { email: string };
  adminEmail?: string;
  ip: string;
  device: string;
  browser: string;
  lastActivity: string;
}

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الأمان</h1>
        <p className="text-gray-500">إدارة أمان المنصة</p>
      </div>

      <IpWhitelistSection />
      <IpBlacklistSection />
      <UserDevicesSection />
      <ActiveSessionsSection />
    </div>
  );
}

/* ============ IP Whitelist ============ */
function IpWhitelistSection() {
  const [items, setItems] = useState<IpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ip: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/security/ip-whitelist');
      setItems(data.whitelist || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async () => {
    if (!form.ip.trim()) return;
    setSaving(true);
    try {
      await adminClient.post('/super-admin/security/ip-whitelist', form);
      setShowAdd(false);
      setForm({ ip: '', description: '' });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الإضافة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/security/ip-whitelist/${id}`);
      setDeleteConfirm(null);
      fetch();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <IpSection
      title="قائمة IP البيضاء"
      icon={Shield}
      iconColor="text-primary-600 bg-primary-50"
      items={items}
      loading={loading}
      error={error}
      showAdd={showAdd}
      setShowAdd={setShowAdd}
      form={form}
      setForm={setForm}
      saving={saving}
      onAdd={handleAdd}
      deleteConfirm={deleteConfirm}
      setDeleteConfirm={setDeleteConfirm}
      actionLoading={actionLoading}
      onDelete={handleDelete}
    />
  );
}

/* ============ IP Blacklist ============ */
function IpBlacklistSection() {
  const [items, setItems] = useState<IpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ip: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/security/ip-blacklist');
      setItems(data.blacklist || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async () => {
    if (!form.ip.trim()) return;
    setSaving(true);
    try {
      await adminClient.post('/super-admin/security/ip-blacklist', form);
      setShowAdd(false);
      setForm({ ip: '', description: '' });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الإضافة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/security/ip-blacklist/${id}`);
      setDeleteConfirm(null);
      fetch();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <IpSection
      title="قائمة IP السوداء"
      icon={ShieldOff}
      iconColor="text-red-400 bg-red-500/10"
      items={items}
      loading={loading}
      error={error}
      showAdd={showAdd}
      setShowAdd={setShowAdd}
      form={form}
      setForm={setForm}
      saving={saving}
      onAdd={handleAdd}
      deleteConfirm={deleteConfirm}
      setDeleteConfirm={setDeleteConfirm}
      actionLoading={actionLoading}
      onDelete={handleDelete}
    />
  );
}

/* ============ Shared IP Section ============ */
function IpSection({ title, icon: Icon, iconColor, items, loading, error, showAdd, setShowAdd, form, setForm, saving, onAdd, deleteConfirm, setDeleteConfirm, actionLoading, onDelete }: {
  title: string;
  icon: any;
  iconColor: string;
  items: IpEntry[];
  loading: boolean;
  error: string;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  form: { ip: string; description: string };
  setForm: (v: { ip: string; description: string }) => void;
  saving: boolean;
  onAdd: () => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (v: string | null) => void;
  actionLoading: string | null;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span className={`rounded-lg p-1.5 ${iconColor}`}>
            <Icon size={16} />
          </span>
          {title}
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
        >
          <Plus size={14} />
          إضافة IP
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-gray-500 text-sm">
          لا توجد عناصر
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-right text-gray-400 font-medium">IP</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">الوصف</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">أضيف بواسطة</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">التاريخ</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-3 py-2 text-gray-900 font-mono text-xs">{item.ip}</td>
                  <td className="px-3 py-2 text-gray-400">{item.description || '—'}</td>
                  <td className="px-3 py-2 text-gray-400">{item.createdBy || '—'}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      disabled={actionLoading === item.id}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">إضافة IP</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">عنوان IP</label>
                <input type="text" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
                  placeholder="192.168.1.1" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
                  placeholder="وصف" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onAdd} disabled={saving || !form.ip.trim()}
                className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
                {saving ? 'جاري...' : 'إضافة'}
              </button>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-400 mb-6">هل أنت متأكد من حذف هذا الـ IP؟</p>
            <div className="flex gap-3">
              <button onClick={() => onDelete(deleteConfirm)} disabled={actionLoading === deleteConfirm}
                className="flex-1 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 disabled:opacity-50">
                {actionLoading === deleteConfirm ? 'جاري...' : 'تأكيد الحذف'}
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ User Devices ============ */
function UserDevicesSection() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/security/devices');
      setDevices(data.devices || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRevoke = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.post(`/super-admin/security/devices/${id}/revoke`);
      fetch();
    } catch {
      setError('فشل إلغاء الجهاز');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <span className="rounded-lg p-1.5 bg-indigo-500/10 text-indigo-400">
          <Smartphone size={16} />
        </span>
        أجهزة المستخدمين
      </h2>

      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : devices.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-gray-500 text-sm">
          لا توجد أجهزة
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-right text-gray-400 font-medium">الجهاز</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">المتصفح</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">نظام التشغيل</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">IP</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">آخر نشاط</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">المستخدم</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-3 py-2 text-gray-900 text-xs">{d.deviceName || '—'}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{d.browser || '—'}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{d.os || '—'}</td>
                  <td className="px-3 py-2 text-gray-500 font-mono text-xs">{d.ip}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{new Date(d.lastActive).toLocaleDateString('ar-EG')}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{d.user ? `${d.user.firstName} ${d.user.lastName}` : '—'}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleRevoke(d.id)}
                      disabled={actionLoading === d.id}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                      title="إلغاء"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============ Active Sessions ============ */
function ActiveSessionsSection() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/security/sessions');
      setSessions(data.sessions || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleTerminate = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.post(`/super-admin/security/sessions/${id}/terminate`);
      fetch();
    } catch {
      setError('فشل إنهاء الجلسة');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <span className="rounded-lg p-1.5 bg-orange-500/10 text-orange-400">
          <Activity size={16} />
        </span>
        الجلسات النشطة
      </h2>

      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-gray-500 text-sm">
          لا توجد جلسات نشطة
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-right text-gray-400 font-medium">المشرف</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">IP</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">الجهاز</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">المتصفح</th>
                <th className="px-3 py-2 text-right text-gray-400 font-medium">آخر نشاط</th>
                <th className="px-3 py-2 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-3 py-2 text-gray-900 text-xs">{s.admin?.email || s.adminEmail || '—'}</td>
                  <td className="px-3 py-2 text-gray-500 font-mono text-xs">{s.ip}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{s.device || '—'}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{s.browser || '—'}</td>
                  <td className="px-3 py-2 text-gray-400 text-xs">{s.lastActivity ? new Date(s.lastActivity).toLocaleDateString('ar-EG') : '—'}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleTerminate(s.id)}
                      disabled={actionLoading === s.id}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                      title="إنهاء"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
