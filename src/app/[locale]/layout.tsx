import '../globals.css'
import { routing } from '@src/i18n/routing'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { IBM_Plex_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['cyrillic', 'latin'],
    weight: ['400', '500', '600'],
})

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    return (
        <html lang={locale} className={ibmPlexMono.className}>
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-4CZRQ8HQDE"
            ></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-4CZRQ8HQDE');
            `,
                }}
            />

            <body>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </body>
        </html>
    )
}
