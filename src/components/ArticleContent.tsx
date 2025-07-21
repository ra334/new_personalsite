import { tiptapExtensions } from '@src/utils/tiptapSsrConfig'
import { type JSONContent } from '@tiptap/core'
import { generateHTML } from '@tiptap/html/server'

function ArticleContent({ content }: { content: JSONContent }) {
    const html = generateHTML(content, tiptapExtensions)

    return (
        <article
            className="ProseMirror tiptap"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

export default ArticleContent
