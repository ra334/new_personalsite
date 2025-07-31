'use server'

import {
    countAllArticles,
    type Article,
    type ArticleFilter,
} from '@/db/models/articles'
import { findManyPaginated, findBySlug } from '@/db/models/articles'
import { auth } from '@src/auth'
import { type CreateArticleInput } from '@src/server/services/articles'
import {
    createArticle,
    updateArticle,
    cleanTemporaryFiles,
    deleteArticle,
} from '@src/server/services/articles'
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
        groupId: z.string(),
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

export async function updateArticleAction(
    slug: string,
    data: Partial<CreateArticleInput>,
): Promise<Article | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const articleSchema = z.object({
        lang: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        isPublished: z.boolean().optional(),
        groupId: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
    })

    const parsedData = articleSchema.safeParse(data)

    if (!parsedData.success) {
        console.error('Validation error:', parsedData.error)
        return undefined
    }

    return await updateArticle(slug, parsedData.data)
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

export async function getArticleBySlugAdmin(
    slug: string,
): Promise<Article | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    return await findBySlug(slug)
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

export async function cleanTempDirectoryAction(): Promise<boolean> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return false
    }

    return await cleanTemporaryFiles()
}

export async function deleteArticleAction(slug: string): Promise<string> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return 'User is not authenticated'
    }

    const result = await deleteArticle(slug)

    if (!result) {
        console.error('Failed to remove article')
        return 'Failed to remove article'
    }

    return result.slug
}
