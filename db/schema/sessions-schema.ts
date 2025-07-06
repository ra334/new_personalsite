import { users } from './users-schema'
import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const sessions = pgTable('session', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: uuid('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})
