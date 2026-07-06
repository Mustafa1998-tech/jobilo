import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-main',
});

export const metadata: Metadata = {
  title: 'Jobilo - منصة العمل الحر',
  description: 'منصة تجمع بين المستقلين المتميزين وأصحاب المشاريع',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
