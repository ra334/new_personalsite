import {
    boolean,
    timestamp,
    pgTable,
    varchar,
    text,
    jsonb,
    uuid,
} from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    lang: varchar('lang', { length: 2 }).notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').notNull(),
    isPublished: boolean('isPublished').default(false),
    metaTitle: text('metaTitle'),
    metaDescription: text('metaDescription'),
    ogTitle: text('ogTitle'),
    ogDescription: text('ogDescription'),
    ogImage: text('ogImage'),
    canonicalURL: text('canonicalURL'),
    tags: text('tags').array(),
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})
