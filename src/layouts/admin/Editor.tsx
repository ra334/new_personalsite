'use client'

import '@src/components/tiptap/tiptap-node/code-block-node/code-block-node.scss'
import '@src/components/tiptap/tiptap-node/list-node/list-node.scss'
import '@src/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss'
import '@src/styles/_keyframe-animations.scss'
import '@src/styles/_variables.scss'
import '@src/styles/lowlight.scss'
import '@src/styles/style.scss'
import { tiptapExtensions } from '@src/utils/tiptapConfig'
import {
    useEditor,
    EditorContent,
    type Editor as EditorType,
    JSONContent,
} from '@tiptap/react'
import { useEffect } from 'react'

function Editor({
    setEditor,
    isEditable = true,
    content = '<p>Write new article</p>',
    immediatelyRender = true,
}: {
    setEditor?: (editor: EditorType | null) => void
    isEditable?: boolean
    content?: JSONContent | string
    immediatelyRender: boolean
}) {
    const editor = useEditor({
        editable: isEditable,
        immediatelyRender,
        extensions: tiptapExtensions,
        content,
    })

    useEffect(() => {
        if (editor && setEditor) {
            setEditor(editor)
        }

        return () => {
            if (setEditor) {
                setEditor(null)
            }
        }
    }, [editor, setEditor])

    return <EditorContent editor={editor} className="control-showcase" />
}

export default Editor
