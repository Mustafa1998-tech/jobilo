import Link from 'next/link';

const footerSections = [
  {
    title: 'المنصة',
    links: [
      { href: '/about', label: 'عن المنصة' },
      { href: '/categories', label: 'التصنيفات' },
      { href: '/companies', label: 'الشركات' },
      { href: '/projects', label: 'المشاريع' },
      { href: '/freelancers', label: 'المستقلون' },
    ],
  },
  {
    title: 'الدعم',
    links: [
      { href: '/help', label: 'مركز المساعدة' },
      { href: '/faq', label: 'الأسئلة الشائعة' },
      { href: '/contact', label: 'تواصل معنا' },
      { href: '/blog', label: 'المدونة' },
    ],
  },
  {
    title: 'القانونية',
    links: [
      { href: '/terms', label: 'شروط الاستخدام' },
      { href: '/privacy', label: 'سياسة الخصوصية' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-sm font-bold text-gray-900">Jobilo</h4>
            <p className="text-sm leading-relaxed text-gray-500">
              منصة العمل الحر الأولى في العالم العربي. نربط بين المستقلين المتميزين وأصحاب المشاريع بكل ثقة وأمان.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="mb-3 text-sm font-semibold text-gray-900">{section.title}</h5>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          جميع الحقوق محفوظة. Jobilo 2026
        </div>
      </div>
    </footer>
  );
}
