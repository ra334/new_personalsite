import { auth } from '@src/auth'
import fs from 'fs'
import { NextRequest } from 'next/server'
import path from 'path'

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(req: NextRequest) {
    const session = await auth()

    if (session) {
        const uploadDir = path.join(process.cwd(), 'blog', 'temp')

        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
            })
        }

        const filePath = path.join(uploadDir, file.name)

        const buffer = Buffer.from(await file.arrayBuffer())

        fs.writeFileSync(filePath, buffer)

        const imageUrl = `/api/uploads/temp/${file.name}`
        return new Response(JSON.stringify({ url: imageUrl }), {
            status: 200,
        })
    } else {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
        })
    }
}
