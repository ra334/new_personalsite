import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
})
