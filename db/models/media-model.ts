import { db } from '../postgress'
import { medias } from '../schema/medias-schema'
import { eq } from 'drizzle-orm'

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

export async function updateMediaUrl(id: string, url: string) {
    const media = await db
        .update(medias)
        .set({ url })
        .where(eq(medias.id, id))
        .returning()

    if (!media.length) {
        throw new Error('Media not found or update failed')
    }

    return media[0]
}

export async function updateMediaMime(id: string, mime: string) {
    const media = await db
        .update(medias)
        .set({ mime })
        .where(eq(medias.id, id))
        .returning()

    if (!media.length) {
        throw new Error('Media not found or update failed')
    }

    return media[0]
}

export async function updateMediaType(id: string, type: MediaType) {
    const media = await db
        .update(medias)
        .set({ type })
        .where(eq(medias.id, id))
        .returning()

    if (!media.length) {
        throw new Error('Media not found or update failed')
    }

    return media[0]
}

export async function updateMediaIsTemp(id: string, isTemp: boolean) {
    const media = await db
        .update(medias)
        .set({ isTemp })
        .where(eq(medias.id, id))
        .returning()

    if (!media.length) {
        throw new Error('Media not found or update failed')
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
