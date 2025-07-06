import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const media = pgTable('media', {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    type: text('type').notNull(),
    alt: text('alt'),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
})
