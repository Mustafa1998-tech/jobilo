import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-1">سياسة الخصوصية</h1>
        <p className="text-sm text-gray-500 mb-6">آخر تحديث: 30 يونيو 2026</p>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>نحن في Jobilo نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
          <h2 className="font-semibold text-gray-900">المعلومات التي نجمعها</h2>
          <p>عند إنشاء حساب، نجمع: الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الدفع. قد نجمع أيضا معلومات إضافية مثل المهارات والشهادات إذا اخترت مشاركتها.</p>
          <h2 className="font-semibold text-gray-900">كيف نستخدم معلوماتك</h2>
          <p>نستخدم معلوماتك لتقديم الخدمات، تحسين المنصة، التواصل معك، ومعالجة المدفوعات. لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك.</p>
          <h2 className="font-semibold text-gray-900">حماية البيانات</h2>
          <p>نستخدم إجراءات أمنية لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح.</p>
          <h2 className="font-semibold text-gray-900">حقوقك</h2>
          <p>لديك الحق في الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت من خلال إعدادات حسابك.</p>
          <h2 className="font-semibold text-gray-900">الكوكيز</h2>
          <p>نستخدم الكوكيز لتحسين تجربتك على المنصة. يمكنك التحكم في إعدادات الكوكيز من متصفحك.</p>
          <h2 className="font-semibold text-gray-900">التواصل</h2>
          <p>للاستفسارات حول سياسة الخصوصية، يرجى التواصل على: privacy@jobilo.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
