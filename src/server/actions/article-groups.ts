'use server'

import type { Group } from '@/db/models/article-groups'
import {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    getGroups,
} from '@/db/models/article-groups'
import { auth } from '@src/auth'
import z from 'zod'

export async function createGroupAction(
    name: string,
): Promise<Group | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const groupSchema = z.object({
        name: z.string().min(1, 'Group name is required'),
    })

    const parsed = groupSchema.safeParse({ name })

    if (!parsed.success) {
        console.error('Invalid group name:', parsed.error)
        return undefined
    }

    const group = await createGroup(parsed.data.name)

    return group
}

export async function changeGroupNameAction(
    id: string,
    name: string,
): Promise<Group | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const groupSchema = z.object({
        id: z.uuid(),
        name: z.string().min(1, 'Group name is required'),
    })

    const parsed = groupSchema.safeParse({ id, name })

    if (!parsed.success) {
        console.error('Invalid group data:', parsed.error)
        return undefined
    }

    const updatedGroup = await updateGroup(parsed.data)

    return updatedGroup
}

export async function deleteGroupAction(
    id: string,
): Promise<string | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const groupSchema = z.object({
        id: z.uuid(),
    })

    const parsed = groupSchema.safeParse({ id })

    if (!parsed.success) {
        console.error('Invalid group ID:', parsed.error)
        return undefined
    }

    const group = await deleteGroup(parsed.data.id)

    return group?.id
}

export async function getGroupByIdAction(id: string) {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const groupSchema = z.object({
        id: z.uuid(),
    })

    const parsed = groupSchema.safeParse({ id })

    if (!parsed.success) {
        console.error('Invalid group ID:', parsed.error)
        return undefined
    }

    const group = await getGroupById(parsed.data.id)
    return group
}

export async function getAllGroupsAction(): Promise<Group[] | undefined> {
    const session = await auth()

    if (!session || !session.user) {
        console.error('User is not authenticated')
        return undefined
    }

    const groups = await getGroups()
    return groups
}
