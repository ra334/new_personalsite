import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface PaginationProps {
    currentPage: number
    totalPages: number
    className?: string
    isAdmin?: boolean
}

async function Pagination({
    currentPage,
    totalPages,
    className,
    isAdmin,
}: PaginationProps) {
    const t = await getTranslations('paginator')

    function pageHref(page: number): string {
        if (page <= 1) return '/blog'
        if (page > totalPages) return `/blog/pages/${totalPages}`
        return `/blog/pages/${page}`
    }

    function adminPageHref(page: number): string {
        if (page <= 1) return '/admin/articles'
        if (page > totalPages) return `/admin/articles/pages/${totalPages}`
        return `/admin/articles/pages/${page}`
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <Link
                href={
                    isAdmin
                        ? adminPageHref(currentPage - 1)
                        : pageHref(currentPage - 1)
                }
                aria-disabled={currentPage === 1}
                className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
            >
                <ChevronsLeft className="h-4 w-4" />
            </Link>
            <Link
                href={
                    isAdmin
                        ? adminPageHref(currentPage - 1)
                        : pageHref(currentPage - 1)
                }
                aria-disabled={currentPage === 1}
                className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            <span>
                {t('page')} {currentPage} {t('of')} {totalPages}
            </span>
            <Link
                href={
                    isAdmin
                        ? adminPageHref(currentPage + 1)
                        : pageHref(currentPage + 1)
                }
                aria-disabled={currentPage === totalPages}
                className={
                    currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                }
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
                href={
                    isAdmin ? adminPageHref(totalPages) : pageHref(totalPages)
                }
                aria-disabled={currentPage === totalPages}
                className={
                    currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                }
            >
                <ChevronsRight className="h-4 w-4" />
            </Link>
        </div>
    )
}

export default Pagination
