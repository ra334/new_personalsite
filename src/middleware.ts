import { routing } from '@src/i18n/routing'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { NextResponse, NextRequest } from 'next/server'

const i18nMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
    if (process.env.NEXTAUTH_URL_INTERNAL) {
        process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL_INTERNAL
    }

    const secureCookie = process.env.NODE_ENV === 'production'

    const token = await getToken({
        req,
        secureCookie,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isLoggedIn = !!token
    const locales = ['en', 'uk']
    const paths = locales.flatMap((locale) => '/' + locale + '/admin')

    if (!isLoggedIn && paths.includes(req.nextUrl.pathname)) {
        return new NextResponse(null, { status: 404 })
    }

    return i18nMiddleware(req)
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
