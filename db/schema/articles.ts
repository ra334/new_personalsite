import {
    boolean,
    timestamp,
    pgTable,
    varchar,
    text,
    jsonb,
    uuid,
} from 'drizzle-orm/pg-core'

export const articles = pgTable('articles', {
    id: uuid('id').primaryKey().defaultRandom(),
    lang: varchar('lang', { length: 2 }).notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').notNull(),
    excerpt: text('excerpt').notNull(),
    isPublished: boolean('isPublished').notNull().default(false),
    metaTitle: text('metaTitle'),
    metaDescription: text('metaDescription'),
    ogTitle: text('ogTitle'),
    ogDescription: text('ogDescription'),
    ogImage: text('ogImage'),
    canonicalURL: text('canonicalURL'),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})
