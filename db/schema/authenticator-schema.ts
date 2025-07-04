import { users } from './users-schema'
import {
    pgTable,
    text,
    integer,
    boolean,
    primaryKey,
} from 'drizzle-orm/pg-core'

export const authenticators = pgTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: boolean('credentialBackedUp').notNull(),
        transports: text('transports'),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ],
)
