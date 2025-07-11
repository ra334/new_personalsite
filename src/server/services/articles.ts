import {
    type Article,
    createOne,
    findById,
    findBySlug,
} from '@/db/models/articles'
import { moveGeneratedFiles } from '@src/utils/fileOps'
import { generateOgImage } from '@src/utils/generateOgImage'
import path from 'path'
import slugify from 'slugify'

export interface CreateArticleInput {
    lang: string
    title: string
    content: string
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
    const generatedOgImage = await generateOg(data.title, slug)
    const ogImageUrl = `${SITE_URL}/${data.lang}/blog/${slug}/${generatedOgImage}`

    console.log(data.isPublished)

    try {
        const article = await createOne({
            ...data,
            slug,
            canonicalURL,
            ogImage: ogImageUrl,
        })

        const cleanWorkspaceResult = moveGeneratedFiles(slug, data.isPublished)

        if (!cleanWorkspaceResult) {
            console.error('Failed to clean workspace for article:', slug)
            return undefined
        }

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
