'use server'

import { auth } from '@src/auth'
import { cleanTempDirectory } from '@src/utils/fileOps'

export async function cleanTempDirectoryAction(): Promise<boolean> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return false
    }

    try {
        const result = await cleanTempDirectory()
        return result
    } catch (error) {
        console.error('Error cleaning temp directory:', error)
        return false
    }
}
