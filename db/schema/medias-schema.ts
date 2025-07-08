import { timestamp, pgTable, text, uuid, boolean } from 'drizzle-orm/pg-core'

export const medias = pgTable('medias', {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    type: text('type').notNull(),
    alt: text('alt'),
    isTemp: boolean('isTemp').notNull().default(true),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})
