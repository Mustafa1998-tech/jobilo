'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

const posts = [
  { title: 'كيف تبدأ مشوارك كمستقل في العالم العربي؟', excerpt: 'دليل شامل للمبتدئين في العمل الحر: من إنشاء الملف الشخصي إلى أول مشروع.', author: 'أحمد السعيد', date: '2026-06-28', slug: 'start-freelancing' },
  { title: 'نصائح لكتابة عرض احترافي يفوز بالمشاريع', excerpt: 'أفضل الممارسات لكتابة عروض تميزك عن المنافسين وتزيد فرص قبولك.', author: 'نورة العمري', date: '2026-06-25', slug: 'proposal-tips' },
  { title: 'كيف تدير مشاريعك عن بعد بفاعلية؟', excerpt: 'أدوات وتقنيات لإدارة المشاريع عن بعد وضمان التسليم في الوقت المحدد.', author: 'خالد الحربي', date: '2026-06-22', slug: 'remote-project-management' },
  { title: 'أهم مهارات المستقبل: ما الذي يبحث عنه العملاء؟', excerpt: 'تحليل لأكثر المهارات طلبا في سوق العمل الحر وكيفية تطويرها.', author: 'سارة القحطاني', date: '2026-06-20', slug: 'future-skills' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">المدونة</h1>
          <p className="mt-1 text-sm text-gray-500">أحدث المقالات والنصائح حول العمل الحر</p>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-md border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
              <h2 className="mb-1.5 text-sm font-semibold text-gray-900">{post.title}</h2>
              <p className="mb-3 text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
