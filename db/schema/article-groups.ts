import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const groups = pgTable('article_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})
