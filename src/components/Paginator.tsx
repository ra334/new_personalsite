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
    basePath: string
}

async function Pagination({
    currentPage,
    totalPages,
    className,
    basePath,
}: PaginationProps) {
    const t = await getTranslations('paginator')

    function pageHref(page: number): string {
        if (page <= 1) return `${basePath}`
        if (totalPages < page) return `${basePath}/pages/${currentPage}`
        return `${basePath}/pages/${page}`
    }

    const isFirst = currentPage === 1
    const isLast = currentPage === totalPages

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <Link
                href={pageHref(1)}
                aria-disabled={isFirst}
                className={isFirst ? 'pointer-events-none opacity-50' : ''}
            >
                <ChevronsLeft className="h-4 w-4" />
            </Link>
            <Link
                href={pageHref(currentPage - 1)}
                aria-disabled={isFirst}
                className={isFirst ? 'pointer-events-none opacity-50' : ''}
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            <span>
                {t('page')} {currentPage} {t('of')} {totalPages}
            </span>
            <Link
                href={pageHref(currentPage + 1)}
                aria-disabled={isLast}
                className={isLast ? 'pointer-events-none opacity-50' : ''}
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
                href={pageHref(totalPages)}
                aria-disabled={isLast}
                className={isLast ? 'pointer-events-none opacity-50' : ''}
            >
                <ChevronsRight className="h-4 w-4" />
            </Link>
        </div>
    )
}

export default Pagination
