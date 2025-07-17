import type { Article } from '@/db/models/articles'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import Link from 'next/link'

function getFormattedDate(lang: string, date: Date): string {
    return format(date, 'd MMMM yyyy', {
        locale: lang === 'en' ? enUS : uk,
    })
}

function ArticlesList({ articles }: { articles: Article[] }) {
    return (
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
    )
}

export default ArticlesList
