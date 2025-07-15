import Paginator from '@src/components/Paginator'
import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import {
    getArticles,
    getCountPublishedArticles,
} from '@src/server/services/articles'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import Link from 'next/link'

interface BlogPageProps {
    params: {
        locale: string
        page: string
    }
}

async function BlogPage({ params }: BlogPageProps) {
    const { locale, page } = await params

    const currentPage = parseInt(page)
    const articlesPerPage = 5
    const offset = (parseInt(page) - 1) * articlesPerPage
    const articles = await getArticles(offset, articlesPerPage, locale)

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
            <div className="container px-6 flex flex-col h-full">
                <h1 className="text-3xl font-bold">Last articles</h1>
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
                        currentPage={currentPage}
                        totalPages={totalPages}
                        className="p-6"
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogPage
