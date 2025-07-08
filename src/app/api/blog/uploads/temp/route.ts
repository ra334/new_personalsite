import { auth } from '@src/auth'
import { uploadMedia } from '@src/server/services/medias-service'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const session = await auth()

    if (session) {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
            })
        }

        const mimeType = file.type

        try {
            const imageUrl = await uploadMedia(file, mimeType)

            return new Response(JSON.stringify({ url: imageUrl }), {
                status: 200,
            })
        } catch (error) {
            return new Response(
                JSON.stringify({ error: 'Uploading file error' }),
                { status: 500 },
            )
        }
    } else {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
        })
    }
}
