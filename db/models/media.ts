import { db } from '../postgress'
import { medias } from '../schema/medias'
import { eq, count } from 'drizzle-orm'

export type MediaType =
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'archive'
    | 'other'

export interface Media {
    id: string
    url: string
    mime: string
    type: MediaType
    isTemp: boolean
    createdAt: Date
}

export interface UpdateMediaData {
    url?: string
    mime?: string
    type?: MediaType
    isTemp?: boolean
    articleId?: string
}

export async function createMedia(
    url: string,
    mime: string,
    type: MediaType,
    isTemp: boolean,
): Promise<Media> {
    try {
        const media = await db
            .insert(medias)
            .values({
                url,
                mime,
                type,
                isTemp,
            })
            .returning()

        return media[0]
    } catch (error) {
        throw new Error('Failed to create media: ' + error)
    }
}

export async function getMediaById(id: string): Promise<Media> {
    const media = await db.query.medias.findFirst({
        where: eq(medias.id, id),
    })

    if (!media) {
        throw new Error('Media not found')
    }

    return media
}

export async function getTempMedia(): Promise<Media[]> {
    const mediaList = await db.query.medias.findMany({
        where: eq(medias.isTemp, true),
    })

    return mediaList
}

export async function updateMedia(
    id: string,
    data: UpdateMediaData,
): Promise<Media> {
    const media = await db
        .update(medias)
        .set(data)
        .where(eq(medias.id, id))
        .returning()

    if (!media.length) {
        throw new Error('Media not found or update failed')
    }

    return media[0]
}

export async function getAllMedia(
    limitValue: number = 10,
    offsetValue: number = 0,
): Promise<Media[]> {
    const mediaList = await db.query.medias.findMany({
        limit: limitValue,
        offset: offsetValue,
        orderBy: (medias, { desc }) => [desc(medias.createdAt)],
    })

    if (!mediaList.length) {
        throw new Error('No media found')
    }

    return mediaList
}

export async function countTempMedia(): Promise<number> {
    const result = await db
        .select({ value: count() })
        .from(medias)
        .where(eq(medias.isTemp, true))

    return result[0].value
}

export async function countParmanentMedia(): Promise<number> {
    const result = await db
        .select({ value: count() })
        .from(medias)
        .where(eq(medias.isTemp, false))

    return result[0].value
}

export async function countAllMedia(): Promise<number> {
    const result = await db.select({ value: count() }).from(medias)

    return result[0].value
}

export async function deleteMediaByUrl(url: string) {
    const media = await db.delete(medias).where(eq(medias.url, url)).returning()

    if (!media.length) {
        throw new Error('Media not found or delete failed')
    }

    return media[0]
}

export async function deleteMedia(id: string) {
    const media = await db.delete(medias).where(eq(medias.id, id)).returning()

    if (!media.length) {
        throw new Error('Media not found or delete failed')
    }

    return media[0]
}
