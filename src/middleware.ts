import { auth } from '@src/auth.middleware'
import { routing } from '@src/i18n/routing'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

const i18nMiddleware = createMiddleware(routing)

export default auth(async (req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const locales = ['en', 'uk']

    const paths = locales.flatMap((locale) => '/' + locale + '/admin')

    if (!isLoggedIn && paths.includes(nextUrl.pathname)) {
        return new NextResponse(null, { status: 404 })
    }

    return i18nMiddleware(req)
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
