import { db } from '../postgress'
import { articles } from '../schema/articles'
import { eq, count, and } from 'drizzle-orm'

export interface Article {
    id: string
    lang: string
    title: string
    slug: string
    content: any
    excerpt: string
    isPublished: boolean
    metaTitle: string | null
    metaDescription: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    canonicalURL: string | null
    createdAt: Date
    updatedAt: Date
}

export interface UpdateArticleData {
    lang?: string
    title?: string
    slug?: string
    content?: any
    excerpt?: string
    isPublished?: boolean
    metaTitle?: string
    metaDescription?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonicalURL?: string
}

export interface CreateArticleData {
    lang: string
    title: string
    slug: string
    content: any
    excerpt: string
    isPublished: boolean
    metaTitle?: string
    metaDescription?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonicalURL?: string
}

export async function createOne({
    lang,
    title,
    slug,
    content,
    excerpt,
    isPublished,
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalURL,
}: CreateArticleData): Promise<Article> {
    try {
        const [article] = await db
            .insert(articles)
            .values({
                lang,
                title,
                slug,
                content,
                excerpt,
                isPublished,
                metaTitle,
                metaDescription,
                ogTitle,
                ogDescription,
                ogImage,
                canonicalURL,
            })
            .returning()

        return article
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
        throw new Error('Unknown error occurred while creating article')
    }
}

export async function findById(id: string): Promise<Article> {
    const article = await db.query.articles.findFirst({
        where: eq(articles.id, id),
    })

    if (!article) {
        throw new Error('Article not found')
    }

    return article
}

export async function findBySlug(
    slug: string,
    published: boolean,
): Promise<Article> {
    const article = await db.query.articles.findFirst({
        where: (row) => and(eq(row.slug, slug), eq(row.isPublished, published)),
    })

    if (!article) {
        throw new Error('Article not found')
    }

    return article
}

export async function findPublished(
    offset: number = 0,
    limit: number = 10,
): Promise<Article[]> {
    const articlesList = await db
        .select()
        .from(articles)
        .where(eq(articles.isPublished, true))
        .offset(offset)
        .limit(limit)

    return articlesList
}

export async function findManyPaginated(
    offset: number = 0,
    limit: number = 10,
    lang?: string,
    isPublished?: boolean,
): Promise<Article[]> {
    const query = db.select().from(articles).limit(limit).offset(offset)

    if (lang) {
        query.where(eq(articles.lang, lang))
    }

    if (isPublished) {
        query.where(eq(articles.isPublished, isPublished))
    }

    const articlesList = await query

    return articlesList
}

export async function findManySlugs(): Promise<string[]> {
    const articlesList = await db
        .select({ slug: articles.slug })
        .from(articles)
        .where(eq(articles.isPublished, true))

    return articlesList.map((article) => article.slug)
}

export async function countPublished(lang: string): Promise<number> {
    const result = await db
        .select({ value: count() })
        .from(articles)
        .where(and(eq(articles.isPublished, true), eq(articles.lang, lang)))

    return result[0].value
}

export async function countDrafts(): Promise<number> {
    const result = await db
        .select({ value: count() })
        .from(articles)
        .where(eq(articles.isPublished, false))

    return result[0].value
}

export async function updateOne(
    id: string,
    data: UpdateArticleData,
): Promise<Article> {
    try {
        const [article] = await db
            .update(articles)
            .set({
                ...data,
            })
            .where(eq(articles.id, id))
            .returning()

        return article
    } catch (error) {
        throw new Error('Failed to update article: ' + error)
    }
}

export async function deleteOne(id: string): Promise<Article> {
    try {
        const [article] = await db
            .delete(articles)
            .where(eq(articles.id, id))
            .returning()

        return article
    } catch (error) {
        throw new Error('Failed to delete article: ' + error)
    }
}
