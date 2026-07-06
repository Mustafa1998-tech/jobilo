'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const faqs = [
  { q: 'ما هي منصة Jobilo؟', a: 'Jobilo هي منصة عمل حر تربط بين المستقلين المتميزين وأصحاب المشاريع في العالم العربي.' },
  { q: 'كيف يمكنني إنشاء حساب؟', a: 'يمكنك إنشاء حساب مجاني بالضغط على زر "حساب جديد" واختيار نوع الحساب (عميل أو مستقل).' },
  { q: 'هل هناك رسوم على إنشاء الحساب؟', a: 'إنشاء الحساب مجاني بالكامل.' },
  { q: 'كيف يتم ضمان حقوقي؟', a: 'نظام المراجعة والتقييم يضمن الشفافية. يمكن فتح نزاع في حال وجود خلاف بين الطرفين.' },
  { q: 'كيف أحصل على مشاريع كمستقل؟', a: 'تصفح المشاريع المتاحة وقدم عروضك مع شرح خبراتك. كلما كان ملفك احترافيا، زادت فرصك.' },
  { q: 'كيف يتم الاتفاق على الدفع؟', a: 'يتفق العميل والمستقل على تفاصيل الدفع مباشرة. المنصة لا تستقبل أو تحتفظ بالأموال.' },
  { q: 'هل المنصة مسؤولة عن المدفوعات؟', a: 'لا، المنصة وسيط للتواصل والتوفيق فقط. الدفع يتم بالاتفاق المباشر بين الطرفين خارج المنصة.' },
  { q: 'ما هو نظام التوثيق؟', a: 'توثيق الحساب يزيد من فرصك في الحصول على مشاريع. يتم التحقق من الهوية والمؤهلات.' },
  { q: 'كيف أضيف مهارة غير موجودة؟', a: 'أثناء إضافة المهارات، اكتب اسم المهارة. إذا لم تظهر، سيظهر زر "إضافة مهارة جديدة".' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const filtered = faqs.filter((f) => f.q.includes(search) || f.a.includes(search));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">الأسئلة الشائعة</h1>
          <p className="mt-1 text-sm text-gray-500">إجابات لأكثر الأسئلة تكرارا حول منصة Jobilo</p>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث في الأسئلة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 py-2 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div key={i} className="rounded-md border border-gray-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500 leading-relaxed">{faq.a}</div>}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">لا توجد نتائج للبحث</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
