'use client'

import Button from '@src/components/Button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function Sidebar({
    isWriteNewPage = false,
    preSaveHandler = () => {},
}: {
    isWriteNewPage?: boolean
    preSaveHandler?: (publishValue: boolean, draftValue: boolean) => void
}) {
    const t = useTranslations('admin')
    const router = usePathname()
    const pathWithoutLocale = router.replace(/\/[a-z]{2}\//, '/')
    const [publishValue, setPublishValue] = useState<boolean>(false)
    const [draftValue, setDraftValue] = useState<boolean>(false)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { id, checked } = event.target
        console.log(`Checkbox ${id} changed to ${checked}`)
        if (id === 'publish') {
            if (draftValue) {
                setDraftValue(false)
            }
            setPublishValue(checked)
        } else if (id === 'draft') {
            if (publishValue) {
                setPublishValue(false)
            }
            setDraftValue(checked)
        }
    }

    const sidebarList = [
        {
            name: t('sidebar.dashboard'),
            href: '/admin',
        },
        {
            name: t('sidebar.writeNew'),
            href: '/admin/writenew',
        },
        {
            name: t('sidebar.articles'),
            href: '/admin/articles',
        },
        {
            name: t('sidebar.drafts'),
            href: '/admin/drafts',
        },
        {
            name: t('sidebar.articleIdeas'),
            href: '/admin/articleideas',
        },
    ]

    return (
        <aside className="h-full border">
            <nav className="h-full flex flex-col justify-between">
                <ul className="flex flex-col gap-3 w-48 py-4">
                    {sidebarList.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href}>
                                <span
                                    className={
                                        'hover:bg-gray-400 hover:text-black py-2 px-2 block ' +
                                        (item.href === pathWithoutLocale
                                            ? 'bg-gray-400 text-black'
                                            : '')
                                    }
                                >
                                    {item.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                {isWriteNewPage ? (
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    checked={publishValue}
                                    onChange={handleChange}
                                    type="checkbox"
                                    id="publish"
                                />
                                <label htmlFor="publish">Publish</label>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    checked={draftValue}
                                    onChange={handleChange}
                                    type="checkbox"
                                    id="draft"
                                />
                                <label htmlFor="draft">Draft</label>
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                preSaveHandler(publishValue, draftValue)
                            }
                        >
                            Save
                        </Button>
                    </div>
                ) : null}
            </nav>
        </aside>
    )
}

export default Sidebar
