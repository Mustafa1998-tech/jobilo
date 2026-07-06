'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch {
      setError('فشل إرسال الرابط. حاول مرة أخرى.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-bold text-gray-900">Jobilo</Link>
          <p className="mt-0.5 text-sm text-gray-400">استعادة كلمة المرور</p>
        </div>

        {sent ? (
          <div className="rounded border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <h2 className="mb-1 text-sm font-semibold text-gray-900">تم إرسال الرابط</h2>
            <p className="mb-4 text-xs text-gray-500">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
              <ArrowRight size={12} />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded border border-gray-200 bg-white p-5">
            {error && <div className="mb-3 rounded bg-red-50 p-2.5 text-xs text-red-600">{error}</div>}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-gray-200 py-1.5 pr-8 text-xs focus:border-primary-500 focus:outline-none" placeholder="user@example.com" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded bg-primary-600 py-1.5 text-xs font-medium text-white transition hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>
            <div className="mt-3 text-center text-xs text-gray-400">
              <Link href="/login" className="text-primary-600 hover:underline">العودة إلى تسجيل الدخول</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
