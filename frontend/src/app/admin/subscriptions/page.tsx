'use client';

import { useEffect, useState } from 'react';
import { Search, Package, Plus, ToggleLeft, Trash2, Edit3, X, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

interface Plan {
  id: string;
  name: string;
  features: string[];
  active: boolean;
}

interface Subscription {
  id: string;
  user?: { firstName: string; lastName: string };
  plan?: { name: string };
  status: string;
  startDate: string;
  endDate: string;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-primary-50 text-primary-600 border-primary-200',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
    EXPIRED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [subPage, setSubPage] = useState(1);
  const [subTotalPages, setSubTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', features: '', active: true });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, subsRes] = await Promise.all([
        adminClient.get('/super-admin/subscriptions/plans'),
        adminClient.get('/super-admin/subscriptions', { params: { page: subPage, limit: 20 } }),
      ]);
      const plansData = plansRes.data?.plans || plansRes.data;
      const subsData = subsRes.data?.subscriptions || subsRes.data;
      setPlans(Array.isArray(plansData) ? plansData : []);
      setSubscriptions(Array.isArray(subsData) ? subsData : []);
      setSubTotal(subsRes.data?.total || 0);
      setSubTotalPages(subsRes.data?.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل بيانات الاشتراكات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [subPage]);

  const handleTogglePlan = async (planId: string) => {
    setActionLoading(planId);
    try {
      await adminClient.post(`/super-admin/subscriptions/plans/${planId}/toggle`);
      fetchData();
    } catch {
      setError('فشل تحديث الخطة');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخطة؟')) return;
    setActionLoading(planId);
    try {
      await adminClient.delete(`/super-admin/subscriptions/plans/${planId}`);
      fetchData();
    } catch {
      setError('فشل حذف الخطة');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePlan = async () => {
    if (!planForm.name) return;
    setActionLoading('save');
    try {
      const data = {
        name: planForm.name,
        features: planForm.features.split('\n').filter(Boolean),
        active: planForm.active,
      };
      if (editPlan) {
        await adminClient.post(`/super-admin/subscriptions/plans/${editPlan.id}`, data);
      } else {
        await adminClient.post('/super-admin/subscriptions/plans', data);
      }
      setShowAddPlan(false);
      setEditPlan(null);
      setPlanForm({ name: '', features: '', active: true });
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل حفظ الخطة');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditPlan = (plan: Plan) => {
    setEditPlan(plan);
    setPlanForm({
      name: plan.name,
      features: plan.features.join('\n'),
      active: plan.active,
    });
    setShowAddPlan(true);
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الباقات والاشتراكات</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package size={18} className="text-primary-600" />
            خطط الاشتراك
          </h2>
          <button
            onClick={() => {
              setEditPlan(null);
              setPlanForm({ name: '', features: '', active: true });
              setShowAddPlan(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30"
          >
            <Plus size={15} /> إضافة خطة
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-full">لا توجد خطط</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900 font-semibold">{plan.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditPlan(plan)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-400"
                      title="تعديل"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleTogglePlan(plan.id)}
                      disabled={actionLoading === plan.id}
                      className={`rounded-lg p-1.5 ${plan.active ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-500 hover:bg-gray-50'} disabled:opacity-50`}
                      title={plan.active ? 'تعطيل' : 'تفعيل'}
                    >
                      <ToggleLeft size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={actionLoading === plan.id}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400 disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  plan.active
                    ? 'bg-primary-50 text-primary-600 border-primary-200'
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  {plan.active ? 'نشط' : 'غير نشط'}
                </span>
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <Check size={12} className="text-primary-600 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      {showAddPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddPlan(false)}>
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editPlan ? 'تعديل الخطة' : 'إضافة خطة جديدة'}</h2>
              <button onClick={() => setShowAddPlan(false)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">اسم الخطة</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">الميزات (سطر لكل ميزة)</label>
                <textarea
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
                  rows={4}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={planForm.active}
                  onChange={(e) => setPlanForm({ ...planForm, active: e.target.checked })}
                  className="rounded border-gray-200 bg-white text-primary-600 focus:ring-primary-500"
                />
                نشطة
              </label>
              <button
                onClick={handleSavePlan}
                disabled={actionLoading === 'save'}
                className="w-full rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
              >
                {actionLoading === 'save' ? 'جاري الحفظ...' : editPlan ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الاشتراكات النشطة</h2>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد اشتراكات</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="px-4 py-3 text-right text-gray-400 font-medium">المستخدم</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium">الخطة</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ البداية</th>
                  <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ النهاية</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-200/50 hover:bg-white/50">
                    <td className="px-4 py-3 text-gray-900">
                      {sub.user ? `${sub.user.firstName} ${sub.user.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{sub.plan?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(sub.startDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(sub.endDate).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subTotalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setSubPage((p) => Math.max(1, p - 1))}
              disabled={subPage === 1}
              className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: subTotalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setSubPage(p)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  subPage === p
                    ? 'bg-primary-50 text-primary-600 border border-primary-200'
                    : 'border border-gray-200 text-gray-400 hover:bg-white'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setSubPage((p) => Math.min(subTotalPages, p + 1))}
              disabled={subPage === subTotalPages}
              className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
