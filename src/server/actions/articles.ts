'use server'

import { type CreateArticleInput } from '../services/articles'
import {
    countAllArticles,
    type Article,
    type ArticleFilter,
} from '@/db/models/articles'
import { findManyPaginated, updateOne } from '@/db/models/articles'
import { auth } from '@src/auth'
import { createArticle } from '@src/server/services/articles'
import z from 'zod'

export async function createArticleAction(
    data: CreateArticleInput,
): Promise<Article | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const articleSchema = z.object({
        lang: z.string().nonempty(),
        title: z.string().nonempty(),
        content: z.string().nonempty(),
        excerpt: z.string().nonempty(),
        isPublished: z.boolean(),
        metaTitle: z.string().nonempty(),
        metaDescription: z.string().nonempty(),
        ogTitle: z.string().nonempty(),
        ogDescription: z.string().nonempty(),
    })

    const parsedData = articleSchema.safeParse(data)

    if (!parsedData.success) {
        console.error('Validation error:', parsedData.error)
        return undefined
    }

    return await createArticle(parsedData.data)
}

export async function getAllArticlesAction(
    offset: number,
    limit: number,
    lang?: string,
    status?: ArticleFilter,
): Promise<Article[]> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return []
    }

    return await findManyPaginated(offset, limit, lang, status)
}

export async function updateArticleAction(
    id: string,
    data: Partial<CreateArticleInput>,
): Promise<Article | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    return await updateOne(id, data)
}

export async function countAllArticlesAction(
    lang: string,
    status: ArticleFilter,
): Promise<number> {
    if (status === 'all' || status === 'draft') {
        return 0
    }

    return await countAllArticles({ lang, status })
}

export async function adminCountAllArticlesAction(
    lang: string,
    status: ArticleFilter,
): Promise<number> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return 0
    }

    return await countAllArticles({ status })
}
