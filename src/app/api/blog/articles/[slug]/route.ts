import { type Article } from '@/db/models/articles'
import { getArticleBySlug } from '@src/server/services/articles'
import { NextRequest } from 'next/server'
import { z } from 'zod'

async function getArticleBySlugAction(slug: string): Promise<Article> {
    const articleSchema = z.object({
        slug: z.string().min(1),
    })

    const parsedData = articleSchema.safeParse({ slug })

    if (!parsedData.success) {
        throw new Error('Invalid article ID')
    }

    return await getArticleBySlug(parsedData.data.slug, true)
}

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } },
) {
    const slug = (await params).slug

    const article = await getArticleBySlugAction(slug)
    return new Response(JSON.stringify(article))
}
