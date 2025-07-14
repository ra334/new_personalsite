'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import '@src/app/globals.css'
import Button from '@src/components/Button'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@src/components/Modal'
import Editor from '@src/layouts/admin/Editor'
import EditorToolBar from '@src/layouts/admin/EditorToolBar'
import Sidebar from '@src/layouts/admin/Sidebar'
import { createArticleAction } from '@src/server/actions/articles'
import { type JSONContent } from '@tiptap/core'
import { type Editor as EditorType } from '@tiptap/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { z } from 'zod'

const schema = z.object({
    lang: z
        .string()
        .length(2, { message: 'Language must be 2 characters long' }),
    metaTitle: z.string().min(1, { message: 'Meta title is required' }),
    metaDescription: z
        .string()
        .min(1, { message: 'Meta description is required' }),
    ogTitle: z.string().min(1, { message: 'OG title is required' }),
    ogDescription: z.string().min(1, { message: 'OG description is required' }),
})

type FormData = z.infer<typeof schema>

interface Item {
    label: string
    placeholder: string
    id: string
}

const modalBodyContent: Item[] = [
    {
        label: 'Lang',
        placeholder: 'lang',
        id: 'lang',
    },
    {
        label: 'Meta Title',
        placeholder: 'meta title',
        id: 'metaTitle',
    },
    {
        label: 'Meta Description',
        placeholder: 'meta description',
        id: 'metaDescription',
    },
    {
        label: 'OG Title',
        placeholder: 'og title',
        id: 'ogTitle',
    },
    {
        label: 'OG Description',
        placeholder: 'og description',
        id: 'ogDescription',
    },
]

function WriteNewPage() {
    const [editor, setEditor] = useState<EditorType | null>(null)
    const [visible, setVisible] = useState(false)
    const [publishValue, setPublishValue] = useState<boolean>(false)
    const [draftValue, setDraftValue] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    function getTitle(jsonContent: JSONContent): string {
        if (!jsonContent.content?.length) return ''

        for (const node of jsonContent.content) {
            if (node.type === 'heading' && node.attrs?.level === 1) {
                return node.content?.[0]?.text || ''
            }
        }

        return ''
    }

    async function handleSave(formData: FormData) {
        const content = editor?.getJSON()

        if (!content || Object.keys(content).length === 0) {
            toast.error('Content is required')
            return
        }

        const title = getTitle(content)

        if (!title) {
            toast.error('Title is required')
            return
        }

        const article = await createArticleAction({
            ...formData,
            content,
            isPublished: publishValue,
            title,
        })
        if (article) {
            toast.success('Article created successfully')
            setVisible(false)
            setPublishValue(false)
            setDraftValue(false)
        } else {
            toast.error('Failed to create article')
        }
    }

    function preSaveHandler(publishValue: boolean, draftValue: boolean) {
        setPublishValue(publishValue)
        setDraftValue(draftValue)
        setVisible(true)
    }

    return (
        <div className="container h-screen flex flex-col">
            <Toaster />
            <Modal onClose={setVisible} isOpen={visible}>
                <ModalContent>
                    <ModalHeader onClose={setVisible}>
                        <span className="text-2xl font-medium">SEO data</span>
                    </ModalHeader>
                    <ModalBody>
                        <form
                            className="w-[600px] flex flex-col gap-6"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <ul className="grid grid-cols-2 col-span-2 gap-3">
                                {modalBodyContent.map((item: Item) => (
                                    <li key={item.id} className="mb-2">
                                        <label
                                            htmlFor={item.id}
                                            className="block mb-1"
                                        >
                                            {item.label}
                                        </label>
                                        <input
                                            className={`w-full
                                                rounded-none
                                                border
                                                border-white
                                                p-1
                                                text-sm
                                                hover:border-slate-500
                                                focus:border-slate-500
                                                focus:outline-none ${errors[item.id as keyof FormData] ? 'border-red-500' : ''}`}
                                            id={item.id}
                                            placeholder={item.placeholder}
                                            {...register(
                                                item.id as keyof FormData,
                                            )}
                                        />
                                        {errors[item.id as keyof FormData] && (
                                            <span className="text-red-500 text-sm">
                                                {
                                                    errors[
                                                        item.id as keyof FormData
                                                    ]?.message
                                                }
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <Button type="submit">Save</Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className="my-2">
                <EditorToolBar editor={editor} />
            </div>
            <div className="border flex flex-grow overflow-y-auto p-2 mb-2">
                <Sidebar
                    isWriteNewPage={true}
                    preSaveHandler={preSaveHandler}
                />
                <main className="justify-center items-center w-full pl-2">
                    <div className="h-full overflow-auto">
                        <Editor
                            setEditor={setEditor}
                            immediatelyRender={true}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default WriteNewPage
