'use client'

import { type Article } from '@/db/models/articles'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { updateArticleAction } from '@src/server/actions/articles'
import { cleanTempDirectoryAction } from '@src/server/actions/articles'
import { type JSONContent } from '@tiptap/core'
import { type Editor as EditorType } from '@tiptap/react'
import { useState, useEffect } from 'react'
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
    excerpt: z.string().min(1, { message: 'Excerpt is required' }),
})

type FormData = z.infer<typeof schema>

interface UpdateArticleClientWrapperProps {
    article: Article
}

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
    {
        label: 'Excerpt',
        placeholder: 'excerpt',
        id: 'excerpt',
    },
]

function UpdateArticleClientWrapper({
    article,
}: UpdateArticleClientWrapperProps) {
    const [editor, setEditor] = useState<EditorType | null>(null)
    const [visible, setVisible] = useState(false)
    const [publishValue, setPublishValue] = useState<boolean>(false)
    const [draftValue, setDraftValue] = useState<boolean>(false)
    const [checkboxLoaded, setCheckboxLoaded] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            lang: article.lang,
            metaTitle: article.metaTitle || '',
            metaDescription: article.metaDescription || '',
            ogTitle: article.ogTitle || '',
            ogDescription: article.ogDescription || '',
            excerpt: article.excerpt || '',
        },
    })

    useEffect(() => {
        function cleanTemp() {
            cleanTempDirectoryAction().catch((error) => {
                console.error('Failed to clean temporary directory:', error)
                toast.error('Failed to clean temporary directory')
            })

            console.log('Temporary directory cleaned')
        }
        cleanTemp()

        function setPublishState() {
            if (article.isPublished) {
                setPublishValue(true)
            } else {
                setDraftValue(true)
            }

            setCheckboxLoaded(true)
        }

        setPublishState()
    }, [])

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

        const updatedArticle = await updateArticleAction(article.slug, {
            ...formData,
            content: JSON.stringify(content),
            isPublished: publishValue,
            title,
        })

        if (updatedArticle) {
            toast.success('Article updated successfully')
            setVisible(false)
            setPublishValue(false)
            setDraftValue(false)
        } else {
            toast.error('Failed to update article')
        }
    }

    function preSaveHandler(publishValue: boolean, draftValue: boolean) {
        setPublishValue(publishValue)
        setDraftValue(draftValue)
        setVisible(true)
    }

    return (
        <div className="container h-screen flex flex-col pb-3">
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
            <div className="border container p-2 mb-3 flex flex-1 gap-2 overflow-y-auto">
                {checkboxLoaded && (
                    <Sidebar
                        defaultDraftValue={draftValue}
                        defaultPublishValue={publishValue}
                        isWriteNewPage={true}
                        preSaveHandler={preSaveHandler}
                    />
                )}
                <main className="h-full w-full flex justify-center items-center">
                    <div className="h-full w-full overflow-auto">
                        <Editor
                            setEditor={setEditor}
                            content={article?.content}
                            immediatelyRender={false}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default UpdateArticleClientWrapper
