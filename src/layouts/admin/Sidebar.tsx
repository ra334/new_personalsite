'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Sidebar() {
    const t = useTranslations('admin')
    const router = usePathname()
    const pathWithoutLocale = router.replace(/\/[a-z]{2}\//, '/')

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
        <aside className="h-full">
            <nav className="h-full">
                <ul className="border flex flex-col gap-3 w-48 h-full py-4">
                    {sidebarList.map((item, index) => (
                        <Link href={item.href} key={index}>
                            <li
                                className={
                                    'hover:bg-gray-400 hover:text-black py-2 px-2 ' +
                                    (item.href === pathWithoutLocale
                                        ? 'bg-gray-400 text-black'
                                        : '')
                                }
                            >
                                {item.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
