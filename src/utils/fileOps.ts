import { getTempMedia, deleteMedia } from '@/db/models/media'
import fs from 'fs'
import path from 'path'

export function moveGeneratedFiles(
    slug: string,
    isPublished: boolean,
): boolean {
    const tempDir = path.join(process.cwd(), 'blog', 'temp')
    const blogDirName = isPublished ? 'published' : 'drafts'
    const articleDir = path.join(process.cwd(), 'blog', blogDirName, slug)

    fs.mkdirSync(articleDir, { recursive: true })

    const filesInTemp = fs.readdirSync(tempDir)

    if (filesInTemp.length === 0) {
        return true
    }

    filesInTemp.forEach((file) => {
        const filePath = path.join(tempDir, file)
        fs.renameSync(filePath, path.join(articleDir, file))
    })

    return true
}

export async function cleanTempDirectory(): Promise<boolean> {
    const tempDir = path.join(process.cwd(), 'blog', 'temp')

    if (!fs.existsSync(tempDir)) return true

    const mediaFilesInDir = fs.readdirSync(tempDir)

    if (!mediaFilesInDir.length) return true

    const mediaFiles = await getTempMedia().catch((error) => {
        console.error('Failed to get temporary media:', error)
        return []
    })

    if (!mediaFiles.length) return true

    mediaFiles.forEach((media) => {
        deleteMedia(media.id).catch((error) => {
            console.error('Failed to delete media:', error)
        })
    })

    fs.readdirSync(tempDir).forEach((file) => {
        fs.unlinkSync(path.join(tempDir, file))
    })

    return true
}

export async function moveArticleToPublic(slug: string): Promise<string> {
    const draftPath = path.join(process.cwd(), 'blog', 'drafts', slug)
    const publicPath = path.join(process.cwd(), 'blog', 'published', slug)

    try {
        await fs.promises.rename(draftPath, publicPath)
        return publicPath
    } catch (error) {
        console.error('Error moving article to public:', error)
        throw new Error('Failed to move article to public')
    }
}

export async function moveArticleToDraft(slug: string): Promise<string> {
    const publicPath = path.join(process.cwd(), 'blog', 'published', slug)
    const draftPath = path.join(process.cwd(), 'blog', 'drafts', slug)

    try {
        await fs.promises.rename(publicPath, draftPath)
        return draftPath
    } catch (error) {
        console.error('Error moving article to draft:', error)
        throw new Error('Failed to move article to draft')
    }
}

export async function removeMedia(
    slug: string,
    isPublished: boolean,
    name: string,
): Promise<string> {
    const mediaDir = path.join(
        process.cwd(),
        'blog',
        isPublished ? 'published' : 'drafts',
        slug,
    )

    if (!fs.existsSync(mediaDir)) {
        console.error(`Media directory does not exist: ${mediaDir}`)
        return ''
    }

    const filePath = path.join(mediaDir, name)
    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`)
        return ''
    }

    fs.unlinkSync(filePath)

    return mediaDir
}

export async function deleteArticleDir(slug: string, isPublished: boolean): Promise<boolean> {
    const articleDir = path.join(process.cwd(), 'blog', isPublished ? 'published' : 'drafts', slug)

    try {
        await fs.promises.rm(articleDir, { recursive: true })
        return true
    } catch (error) {
        return false
    }
}
