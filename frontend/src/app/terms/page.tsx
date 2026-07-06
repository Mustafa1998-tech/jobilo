import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-1">شروط الاستخدام</h1>
        <p className="text-sm text-gray-500 mb-6">آخر تحديث: 30 يونيو 2026</p>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>مرحبا بك في Jobilo. باستخدامك للمنصة، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية.</p>
          <h2 className="font-semibold text-gray-900">1. قبول الشروط</h2>
          <p>باستخدامك لمنصة Jobilo، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام المنصة.</p>
          <h2 className="font-semibold text-gray-900">2. الحسابات</h2>
          <p>يجب عليك إنشاء حساب لاستخدام خدماتنا. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب أن تكون المعلومات التي تقدمها دقيقة وكاملة.</p>
          <h2 className="font-semibold text-gray-900">3. المسؤوليات</h2>
          <p>Jobilo هي منصة وسيطة فقط. العقود والاتفاقيات تتم بين المستقلين والعملاء مباشرة. المنصة غير مسؤولة عن جودة العمل المقدم أو عدم تنفيذه.</p>
          <h2 className="font-semibold text-gray-900">4. الدفع</h2>
          <p>يتم الاتفاق على شروط الدفع مباشرة بين المستقل والعميل. المنصة لا تستقبل أو تحتفظ بالأموال ولا تتحمل أي مسؤولية متعلقة بالمدفوعات بين الطرفين.</p>
          <h2 className="font-semibold text-gray-900">5. إلغاء الحساب</h2>
          <p>لنا الحق في تعليق أو إلغاء أي حساب يخالف هذه الشروط أو القوانين المعمول بها.</p>
          <h2 className="font-semibold text-gray-900">6. تعديل الشروط</h2>
          <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بالتغييرات الجوهرية.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
