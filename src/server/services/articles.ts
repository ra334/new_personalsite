import { moveAllTempMediaToPermanent } from './medias'
import {
    type Article,
    createOne,
    findById,
    findBySlug,
    findManyPaginated,
    findManySlugs,
} from '@/db/models/articles'
import { moveGeneratedFiles } from '@src/utils/fileOps'
import { generateOgImage } from '@src/utils/generateOgImage'
import type { JSONContent } from '@tiptap/core'
import path from 'path'
import slugify from 'slugify'

export interface CreateArticleInput {
    lang: string
    title: string
    content: JSONContent
    isPublished: boolean
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
}

export async function createArticle(
    data: CreateArticleInput,
): Promise<Article | undefined> {
    const slug = slugify(data.title.toLowerCase())
    const canonicalURL = `${process.env.NEXT_PUBLIC_SITE_URL}/${data.lang}/blog/${slug}`
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

    if (!SITE_URL) {
        throw new Error('SITE_URL is not defined in environment variables')
    }

    const ogImageUrl = await generateOgImageUrl(
        data.title,
        data.lang,
        slug,
        SITE_URL,
    )

    try {
        const content: JSONContent = changeImagesSrc(data.content, slug)

        const article = await createOne({
            ...data,
            slug,
            canonicalURL,
            content,
            ogImage: ogImageUrl,
        })

        await finalizeArticleAssets(slug, data.isPublished)

        return article
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error(
                'An unknown error occurred while fetching the article',
            )
        }
    }
}

export async function getArticleById(id: string): Promise<Article | null> {
    try {
        const article = await findById(id)

        return article
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error(
                'An unknown error occurred while fetching the article',
            )
        }
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const article = await findBySlug(slug)

        return article
    } catch (error) {
        console.error('Error fetching article by slug:', error)
        return null
    }
}

export async function getArticles(
    offset: number,
    limit: number,
): Promise<Article[]> {
    try {
        const articles = await findManyPaginated(offset, limit)
        return articles
    } catch (error) {
        console.error('Error fetching articles:', error)
        return []
    }
}

export async function getAllArticlesSlugs(): Promise<string[]> {
    try {
        const slugs = await findManySlugs()
        return slugs
    } catch (error) {
        console.error('Error fetching article slugs:', error)
        return []
    }
}

async function generateOgImageUrl(
    title: string,
    lang: string,
    slug: string,
    siteURL: string,
): Promise<string> {
    const generatedOgImage = await generateOg(title, slug)
    return `${siteURL}/${lang}/blog/${slug}/${generatedOgImage}`
}

async function finalizeArticleAssets(
    slug: string,
    isPublished: boolean,
): Promise<void> {
    const [mediaResult, cleanResult] = await Promise.all([
        moveAllTempMediaToPermanent(slug),
        moveGeneratedFiles(slug, isPublished),
    ])

    if (!mediaResult) {
        throw new Error('Failed to move media files')
    }

    if (!cleanResult) {
        throw new Error('Failed to clean workspace')
    }
}

async function generateOg(text: string, slug: string): Promise<string> {
    const outputName = `${slug}-ogimage.jpeg`

    const templatePath = path.join(process.cwd(), 'blog', 'template.jpeg')
    const outputPath = path.join(process.cwd(), 'blog', 'temp', outputName)
    const x = 300
    const y = 200
    const width = 800

    const result = await generateOgImage(
        templatePath,
        outputPath,
        text,
        x,
        y,
        width,
    )

    if (!result) {
        throw new Error('Failed to generate OG image')
    }

    return outputName
}

function changeImagesSrc(content: JSONContent, slug: string): JSONContent {
    const updatedContent = content.content?.map((item: JSONContent) => {
        if (item.type === 'image' && item.attrs?.src) {
            const fileName = item.attrs.src.split('/').pop()
            const newSrc = `/api/blog/${slug}/${fileName}`
            return {
                ...item,
                attrs: {
                    ...item.attrs,
                    src: newSrc,
                },
            }
        }
        return item
    })

    return {
        ...content,
        content: updatedContent,
    }
}
