import { media } from './media-schema'
import {
    boolean,
    timestamp,
    pgTable,
    text,
    jsonb,
    uuid,
} from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    lang: text('lang').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: jsonb('content').notNull(),
    metaTitle: text('metaTitle'),
    metaDescription: text('metaDescription'),
    metaKeywords: text('metaKeywords'),
    coverImageId: uuid('coverImageId').references(() => media.id),
    isPublished: boolean('isPublished').default(false),
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})
