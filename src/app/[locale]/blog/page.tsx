import { findManyPaginated } from '@/db/models/articles'
import Paginator from '@src/components/Paginator'
import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import { getCountPublishedArticles } from '@src/server/services/articles'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface BlogPageProps {
    params: {
        locale: string
    }
}

async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params
    const t = await getTranslations('blog')

    const articlesPerPage = 5
    const articles = await findManyPaginated(0, articlesPerPage, locale, true)

    const totalArticles = await getCountPublishedArticles(locale)
    const totalPages = Math.ceil(totalArticles / articlesPerPage)

    function getFormattedDate(lang: string, date: Date): string {
        return format(date, 'd MMMM yyyy', {
            locale: lang === 'en' ? enUS : uk,
        })
    }

    return (
        <>
            <Header />
            <main className="container px-6 flex flex-col h-full">
                {/* doesn't work some tailwind classes, maybe in future rewrite all style from tailwind to scss */}
                <h1
                    className="font-bold"
                    style={{ fontSize: '1.875rem', padding: '20px 0 30px 0' }}
                >
                    {t('title')}
                </h1>
                <div className="flex flex-col justify-between flex-grow">
                    <ul className="flex flex-col gap-4">
                        {articles.map((article, index) => {
                            return (
                                <li key={index}>
                                    <article className="border p-4">
                                        <Link href={`/blog/${article.slug}`}>
                                            <h2 className="text-xl font-bold pb-3">
                                                {article.title}
                                            </h2>
                                        </Link>
                                        <div className="flex gap-2 pb-3">
                                            <Clock width={16} />
                                            <span className="text-base">
                                                {getFormattedDate(
                                                    article.lang,
                                                    article.createdAt,
                                                )}
                                            </span>
                                        </div>
                                        <p>{article.excerpt}</p>
                                    </article>
                                </li>
                            )
                        })}
                    </ul>
                    <Paginator
                        currentPage={1}
                        totalPages={totalPages}
                        className="p-6"
                    />
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BlogPage
