'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Briefcase, UserCheck, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FREELANCER',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (!form.agreeToTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      const { user } = useAuthStore.getState();
      if (user?.role === 'CLIENT') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/freelancer');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Jobilo
          </Link>
          <p className="mt-0.5 text-sm text-gray-400">أنشئ حسابك وابدأ العمل الحر اليوم</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-gray-200 bg-white p-6">
          {error && (
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-600">أنا أريد</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'FREELANCER', label: 'تقديم خدمات', desc: 'أعمل كمستقل', icon: UserCheck },
                { value: 'CLIENT', label: 'طلب خدمات', desc: 'أبحث عن مستقلين', icon: Briefcase },
              ].map((option) => {
                const Icon = option.icon;
                const isActive = form.role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('role', option.value)}
                    className={`relative rounded border-2 p-3 text-right transition-all ${
                      isActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                    <Icon size={20} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                    <p className={`mt-1.5 text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400">{option.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">الاسم الأول</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="محمد"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">الاسم الأخير</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="أحمد"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-600">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-600">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 pl-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-400">يجب أن تتكون من 8 أحرف على الأقل</p>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-600">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <label className="mb-4 flex cursor-pointer items-start gap-1.5 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={form.agreeToTerms}
              onChange={(e) => updateField('agreeToTerms', e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              أوافق على{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">شروط الاستخدام</Link>
              {' '}و{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">سياسة الخصوصية</Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
          </button>

          <div className="mt-4 text-center text-xs text-gray-400">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
