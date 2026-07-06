'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const posts: Record<string, { title: string; author: string; date: string; content: string }> = {
  'start-freelancing': {
    title: 'كيف تبدأ مشوارك كمستقل في العالم العربي؟',
    author: 'أحمد السعيد', date: '2026-06-28',
    content: 'العمل الحر أصبح خيارا مفضلا للكثيرين في العالم العربي. في هذا الدليل الشامل، سنشرح لك الخطوات الأساسية لبدء مشوارك كمستقل على منصة Jobilo.\n\nأولا: إنشاء ملف شخصي احترافي. الملف الشخصي هو بطاقة التعريف الخاصة بك. تأكد من إضافة صورة احترافية، وكتابة نبذة مختصرة عن خبراتك ومهاراتك، وتحديد مجالك بدقة.\n\nثانيا: إضافة معرض أعمالك. العملاء يريدون رؤية نماذج من أعمالك السابقة. أضف أفضل مشاريعك مع شرح دورك فيها والتقنيات التي استخدمتها.\n\nثالثا: البحث عن المشاريع المناسبة. استخدم محرك البحث المتقدم لتصفية المشاريع حسب المجال، الميزانية، والمهارات المطلوبة. قدم عروضا مخصصة لكل مشروع توضح فيها فهمك للمتطلبات وخطتك للتنفيذ.\n\nرابعا: بناء سمعة قوية. الالتزام بالمواعيد، التواصل الفعال، وجودة العمل هي مفاتيح بناء سمعة ممتازة تحصل من خلالها على مشاريع أكثر وتقييمات أفضل.',
  },
  'proposal-tips': {
    title: 'نصائح لكتابة عرض احترافي يفوز بالمشاريع',
    author: 'نورة العمري', date: '2026-06-25',
    content: 'العرض الجيد هو بوابتك للحصول على المشاريع. إليك أهم النصائح لكتابة عروض احترافية:\n\n1. اقرأ وصف المشروع بعناية: قبل كتابة عرضك، تأكد من فهمك الكامل لمتطلبات المشروع. أظهر لصاحب المشروع أنك قرأت الإعلان بعناية.\n\n2. خصص عرضك: لا ترسل عرضا عاما. اذكر كيف ستنفذ هذا المشروع بالتحديد، وما هي الخطوات التي ستتبعها.\n\n3. اذكر خبراتك السابقة: أضف روابط لأعمال مشابهة قمت بها سابقا. هذا يزيد من مصداقيتك.\n\n4. كن واضحا في التسعير: حدد ميزانيتك بوضوح مع شرح ما يشمله السعر. تجنب الغموض في الأمور المالية.\n\n5. حدد الجدول الزمني: اذكر المدة التي ستستغرقها لتنفيذ المشروع مع جدول زمني تقريبي للمراحل.\n\n6. راجع عرضك قبل الإرسال: تأكد من خلوه من الأخطاء الإملائية والنحوية.',
  },
  'remote-project-management': {
    title: 'كيف تدير مشاريعك عن بعد بفاعلية؟',
    author: 'خالد الحربي', date: '2026-06-22',
    content: 'إدارة المشاريع عن بعد تتطلب أدوات وتقنيات مختلفة عن إدارة المشاريع التقليدية. إليك أفضل الممارسات:\n\nاستخدم أدوات إدارة المشاريع مثل Trello أو Asana أو Monday.com لمتابعة المهام والمواعيد النهائية.\n\nالتواصل الدوري مع الفريق عبر منصات مثل Slack أو Microsoft Teams يضمن سير العمل بسلاسة.\n\nقسم المشروع إلى مراحل (Milestones) مع مواعيد تسليم محددة لكل مرحلة. هذا يسهل متابعة التقدم.\n\nاستخدم أنظمة التحكم بالإصدارات مثل Git لتتبع التغييرات في الكود.\n\nحدد أوقاتا للاجتماعات الدورية لمراجعة التقدم وحل المشكلات.',
  },
  'future-skills': {
    title: 'أهم مهارات المستقبل: ما الذي يبحث عنه العملاء؟',
    author: 'سارة القحطاني', date: '2026-06-20',
    content: 'سوق العمل الحر يتطور باستمرار. المهارات الأكثر طلبا في 2026 تشمل:\n\nالبرمجة والتطوير: React، Next.js، Node.js، Python، الذكاء الاصطناعي وتعلم الآلة.\n\nالتصميم: UI/UX Design، Figma، تصميم المواقع المتجاوبة.\n\nالتسويق الرقمي: SEO، إعلانات Google وFacebook، تحليلات البيانات.\n\nكتابة المحتوى: كتابة المحتوى التسويقي، الترجمة، التدقيق اللغوي.\n\nتطوير التطبيقات: Flutter، React Native، Swift.\n\nالاستثمار في تطوير هذه المهارات يضمن لك فرصا أفضل في سوق العمل الحر.',
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">المقال غير موجود</h1>
          <Link href="/blog" className="text-sm text-primary-600 hover:underline">العودة إلى المدونة</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6">
          <ArrowRight size={12} />
          العودة إلى المدونة
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
          <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
          <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
        </div>
        <div className="text-sm text-gray-600 leading-8 whitespace-pre-line">
          {post.content}
        </div>
      </article>
      <Footer />
    </div>
  );
}
