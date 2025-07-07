'use client'

import '@src/components/tiptap/tiptap-node/code-block-node/code-block-node.scss'
import { ImageUploadNode } from '@src/components/tiptap/tiptap-node/image-upload-node'
import '@src/components/tiptap/tiptap-node/list-node/list-node.scss'
import '@src/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss'
import { handleImageUpload, MAX_FILE_SIZE } from '@src/lib/tiptap-utils'
import '@src/styles/_keyframe-animations.scss'
import '@src/styles/_variables.scss'
import '@src/styles/lowlight.scss'
import '@src/styles/style.scss'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import {
    useEditor,
    EditorContent,
    type Editor as EditorType,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import rust from 'highlight.js/lib/languages/rust'
import ts from 'highlight.js/lib/languages/typescript'
import verilog from 'highlight.js/lib/languages/verilog'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import { useEffect } from 'react'

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('json', json)
lowlight.register('rust', rust)
lowlight.register('verilog', verilog)

export async function uploadImage(
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal,
): Promise<string> {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            return reject(
                new Error(
                    `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`,
                ),
            )
        }

        const formData = new FormData()
        formData.append('file', file)

        const xhr = new XMLHttpRequest()

        xhr.open('POST', '/api/uploads/temp', true)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100)
                onProgress({ progress: percent })
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText)
                    resolve(json.url)
                } catch (err) {
                    reject(new Error('Invalid response format'))
                }
            } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`))
            }
        }

        xhr.onerror = () => reject(new Error('Upload failed'))

        xhr.onabort = () => reject(new Error('Upload cancelled'))

        abortSignal?.addEventListener('abort', () => {
            xhr.abort()
        })

        xhr.send(formData)
    })
}

function Editor({
    setEditor,
}: {
    setEditor?: (editor: EditorType | null) => void
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem,
            CodeBlockLowlight.configure({ lowlight }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            Superscript,
            Subscript,
            Link,
            Image,
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                upload: uploadImage,
                onError: (error) => console.error('Upload failed:', error),
            }),
        ],
        content: `<p>Write new article</p>`,
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
