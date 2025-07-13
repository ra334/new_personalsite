import { getAllArticlesSlugs } from '@src/server/services/articles'

export async function GET() {
    try {
        const slugs = await getAllArticlesSlugs()

        if (!slugs || slugs.length === 0) {
            throw new Error('No articles found')
        }

        return new Response(JSON.stringify({ slugs }))
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Error fetching article slugs' }),
            {
                status: 500,
            },
        )
    }
}
