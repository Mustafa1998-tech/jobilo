'use client';

import Link from 'next/link';
import { Briefcase, Users, Award, TrendingUp, MessageSquare, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 leading-tight tracking-tight">
            منصة العمل الحر
            <br />
            <span className="text-primary-600">الأولى في العالم العربي</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-gray-500 leading-relaxed">
            منصة تجمع بين المستقلين المتميزين وأصحاب المشاريع. وفر وقتك وجهدك
            واعثر على الكفاءة المناسبة لمشروعك بكل ثقة وأمان.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm">
              ابدأ مجانا
            </Link>
            <Link href="/projects" className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              استعرض المشاريع
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-12">
            {[
              { value: '5,000+', label: 'مشروع منجز' },
              { value: '2,000+', label: 'مستقل معتمد' },
              { value: '98%', label: 'نسبة رضا العملاء' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900">لماذا Jobilo؟</h2>
            <p className="mt-2 text-sm text-gray-500">مميزات تجعل منصتنا الخيار الأمثل لمشاريعك</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Award, title: 'جودة وكفاءة', desc: 'مستقلون معتمدون تم فحص مهاراتهم لضمان أعلى مستوى من الجودة في تنفيذ مشاريعك.' },
              { icon: TrendingUp, title: 'نمو وتطور', desc: 'تابع نمو أعمالك مع تقارير وإحصائيات دقيقة تساعدك على اتخاذ قرارات أفضل.' },
              { icon: MessageSquare, title: 'تواصل مباشر', desc: 'نظام محادثة متكامل يتيح لك التواصل المباشر مع المستقلين ومتابعة التقدم.' },
              { icon: DollarSign, title: 'دفعات آمنة', desc: 'نظام Escrow يضمن حقوق الطرفين، حيث تُحفظ المدفوعات لحين اكتمال العمل.' },
              { icon: Briefcase, title: 'مشاريع متنوعة', desc: 'تصفح آلاف المشاريع في مختلف المجالات: برمجة، تصميم، تسويق، كتابة وغيرها.' },
              { icon: Users, title: 'مجتمع نشط', desc: 'انضم إلى مجتمع يضم آلاف المستقلين والعملاء من جميع أنحاء العالم العربي.' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-md border border-gray-200 bg-white p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">مستعد لبدء رحلتك؟</h2>
          <p className="mb-8 text-sm text-gray-500">انضم إلى آلاف المستقلين والعملاء وابدأ مشوارك المهني اليوم</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm">
              إنشاء حساب مجاني
            </Link>
            <Link href="/about" className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              اعرف المزيد
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
