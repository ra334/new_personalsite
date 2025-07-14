import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import Editor from '@src/layouts/admin/Editor'
import {
    getAllArticlesSlugs,
    getArticleBySlug,
} from '@src/server/services/articles'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import type { Metadata } from 'next'

export async function generateStaticParams() {
    const slugs = await getAllArticlesSlugs()

    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    try {
        const { slug } = await params

        const article = await getArticleBySlug(slug, true)

        return {
            title: article.title,
            description: article.metaDescription,
            alternates: {
                canonical: article.canonicalURL || '',
            },
            openGraph: {
                title: article.title,
                description:
                    article.ogDescription || article.metaDescription || '',
                url: article.canonicalURL || '',
                images: [
                    {
                        url: article.canonicalURL || '',
                        alt: article.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.metaDescription || '',
                images: article.ogImage || '',
            },
        }
    } catch (error) {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
            openGraph: {
                title: 'Article Not Found',
                description: 'The requested article could not be found.',
            },
            twitter: {
                card: 'summary',
                title: 'Article Not Found',
                description: 'The requested article could not be found.',
            },
        }
    }
}

export default async function ArticlePage({
    params,
}: {
    params: { slug: string }
}) {
    const { slug } = await params

    const article = await getArticleBySlug(slug, true)

    const lang = article.lang

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription || '',
        image: article.ogImage || '',
        author: {
            '@type': 'Person',
            name: lang === 'en' ? 'Mykhailo Savchuk' : 'Михаайло Савчук',
        },
        publisher: {
            '@type': 'Organization',
            name: 'My Personal Site',
        },
        datePublished: article.createdAt,
        dateModified: article.updatedAt,
    }

    const formattedDate = format(new Date(article.createdAt), 'd MMMM yyyy', {
        locale: lang === 'en' ? enUS : uk,
    })

    const publishedBlock = {
        type: 'publishedNode',
        attrs: {
            text: formattedDate,
        },
    }

    const contentWithDate = {
        type: 'doc',
        content: [
            article.content.content.slice(0, 1)[0],
            publishedBlock,
            ...article.content.content.slice(1),
        ],
    }

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <div className="container px-6">
                <Editor
                    content={contentWithDate}
                    isEditable={false}
                    immediatelyRender={false}
                />
            </div>
            <Footer />
        </>
    )
}
