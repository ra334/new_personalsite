'use server'

import { type CreateArticleInput } from '../services/articles'
import { type Article } from '@/db/models/articles'
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
