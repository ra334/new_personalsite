import { type ArticleFilter } from '@/db/models/articles'
import ArticlesList from '@src/components/ArticlesList'
import Pagination from '@src/components/Paginator'
import ArticlesFilterPanel from '@src/components/admin/ArticlesFilterPanel'
import Header from '@src/layouts/Header'
import Sidebar from '@src/layouts/admin/Sidebar'
import { getAllArticlesAction } from '@src/server/actions/articles'
import { adminCountAllArticlesAction } from '@src/server/actions/articles'

interface ArticlesPageProps {
    searchParams: {
        lang?: string
        publishedStatus?: ArticleFilter
    }
}

async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const { lang, publishedStatus } = await searchParams

    const articlesPerPage = 5
    const articles = await getAllArticlesAction(
        0,
        articlesPerPage,
        lang,
        publishedStatus,
    )
    const totalAllArticles = await adminCountAllArticlesAction(
        lang || '',
        publishedStatus || 'all',
    )

    const totalPages = Math.ceil(totalAllArticles / articlesPerPage)

    return (
        <div className="h-screen flex flex-col pb-3 overflow-hidden">
            <Header />
            <div className="container h-full w-full border p-2 flex flex-grow gap-2 overflow-y-auto">
                <Sidebar />
                <main className="flex flex-col gap-2 w-full overflow-auto">
                    <ArticlesFilterPanel
                        lang={lang}
                        publishedSatatus={publishedStatus}
                    />
                    <ArticlesList
                        articles={articles}
                        isPublishTags={true}
                        isAdmin={true}
                    />
                    <Pagination
                        className="mt-auto pb-2"
                        isAdmin={true}
                        currentPage={1}
                        totalPages={totalPages}
                    />
                </main>
            </div>
        </div>
    )
}

export default ArticlesPage
