import UpdateArticleClientWrapper from './UpdateArticleClientWrapper'
import { getArticleBySlugAdmin } from '@src/server/actions/articles'

interface UpdateArticleProps {
    params: {
        slug: string
    }
}

async function UpdateArticle({ params }: UpdateArticleProps) {
    const { slug } = await params

    try {
        const article = await getArticleBySlugAdmin(slug)
        return (
            <>{article && <UpdateArticleClientWrapper article={article} />}</>
        )
    } catch (error) {
        if (error instanceof Error && error.message === 'Article not found') {
            return <div>Article not found</div>
        }
    }
}

export default UpdateArticle
