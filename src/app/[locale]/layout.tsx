import {NextIntlClientProvider, hasLocale} from 'next-intl'
import {routing} from '@/i18n/routing'
import {notFound} from 'next/navigation';
import { IBM_Plex_Mono } from 'next/font/google'
import "@/app/globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600']
})

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {

  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={ibmPlexMono.className}>
      <body
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
