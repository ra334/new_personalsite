import authConfig from './auth.config'
import { db } from '@/db/postgress'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    ...authConfig,
    callbacks: {
        async signIn({ user }) {
            const adminEmail = process.env.ADMIN_EMAIL!

            if (!adminEmail) {
                console.error(
                    'ADMIN_EMAIL is not set in the environment variables',
                )
                return false
            }

            if (user.email === adminEmail) {
                return true
            }

            console.error(`Unauthorized sign-in attempt by user: ${user.email}`)
            return false
        },

        authorized: async ({ auth }) => {
            return !!auth
        },
    },

    session: { strategy: 'jwt' },
})
