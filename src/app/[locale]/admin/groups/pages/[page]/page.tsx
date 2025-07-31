import { findManyPaginated } from '@/db/models/articles'
import ArticlesList from '@src/components/ArticlesList'
import Paginator from '@src/components/Paginator'
import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import { countAllArticlesAction } from '@src/server/actions/articles'
import { getTranslations } from 'next-intl/server'

type Params = Promise<{ locale: string; page: string }>

async function BlogPage({ params }: { params: Params }) {
    const { locale, page } = await params
    const t = await getTranslations('blog')

    const currentPage = parseInt(page)
    const articlesPerPage = 5
    const offset = (parseInt(page) - 1) * articlesPerPage
    const articles = await findManyPaginated(
        offset,
        articlesPerPage,
        locale,
        'published',
    )

    const totalArticles = await countAllArticlesAction(locale, 'published')
    const totalPages = Math.ceil(totalArticles / articlesPerPage)

    return (
        <>
            <Header />
            <div className="container px-6 flex flex-col h-full">
                <h1
                    className="font-bold"
                    style={{ fontSize: '1.875rem', padding: '20px 0 30px 0' }}
                >
                    {t('title')}
                </h1>
                <div className="flex flex-col justify-between flex-grow">
                    <ArticlesList articles={articles} />
                    <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath="/admin/groups"
                        className="p-6"
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogPage
