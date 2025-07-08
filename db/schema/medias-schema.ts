import {
    timestamp,
    pgTable,
    text,
    uuid,
    boolean,
    pgEnum,
} from 'drizzle-orm/pg-core'

export const mediaTypeEnum = pgEnum('media_type', [
    'image',
    'video',
    'audio',
    'document',
    'archive',
    'other',
])

export const medias = pgTable('medias', {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull().unique(),
    mime: text('mime').notNull(),
    type: mediaTypeEnum('type').notNull(),
    isTemp: boolean('isTemp').notNull().default(true),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})
