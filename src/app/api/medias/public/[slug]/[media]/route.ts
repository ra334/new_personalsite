import fs from 'fs'
import { NextRequest } from 'next/server'
import path from 'path'

type Params = Promise<{
    slug: string
    media: string
}>

export async function GET(req: NextRequest, { params }: { params: Params }) {
    const { media, slug } = await params

    const mediaPath = path.join(process.cwd(), 'blog', 'published', slug, media)

    if (!fs.existsSync(mediaPath)) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
            status: 404,
        })
    }

    const fileBuffer = fs.readFileSync(mediaPath)
    const ext = path.extname(mediaPath).slice(1)

    return new Response(fileBuffer, {
        status: 200,
        headers: {
            'Countent-Type': `image/${ext}`,
        },
    })
}
