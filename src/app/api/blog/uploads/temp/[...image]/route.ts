import { auth } from '@src/auth'
import fs from 'fs'
import { NextRequest } from 'next/server'
import path from 'path'

export async function GET(
    req: NextRequest,
    { params }: { params: { image: string[] } },
) {
    const session = await auth()

    if (session) {
        const { image } = await params

        const imagePath = path.join(process.cwd(), 'public', 'temp', image[0])

        if (!fs.existsSync(imagePath)) {
            return new Response(JSON.stringify({ error: 'File not found' }), {
                status: 404,
            })
        }

        const fileBuffer = fs.readFileSync(imagePath)
        const ext = path.extname(imagePath).slice(1)

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Countent-Type': `image/${ext}`,
            },
        })
    } else {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
        })
    }
}
