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

    fs.readdirSync(tempDir).forEach((file) => {
        const filePath = path.join(tempDir, file)
        fs.renameSync(filePath, path.join(articleDir, file))
    })

    return true
}
