'use client'

import Button from './Button'
import { Modal, ModalBody, ModalHeader } from './Modal'
import type { Article } from '@/db/models/articles'
import { deleteArticleAction } from '@src/server/actions/articles'
import { format } from 'date-fns'
import { uk, enUS } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface ArticlesListProps {
    articles: Article[]
    isAdmin?: boolean
}

function getFormattedDate(lang: string, date: Date): string {
    return format(date, 'd MMMM yyyy', {
        locale: lang === 'en' ? enUS : uk,
    })
}

function ArticlesList({ articles, isAdmin }: ArticlesListProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

    const t = useTranslations('admin.articles.delete_modal')

    return (
        <> 
            <Toaster />
            <Modal isOpen={isOpen} onClose={setIsOpen}>
                <ModalHeader onClose={setIsOpen}>
                    <h2 className="text-2xl font-medium">{t('title')}</h2>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-6 py-8">
                    <p>
                        {t('message')} {selectedArticle?.title}
                    </p>
                    <div
                        className="flex justify-between gap-3 w-[250px] m-auto"
                        style={{ width: '250px' }}
                    >
                        <Button onClick={async () => {
                            if (selectedArticle) {
                                const deletedArticleSlug = await deleteArticleAction(selectedArticle.slug)
                                
                                
                                if (deletedArticleSlug) {
                                    setIsOpen(false)
                                    toast.success('Article deleted successfully')
                                } else {
                                    toast.error('Failed to delete article')
                                    setIsOpen(false)
                                }
                            }
                            
                        }}>{t('confirm')}</Button>
                        <Button onClick={() => setIsOpen(false)}>
                            {t('cancel')}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

            <ul className="flex flex-col gap-4">
                {articles.map((article, index) => {
                    return (
                        <li key={index}>
                            <article className="border p-4">
                                <Link
                                    href={
                                        isAdmin
                                            ? `/admin/articles/${article.slug}`
                                            : `/${article.lang}/blog/${article.slug}`
                                    }
                                    className="flex justify-between"
                                >
                                    <h2 className="text-xl font-bold pb-3">
                                        {article.title}
                                    </h2>
                                    {isAdmin && article.isPublished ? (
                                        <span>Published</span>
                                    ) : isAdmin && !article.isPublished ? (
                                        <span>Draft</span>
                                    ) : null}
                                </Link>
                                <div className="flex gap-2 pb-3">
                                    <Clock width={16} />
                                    <span className="text-base">
                                        {getFormattedDate(
                                            article.lang,
                                            article.createdAt,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <p>{article.excerpt}</p>
                                    {isAdmin && (
                                        <Button
                                            className="text-red-800 max-h-[32px] !w-[100px] mt-auto"
                                            onClick={() => {
                                                setIsOpen(true)
                                                setSelectedArticle(article)
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </article>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default ArticlesList
