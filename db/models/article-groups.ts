import { db } from '../postgress'
import { groups } from '../schema/article-groups'
import { eq, count, and } from 'drizzle-orm'

export interface Group {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export async function createGroup(name: string): Promise<Group> {
    const [group] = await db
        .insert(groups)
        .values({
            name,
        })
        .returning()

    return group
}

export async function getGroupById(id: string): Promise<Group | undefined> {
    const group = await db.query.groups.findFirst({
        where: eq(groups.id, id),
    })

    return group
}

export async function getGroups(): Promise<Group[]> {
    const groups = await db.query.groups.findMany()
    return groups
}

export async function getGroupsPagenated(
    offset: number = 0,
    limit: number = 10,
): Promise<Group[]> {
    const groupList = await db.select().from(groups).limit(limit).offset(offset)

    return groupList
}

export async function updateGroup({
    id,
    name,
}: {
    id: string
    name: string
}): Promise<Group | undefined> {
    const [group] = await db
        .update(groups)
        .set({ name })
        .where(eq(groups.id, id))
        .returning()

    return group
}

export async function countAllGroups(): Promise<number> {
    const result = await db.select({ value: count() }).from(groups)

    return result[0].value
}

export async function deleteGroup(id: string): Promise<Group | undefined> {
    const group = await db.delete(groups).where(eq(groups.id, id)).returning()

    return group[0]
}
