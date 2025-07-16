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
