import { findBySlug } from '@/db/models/articles'
import ArticleContent from '@src/components/ArticleContent'
import '@src/components/tiptap/tiptap-node/code-block-node/code-block-node.scss'
import '@src/components/tiptap/tiptap-node/list-node/list-node.scss'
import '@src/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss'
import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import { getAllArticlesSlugs } from '@src/server/services/articles'
import '@src/styles/_keyframe-animations.scss'
import '@src/styles/_variables.scss'
import '@src/styles/lowlight.scss'
import '@src/styles/style.scss'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import type { Metadata } from 'next'

type Params = Promise<{ slug: string }>

export async function generateMetadata({
    params,
}: {
    params: Params
}): Promise<Metadata> {
    try {
        const { slug } = await params

        const article = await findBySlug(slug, true)

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

export default async function ArticlePage({ params }: { params: Params }) {
    const { slug } = await params

    const article = await findBySlug(slug, true)

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
                <ArticleContent content={contentWithDate} />
            </div>
            <Footer />
        </>
    )
}
