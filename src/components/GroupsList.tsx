'use client'

import Button from './Button'
import { Modal, ModalBody, ModalHeader } from './Modal'
import type { Group } from '@/db/models/article-groups'
import {
    changeGroupNameAction,
    deleteGroupAction,
    getArticleByIdAction,
} from '@src/server/actions/article-groups'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface GroupsListProps {
    groups: Group[]
}

function getFormattedDate(lang: string, date: Date): string {
    return format(date, 'd MMMM yyyy', {
        locale: lang === 'en' ? enUS : uk,
    })
}

function GroupsList({ groups }: GroupsListProps) {
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const [groupName, setGroupName] = useState<string>('')

    const t_modal = useTranslations('admin.groups.delete_modal')
    const t = useTranslations('admin.groups')
    const locale = useLocale()

    useEffect(() => {
        async function getName() {
            if (isOpenEdit && selectedGroup) {
                const group = await getArticleByIdAction(selectedGroup.id)
                if (group?.name) {
                    setGroupName(group?.name)
                }
            }
        }

        getName()
    }, [isOpenEdit])

    return (
        <>
            <Toaster />
            <Modal isOpen={isOpenDelete} onClose={setIsOpenDelete}>
                <ModalHeader onClose={setIsOpenDelete}>
                    <h2 className="text-2xl font-medium">{t_modal('title')}</h2>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-6 py-8">
                    <div
                        className="flex justify-between gap-3 w-[250px] m-auto"
                        style={{ width: '250px' }}
                    >
                        <Button
                            onClick={async () => {
                                if (selectedGroup) {
                                    const deletedGroupId =
                                        await deleteGroupAction(
                                            selectedGroup.id,
                                        )

                                    if (deletedGroupId) {
                                        setIsOpenDelete(false)
                                        toast.success(t('groupSuccessDeleted'))
                                    } else {
                                        toast.error(t('groupFailedDeleted'))
                                        setIsOpenDelete(false)
                                    }
                                }
                            }}
                        >
                            {t_modal('confirm')}
                        </Button>
                        <Button onClick={() => setIsOpenDelete(false)}>
                            {t_modal('cancel')}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

            {/* edit group modal */}

            <Modal isOpen={isOpenEdit} onClose={setIsOpenEdit}>
                <ModalHeader onClose={setIsOpenEdit}>
                    <h2 className="text-2xl font-medium">{t('editGroup')}</h2>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-6 py-8">
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex gap-3 items-center">
                            <label htmlFor="group_name">{t('groupName')}</label>
                            <input
                                className="
                                    w-full
                                    rounded-none
                                    border
                                    border-white
                                    p-1
                                    text-sm
                                    hover:border-slate-500
                                    focus:border-slate-500
                                    focus:outline-none"
                                id="group_name"
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={async () => {
                            if (selectedGroup?.id) {
                                const group = await changeGroupNameAction(
                                    selectedGroup.id,
                                    groupName,
                                )

                                if (group) {
                                    setIsOpenEdit(false)
                                    toast.success(t('groupSuccessUpdated'))
                                } else {
                                    toast.error(t('groupFailedUpdate'))
                                    setIsOpenEdit(false)
                                }
                            }
                        }}
                    >
                        {t('saveGroup')}
                    </Button>
                </ModalBody>
            </Modal>

            <ul className="flex flex-col gap-4">
                {!groups.length && (
                    <li className="text-center text-gray-500">
                        {t('noGroups')}
                    </li>
                )}
                {groups.map((group, index) => {
                    return (
                        <li key={index}>
                            <div className="border p-4 flex justify-between">
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-medium pb-2.5">
                                        {group.name}
                                    </h2>
                                    <div className="flex gap-2">
                                        <Clock width={16} />
                                        <span className="text-base">
                                            {getFormattedDate(
                                                locale,
                                                group.createdAt,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-nowrap gap-2">
                                    <Button
                                        className="text-red-800 max-h-[32px] mt-auto"
                                        onClick={() => {
                                            setIsOpenDelete(true)
                                            setSelectedGroup(group)
                                        }}
                                    >
                                        {t('deleteGroup')}
                                    </Button>
                                    <Button
                                        className="text-red-800 max-h-[32px] mt-auto whitespace-nowrap"
                                        onClick={() => {
                                            setIsOpenEdit(true)
                                            setSelectedGroup(group)
                                        }}
                                    >
                                        {t('editGroup')}
                                    </Button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default GroupsList
