'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ArticlesFilterPanelProps {
    lang?: string
    publishedSatatus?: string
}

function ArticlesFilterPanel({
    lang,
    publishedSatatus,
}: ArticlesFilterPanelProps) {
    const router = useRouter()
    const params = useSearchParams()

    const [isPublishedValue, setIsPublishedValue] = useState(
        publishedSatatus === 'published',
    )
    const [isDraftValue, setIsDraftValue] = useState(
        publishedSatatus === 'draft',
    )
    const [language, setLanguage] = useState(lang)

    useEffect(() => {
        function updateFilters() {
            const query = new URLSearchParams(String(params))
            if (language) {
                query.set('lang', language)
            } else if (
                (!isPublishedValue && !isDraftValue) ||
                (isPublishedValue && isDraftValue)
            ) {
                query.delete('publishedStatus')
            } else if (isPublishedValue) {
                query.set('publishedStatus', 'published')
            } else if (isDraftValue) {
                query.set('publishedStatus', 'draft')
            } else {
                query.set('publishedStatus', 'all')
            }

            console.log('Updated query:', query.toString())

            router.push(`/admin/articles?${query.toString()}`)
        }

        updateFilters()
    }, [language, isPublishedValue, isDraftValue])

    return (
        <div className="border flex items-center gap-4 p-2">
            <div className="flex items-center gap-2">
                <label htmlFor="language">Language: </label>
                <input
                    type="text"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="
                        rounded-none border
                        border-black
                        dark:border-white
                        p-1
                        text-sm
                        hover:border-slate-500
                        focus:border-slate-500
                        focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="isPublished">Is Published: </label>
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublishedValue}
                    onChange={(e) => setIsPublishedValue(e.target.checked)}
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="isDraft">Is Draft: </label>
                <input
                    type="checkbox"
                    id="isDraft"
                    checked={isDraftValue}
                    onChange={(e) => setIsDraftValue(e.target.checked)}
                />
            </div>
        </div>
    )
}

export default ArticlesFilterPanel
