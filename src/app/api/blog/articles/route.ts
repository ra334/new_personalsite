import { type Article } from '@/db/models/articles'
import {
    getArticles,
    getCountPublishedArticles,
} from '@src/server/services/articles'
import { NextRequest } from 'next/server'
import { z } from 'zod'

async function getArticlesAction(
    offset: number,
    limit: number,
): Promise<Article[]> {
    const aritcleSchema = z.object({
        offset: z.number().int().nonnegative(),
        limit: z.number().int().positive(),
    })

    const parsedData = aritcleSchema.safeParse({ offset, limit })

    if (!parsedData.success) {
        throw new Error('Invalid offset or limit')
    }

    try {
        return await getArticles(parsedData.data.offset, parsedData.data.limit)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error('An unknown error occurred while fetching articles')
        }
    }
}

async function getCountPublishedArticlesAction(): Promise<number> {
    try {
        return await getCountPublishedArticles()
    } catch (error) {
        throw new Error(
            'An unknown error occurred while fetching the count of published articles',
        )
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page'))

    if (page) {
        const zodSchema = z.object({
            page: z.number().int().nonnegative(),
        })

        const parsedPage = zodSchema.safeParse({ page })

        if (!parsedPage.success) {
            return new Response(
                JSON.stringify({ error: 'Invalid page number' }),
                { status: 400 },
            )
        }

        const count = await getCountPublishedArticlesAction()
        const offset = (parsedPage.data.page - 1) * 10
        const limit = 10
        const articles = await getArticlesAction(offset, limit)
        return new Response(JSON.stringify({ articles, count }))
    }
}
