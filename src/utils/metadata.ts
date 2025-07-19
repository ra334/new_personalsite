import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Params = Promise<{ locale: string }>

export default function createGenerateMetadata(page: string) {
    return async function generateMetadata({
        params,
    }: {
        params: Params
    }): Promise<Metadata> {
        const { locale } = await params
        const t = await getTranslations({ locale, namespace: page })

        const title = t('metadata.title')

        return {
            title,
            description: t('metadata.description'),
            keywords: t('metadata.keywords'),
            alternates: {
                canonical: `https://msavchuk.com/${locale}`,
                languages: {
                    en: '/en',
                    uk: '/uk',
                },
            },
            openGraph: {
                title,
                description: t('metadata.description'),
                url: `https://msavchuk.com/${locale}`,
                siteName: 'Personal site of Mykhailo Savchuk',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: t('metadata.description'),
                site: '@msavchuk_dev',
                creator: '@msavchuk_dev',
            },
        }
    }
}
