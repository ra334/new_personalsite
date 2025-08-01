import { getGroups } from '@/db/models/article-groups'
import { findByGroupId } from '@/db/models/articles'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface SitemapPage {
    url: string
    lastModified: Date
    enUrl: string
    ukUrl: string
    priority?: number
}

function generateSitemap(pages: SitemapPage[], articlePages?: SitemapPage[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml"
            >
                ${
                    !pages.length
                        ? ''
                        : pages
                              .map((page) => {
                                  return `
                    <url>
                        <loc>${page.url}</loc>
                        <lastmod>${page.lastModified.toISOString()}</lastmod>
                        <changefreq>yearly</changefreq>
                        <priority>${page.priority ?? 0.5}</priority>
                        <xhtml:link rel="alternate" hreflang="en" href="${page.enUrl}" />
                        <xhtml:link rel="alternate" hreflang="uk" href="${page.ukUrl}" />
                    </url>`
                              })
                              .join('\n')
                }
                ${
                    !articlePages
                        ? ''
                        : articlePages
                              .map((page) => {
                                  return `
                    <url>
                        <loc>${page.url}</loc>
                        <lastmod>${page.lastModified.toISOString()}</lastmod>
                        <changefreq>weekly</changefreq>
                        <priority>${page.priority ?? 0.5}</priority>
                        <xhtml:link rel="alternate" hreflang="en" href="${page.enUrl}" />
                        <xhtml:link rel="alternate" hreflang="uk" href="${page.ukUrl}" />
                    </url>`
                              })
                              .join('\n')
                }
            </urlset>`
}

export async function GET() {
    const pages: SitemapPage[] = [
        {
            url: `${siteURL}/`,
            lastModified: new Date(),
            enUrl: `${siteURL}/en`,
            ukUrl: `${siteURL}/uk`,
            priority: 1.0,
        },
        {
            url: `${siteURL}/blog`,
            lastModified: new Date(),
            enUrl: `${siteURL}/en/blog`,
            ukUrl: `${siteURL}/uk/blog`,
            priority: 0.8,
        },
    ]

    const articlePages: SitemapPage[] = []

    let groups = []

    try {
        groups = await getGroups()
    } catch (error) {
        const sitemap = generateSitemap(pages)

        return new Response(sitemap, {
            headers: { 'Content-Type': 'application/xml' },
        })
    }

    const articlesByGroup = await Promise.all(
        groups.map(async (group) => {
            const articles = await findByGroupId(group.id)

            return {
                articles,
            }
        }),
    )

    articlesByGroup.forEach((group) => {
        group.articles.forEach((article) => {
            const en = group.articles.find((a) => a.lang === 'en')?.canonicalURL
            const uk = group.articles.find((a) => a.lang === 'uk')?.canonicalURL
            const daysAgo =
                (Date.now() - new Date(article.updatedAt).getTime()) /
                (1000 * 60 * 60 * 24)

            let priority = 0.5

            if (daysAgo < 30) {
                priority = 0.8
            } else if (daysAgo < 90) {
                priority = 0.6
            } else if (daysAgo < 180) {
                priority = 0.4
            } else {
                priority = 0.3
            }

            articlePages.push({
                url: article.canonicalURL ?? '',
                lastModified: article.updatedAt,
                enUrl: en ?? '',
                ukUrl: uk ?? '',
                priority,
            })
        })
    })

    const sitemap = generateSitemap(pages, articlePages)

    return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' },
    })
}
