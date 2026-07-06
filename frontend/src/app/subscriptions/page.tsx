'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Check, Star, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'مجاني',
    icon: Star,
    desc: 'للمبتدئين في العمل الحر',
    features: ['3 عروض شهريا', 'ملف شخصي أساسي', 'دعم عبر البريد الإلكتروني', 'إشعارات المشاريع'],
    cta: 'ابدأ مجانا',
    popular: false,
  },
  {
    name: 'احترافي',
    icon: Zap,
    desc: 'للمستقلين النشطين',
    features: ['15 عرض شهريا', 'شارة موثوق', 'ظهور أولوية في البحث', 'إحصائيات متقدمة', 'دعم فني 24/7', 'إشعارات فورية'],
    cta: 'ترقية الآن',
    popular: true,
  },
  {
    name: 'أعمال',
    icon: Building2,
    desc: 'للشركات والمحترفين',
    features: ['عروض غير محدودة', 'شارة VIP', 'أولوية قصوى في البحث', 'جميع الإحصائيات', 'دعم مخصص', 'مدير حسابات', 'API مخصص', 'تقارير متقدمة'],
    cta: 'تواصل معنا',
    popular: false,
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">الباقات والاشتراكات</h1>
          <p className="mt-1 text-sm text-gray-500">اختر الباقة المناسبة لمستوى نشاطك على المنصة</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={`relative rounded-md border p-5 ${plan.popular ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 bg-white'}`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-[10px] font-medium text-white">
                    الأكثر طلبا
                  </span>
                )}
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${plan.popular ? 'bg-primary-600' : 'bg-gray-100'}`}>
                  <Icon size={18} className={plan.popular ? 'text-white' : 'text-gray-600'} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{plan.name}</h3>
                <p className="mb-3 text-xs text-gray-500">{plan.desc}</p>
                <ul className="mb-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check size={13} className="text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'مجاني' ? '/register' : '/settings?tab=subscription'}
                  className={`block rounded-md px-4 py-2 text-center text-xs font-medium transition ${
                    plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 px-5 py-3">
          <p className="text-xs text-gray-500">المنصة لا تستقبل أو تحتفظ بالأموال. الدفع يتم بالاتفاق المباشر بين العميل والمستقل خارج المنصة.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
