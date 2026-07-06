'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DollarSign, Calendar, FileText, Send, AlertCircle } from 'lucide-react';

export default function NewProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const [form, setForm] = useState({ coverLetter: '', bidAmount: '', durationDays: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) { setError('معرف المشروع غير موجود'); return; }
    if (!form.coverLetter || !form.bidAmount || !form.durationDays) { setError('يرجى ملء جميع الحقول'); return; }
    setError('');
    setLoading(true);
    try {
      const { proposalsApi } = await import('@/lib/api/endpoints');
      await proposalsApi.create(projectId, { coverLetter: form.coverLetter, bidAmount: Number(form.bidAmount), durationDays: Number(form.durationDays) });
      router.push('/proposals');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.response?.data?.message || 'فشل إرسال العرض');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/projects" className="mb-4 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">← العودة للمشاريع</Link>

        <div className="rounded border border-gray-200 bg-white p-5">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
              <FileText size={20} className="text-primary-600" />
            </div>
            <h1 className="text-base font-semibold text-gray-900">تقديم عرض</h1>
            <p className="text-xs text-gray-400">قدم عرضك للمشروع واحصل على فرصة العمل</p>
          </div>

          {error && (
            <div className="mb-3 flex items-center gap-1.5 rounded border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                <FileText size={13} className="text-primary-500" />
                رسالة التقديم
              </label>
              <textarea value={form.coverLetter} onChange={(e) => setForm((p) => ({ ...p, coverLetter: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                rows={5} placeholder="اكتب رسالة توضح فيها خبرتك ولماذا أنت المرشح المناسب..." required />
              <p className="mt-0.5 text-[11px] text-gray-400">اشرح خبرتك وكيف يمكنك تنفيذ المشروع بنجاح</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <DollarSign size={13} className="text-primary-500" />
                  المبلغ المطلوب
                </label>
                <div className="relative">
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                  <input type="number" value={form.bidAmount} onChange={(e) => setForm((p) => ({ ...p, bidAmount: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-1.5 pr-6 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" placeholder="0" min="1" required />
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Calendar size={13} className="text-primary-500" />
                  مدة التنفيذ
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">يوم</span>
                  <input type="number" value={form.durationDays} onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))}
                    className="w-full rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" placeholder="0" min="1" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50">
              <Send size={13} />
              {loading ? 'جاري الإرسال...' : 'إرسال العرض'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
