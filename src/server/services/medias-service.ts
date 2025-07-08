import { createMedia } from '@/db/models/media-model'
import type { MediaType } from '@/db/models/media-model'
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
    file: z.instanceof(File),
    mime: z
        .string()
        .min(1)
        .refine((mime) => mime.includes('/'), {
            message: 'Invalid MIME type',
        }),
})

export async function uploadMedia(file: File, mime: string): Promise<string> {
    const parsed = schema.safeParse({ file, mime })

    if (!parsed.success) {
        throw new Error('Invalid input for file upload')
    }

    const uploadDir = path.join(process.cwd(), 'blog', 'temp')
    const filePath = path.join(uploadDir, file.name)
    const buffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, buffer)
    const imageUrl = `/api/blog/uploads/temp/${file.name}`
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
