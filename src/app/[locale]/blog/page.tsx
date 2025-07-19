import { findManyPaginated } from '@/db/models/articles'
import ArticlesList from '@src/components/ArticlesList'
import Paginator from '@src/components/Paginator'
import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import { countAllArticlesAction } from '@src/server/actions/articles'
import { getTranslations } from 'next-intl/server'

type Params = Promise<{ locale: string }>

async function BlogPage(params: { params: Params }) {
    const { locale } = await params.params
    const t = await getTranslations('blog')

    const articlesPerPage = 5
    const articles = await findManyPaginated(
        0,
        articlesPerPage,
        locale,
        'published',
    )

    const totalArticles = await countAllArticlesAction(locale, 'published')
    const totalPages = Math.ceil(totalArticles / articlesPerPage)

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
                    <ArticlesList articles={articles} />
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
