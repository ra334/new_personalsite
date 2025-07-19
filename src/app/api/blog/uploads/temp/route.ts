import { auth } from '@src/auth'
import { uploadMedia } from '@src/server/services/medias'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const session = await auth()

    if (session) {
        const formData = await req.formData()
        const blob = formData.get('file') as Blob | null

        if (!blob) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
            })
        }

        const mimeType = blob.type

        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const fileName = formData.get('fileName') as string

        try {
            const imageUrl = await uploadMedia(buffer, fileName, mimeType)

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
