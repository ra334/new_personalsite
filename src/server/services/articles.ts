import { getArticleBySlugAdmin } from '../actions/articles'
import { moveAllTempMediaToPermanent } from './medias'
import {
    type Article,
    createOne,
    findManySlugs,
    updateOne,
} from '@/db/models/articles'
import { deleteMediaByUrl, getTempMedia } from '@/db/models/media'
import {
    moveGeneratedFiles,
    moveArticleToPublic,
    moveArticleToDraft,
    removeMedia,
    cleanTempDirectory,
} from '@src/utils/fileOps'
import { generateOgImage } from '@src/utils/generateOgImage'
import type { JSONContent } from '@tiptap/core'
import path from 'path'
import slugify from 'slugify'

export interface CreateArticleInput {
    lang: string
    title: string
    content: string
    excerpt: string
    isPublished: boolean
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
}

export interface UpdateArticleData {
    lang?: string
    title?: string
    slug?: string
    content?: string
    excerpt?: string
    isPublished?: boolean
    metaTitle?: string
    metaDescription?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonicalURL?: string
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

    const convertedContent: JSONContent = JSON.parse(data.content)

    try {
        const content: JSONContent = changeImagesSrc(
            convertedContent,
            slug,
            data.isPublished,
        )

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

export async function updateArticle(
    slug: string,
    data: UpdateArticleData,
): Promise<Article | undefined> {
    const previousArticle = await getArticleBySlugAdmin(slug)

    if (!previousArticle) {
        console.error('Article not found for slug:', slug)
        return undefined
    }

    const updatedData: UpdateArticleData = { ...data }

    if (data.title && previousArticle.title !== data.title) {
        updatedData.slug = slugify(data.title.toLowerCase())
    }

    let parsedContent: JSONContent | null = null
    let dataChanged = false

    if (
        data.content &&
        data.content !== JSON.stringify(previousArticle.content)
    ) {
        parsedContent = JSON.parse(data.content)

        if (!parsedContent || typeof parsedContent !== 'object') return

        const removedImages = new Set<string>(
            getRemovedImages(parsedContent, previousArticle.content),
        )

        const tempMedia = await getTempMedia()

        await Promise.all(
            Array.from(removedImages).map(async (imageUrl) => {
                const fileName = imageUrl.split('/').pop()

                console.log(`Checking if media is temp: ${fileName}`)

                const isTemp = tempMedia.some((media) => {
                    const mediaFileName = media.url.split('/').pop()
                    console.log(
                        `Checking if media is temp: ${mediaFileName} === ${fileName}`,
                    )
                    return mediaFileName === fileName
                })

                if (isTemp) return

                console.log(`Deleting media: ${imageUrl}`)

                await deleteMediaByUrl(imageUrl)
                await removeMedia(
                    updatedData.slug || previousArticle.slug,
                    data.isPublished ?? previousArticle.isPublished,
                    fileName || '',
                )
            }),
        )

        const updatedContent = changeImagesSrc(
            parsedContent,
            updatedData.slug || previousArticle.slug,
            updatedData.isPublished || previousArticle.isPublished,
        )

        await finalizeArticleAssets(
            slug,
            updatedData.isPublished ?? previousArticle.isPublished,
        )

        updatedData.content = JSON.stringify(updatedContent)
        dataChanged = true
    }

    if (data.isPublished && !previousArticle.isPublished) {
        await moveArticleToPublic(slug)

        if (data.content && !dataChanged) {
            const updatedContent = changeImagesSrc(
                parsedContent || previousArticle.content,
                updatedData.slug || previousArticle.slug,
                updatedData.isPublished ?? previousArticle.isPublished,
            )

            updatedData.content = JSON.stringify(updatedContent)
        }
    }

    if (!data.isPublished && previousArticle.isPublished) {
        await moveArticleToDraft(slug)

        if (data.content && !dataChanged) {
            const updatedContent = changeImagesSrc(
                JSON.parse(data.content) || previousArticle.content,
                updatedData.slug || previousArticle.slug,
                data.isPublished ?? previousArticle.isPublished,
            )

            updatedData.content = JSON.stringify(updatedContent)
        }
    }

    if (
        data.ogTitle &&
        data.slug &&
        previousArticle?.ogTitle !== data.ogTitle
    ) {
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

        if (!SITE_URL) {
            throw new Error('SITE_URL is not defined in environment variables')
        }

        updatedData.ogImage = await generateOgImageUrl(
            data.ogTitle,
            previousArticle.lang,
            data.slug,
            SITE_URL,
        )
    }

    return await updateOne(previousArticle.id, updatedData)
}

function extractImageUrls(content: JSONContent | undefined): string[] {
    if (!content?.content) return []

    const imageUrls: string[] = []

    for (const node of content.content) {
        if (node.type === 'image' && node.attrs?.src) {
            imageUrls.push(node.attrs.src)
        }

        if (node.content) {
            imageUrls.push(...extractImageUrls(node))
        }
    }

    return imageUrls
}

export function getRemovedImages(
    currentContent: JSONContent,
    previousContent: JSONContent,
): string[] {
    const currentImages = new Set(extractImageUrls(currentContent))
    const previousImages = extractImageUrls(previousContent)

    return previousImages.filter((name) => !currentImages.has(name))
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
        moveAllTempMediaToPermanent(slug, isPublished),
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

function changeImagesSrc(
    content: JSONContent,
    slug: string,
    published: boolean,
): JSONContent {
    const updatedContent = content.content?.map((item: JSONContent) => {
        if (item.type === 'image' && item.attrs?.src) {
            const fileName = item.attrs.src.split('/').pop()
            const newSrc = published
                ? `/api/blog/${slug}/${fileName}`
                : `/api/blog/draft/${slug}/${fileName}`

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

export async function cleanTemporaryFiles(): Promise<boolean> {
    try {
        const res = await cleanTempDirectory()
        const allTempMedia = await getTempMedia()
        if (allTempMedia.length > 0) {
            await Promise.all(
                allTempMedia.map((media) => deleteMediaByUrl(media.url)),
            )
        }
        return res
    } catch (error) {
        console.error('Error cleaning temporary files:', error)
        return false
    }
}
