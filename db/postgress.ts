import { accounts } from './schema/accounts-schema'
import { authenticators } from './schema/authenticator-schema'
import { media } from './schema/media-schema'
import { posts } from './schema/posts-schema'
import { sessions } from './schema/sessions-schema'
import { users } from './schema/users-schema'
import { verificationTokens } from './schema/verificationToken-schema'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: {
        ...users,
        ...accounts,
        ...sessions,
        ...verificationTokens,
        ...authenticators,
        ...media,
        ...posts,
    },
})
