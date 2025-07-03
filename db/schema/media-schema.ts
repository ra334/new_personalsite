import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'

export const media = pgTable('media', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    url: text('url').notNull(),
    type: text('type').notNull(),
    alt: text('alt'),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
})
