'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HelpCircle, FileText, MessageSquare, Shield, BookOpen, Mail } from 'lucide-react';
import Link from 'next/link';

const helpArticles = [
  { icon: FileText, title: 'بدء الاستخدام', desc: 'كل ما تحتاج معرفته للبدء على منصة Jobilo', href: '/faq' },
  { icon: HelpCircle, title: 'حسابي', desc: 'إدارة حسابك، الملف الشخصي، والإعدادات', href: '/faq' },
  { icon: MessageSquare, title: 'المشاريع والعروض', desc: 'كيف تنشر مشروعا أو تقدم عرضا', href: '/faq' },
  { icon: Shield, title: 'الحقوق والنزاعات', desc: 'كيف نحمي حقوقك وكيفية فتح نزاع', href: '/faq' },
  { icon: BookOpen, title: 'الاشتراكات والباقات', desc: 'الباقات المتاحة والمميزات', href: '/faq' },
  { icon: Mail, title: 'تواصل مع الدعم', desc: 'لم تتمكن من العثور على إجابة؟ تواصل معنا', href: '/contact' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-xl font-bold text-gray-900">مركز المساعدة</h1>
          <p className="mt-1 text-sm text-gray-500">كيف يمكننا مساعدتك؟</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {helpArticles.map((article) => {
            const Icon = article.icon;
            return (
              <Link key={article.title} href={article.href} className="rounded-md border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary-50">
                  <Icon size={16} className="text-primary-600" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">{article.title}</h3>
                <p className="text-xs text-gray-500">{article.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
