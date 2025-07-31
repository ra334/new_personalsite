import { accounts } from './schema/accounts'
import { groups } from './schema/article-groups'
import { articles } from './schema/articles'
import { authenticators } from './schema/authenticator'
import { medias } from './schema/medias'
import { sessions } from './schema/sessions'
import { users } from './schema/users'
import { verificationTokens } from './schema/verificationToken'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: {
        users,
        accounts,
        groups,
        sessions,
        verificationTokens,
        authenticators,
        medias,
        articles,
    },
})
