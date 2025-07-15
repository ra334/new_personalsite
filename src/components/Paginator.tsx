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
}

async function Pagination({
    currentPage,
    totalPages,
    className,
}: PaginationProps) {
    const t = await getTranslations('paginator')

    function pageHref(page: number): string {
        if (page <= 1) return '/blog'
        if (page > totalPages) return `/blog/pages/${totalPages}`
        return `/blog/pages/${page}`
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <Link
                href={pageHref(1)}
                aria-disabled={currentPage === 1}
                className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
            >
                <ChevronsLeft className="h-4 w-4" />
            </Link>
            <Link
                href={pageHref(currentPage - 1)}
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
                href={pageHref(currentPage + 1)}
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
                href={pageHref(totalPages)}
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
