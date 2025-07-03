import { media } from './media-schema'
import { boolean, timestamp, pgTable, text } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    lang: text('lang').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    metaTitle: text('metaTitle'),
    metaDescription: text('metaDescription'),
    metaKeywords: text('metaKeywords'),
    coverImageId: text('coverImageId').references((): any => media.id),
    isPublished: boolean('isPublished').default(false),
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})
