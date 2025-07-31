'use client'

import Button from '@src/components/Button'
import { Modal, ModalBody, ModalHeader } from '@src/components/Modal'
import { createGroupAction } from '@src/server/actions/article-groups'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

function GroupsPanel() {
    const t = useTranslations('admin.groups')
    const [openModal, setOpenModal] = useState(false)
    const [groupName, setGroupName] = useState('')

    async function handleCreateGroup() {
        if (!groupName) {
            toast.error(t('groupNameRequired'))
            return
        }

        try {
            const group = await createGroupAction(groupName)
            if (group) {
                toast.success(t('groupCreated', { groupName: group.name }))
                setGroupName('')
                setOpenModal(false)
            } else {
                toast.error(t('groupCreationFailed'))
            }
        } catch (error: unknown) {
            toast.error(
                t('groupCreationError', { error: (error as Error).message }),
            )
        }
    }

    return (
        <>
            <Toaster />
            <Modal isOpen={openModal} onClose={setOpenModal}>
                <ModalHeader onClose={setOpenModal}>
                    <h2 className="text-2xl font-medium">{t('createGroup')}</h2>
                </ModalHeader>
                <ModalBody>
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
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCreateGroup}>
                            {t('createGroup')}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
            <div className="border flex items-center gap-4 p-2">
                <div className="w-auto">
                    <Button onClick={() => setOpenModal(true)}>
                        {t('createGroup')}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default GroupsPanel
