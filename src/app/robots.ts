import type { MetadataRoute } from 'next'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://msavchuk.com'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${siteURL}/api/sitemap.xml`,
    }
}
