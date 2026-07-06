'use client';

import Link from 'next/link';

const values = [
  { title: 'الشفافية', desc: 'نؤمن بالوضوح في كل تعاملاتنا بين العملاء والمستقلين' },
  { title: 'الجودة', desc: 'نسعى لتقديم أعلى معايير الجودة في جميع المشاريع' },
  { title: 'الثقة', desc: 'نبني جسور من الثقة من خلال التقييمات والمراجعات الموثوقة' },
  { title: 'الابتكار', desc: 'نواكب أحدث التقنيات لتوفير أفضل تجربة مستخدم' },
];

const team = [
  { name: 'أحمد الخالد', role: 'المؤسس والرئيس التنفيذي' },
  { name: 'سارة العنزي', role: 'مديرة العمليات' },
  { name: 'عمر السعيد', role: 'مدير التطوير التقني' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-primary-600">Jobilo</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
            <Link href="/projects" className="hover:text-primary-600">المشاريع</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">عن Jobilo</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Jobilo هي منصة رقمية تربط بين أصحاب المشاريع والمستقلين الموهوبين في العالم العربي.
            نوفر بيئة آمنة وسهلة للتعاون الحر، حيث يمكن للجميع إيجاد الفرص المناسبة وتنفيذ المشاريع بإتقان.
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">رسالتنا</h2>
            <p className="leading-relaxed text-gray-600">
              تمكين المواهب العربية وتوفير فرص عمل مرنة تناسب مهاراتهم، مع ضمان تجربة موثوقة
              ومربحة لكل من العملاء والمستقلين.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">رؤيتنا</h2>
            <p className="leading-relaxed text-gray-600">
              أن نكون المنصة الأولى للعمل الحر في الوطن العربي، ونصنع مستقبل العمل الرقمي
              بمعايير عالمية تلبي طموحات مجتمعنا.
            </p>
          </div>
        </div>

        {/* Values */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">قيمنا</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border bg-white p-6 text-center">
                <h3 className="mb-2 font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="text-center">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">فريقنا</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="rounded-xl border bg-white p-6">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
