import {
    createMedia,
    getMediaById,
    getTempMedia,
    updateMedia,
} from '@/db/models/media'
import type { MediaType, Media } from '@/db/models/media'
import fs from 'fs'
import path from 'path'
import z from 'zod'

function getGeneralType(mime: string): MediaType {
    if (mime.startsWith('image/')) return 'image'
    if (mime.startsWith('video/')) return 'video'
    if (mime.startsWith('audio/')) return 'audio'
    if (
        mime === 'application/pdf' ||
        mime.includes('word') ||
        mime.includes('text')
    )
        return 'document'
    if (mime.includes('zip') || mime.includes('rar')) return 'archive'
    return 'other'
}

const schema = z.object({
    buffer: z.instanceof(Buffer),
    fileName: z.string().min(1),
    mime: z
        .string()
        .min(1)
        .refine((mime) => mime.includes('/'), {
            message: 'Invalid MIME type',
        }),
})

export async function uploadMedia(
    buffer: Buffer,
    fileName: string,
    mime: string,
): Promise<string> {
    const parsed = schema.safeParse({ buffer, fileName, mime })

    if (!parsed.success) {
        throw new Error('Invalid input for file upload')
    }

    const uploadDir = path.join(process.cwd(), 'blog', 'temp')

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const imageUrl = `/api/blog/uploads/temp/${fileName}`
    const type = getGeneralType(mime)

    try {
        await createMedia(imageUrl, mime, type, true)
    } catch (error) {
        if (
            error ===
            'duplicate key value violates unique constraint "medias_url_unique'
        ) {
            return imageUrl
        }
    }

    return imageUrl
}

export async function getMedia(id: string): Promise<Media> {
    const schema = z.object({
        id: z.uuid(),
    })

    const parsedData = schema.safeParse({ id })

    if (!parsedData.success) {
        throw new Error('Invalid media ID')
    }

    try {
        return await getMediaById(id)
    } catch (error) {
        throw new Error('Media not found')
    }
}

export async function moveAllTempMediaToPermanent({
    id,
    slug,
    isPublished,
}: {
    id: string
    slug: string
    isPublished: boolean
}): Promise<boolean> {
    let tempMedia: Media[] = []

    try {
        tempMedia = await getTempMedia()
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message === 'No temporary media found'
        ) {
            return true
        }
    }

    const pathUrl = isPublished
        ? `/api/blog/${slug}/`
        : `/api/blog/draft/${slug}/`

    for (const media of tempMedia) {
        const newUrl = pathUrl + media.url.split('/').pop()
        try {
            await updateMedia(media.id, {
                url: newUrl,
                isTemp: false,
                articleId: id,
            })
        } catch (error) {
            console.error('Failed to update media:', error)
            return false
        }
    }

    return true
}
