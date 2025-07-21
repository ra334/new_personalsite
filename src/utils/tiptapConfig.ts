import CustomImage from '@src/components/tiptap/tiptap-node/customImage-node/Image'
import { PublishedNode } from '@src/components/tiptap/tiptap-node/icon-node/PublishedNode'
import { ImageUploadNode } from '@src/components/tiptap/tiptap-node/image-upload-node'
import { MAX_FILE_SIZE } from '@src/lib/tiptap-utils'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Link } from '@tiptap/extension-link'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import rust from 'highlight.js/lib/languages/rust'
import ts from 'highlight.js/lib/languages/typescript'
import verilog from 'highlight.js/lib/languages/verilog'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'

export const lowlight = createLowlight()
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
        formData.append('fileName', file.name)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/blog/uploads/temp', true)

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

        abortSignal?.addEventListener('abort', () => xhr.abort())

        xhr.send(formData)
    })
}

export const tiptapExtensions = [
    StarterKit.configure({
        codeBlock: false,
    }),
    TaskList,
    TaskItem,
    CodeBlockLowlight.configure({ lowlight }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Superscript,
    Subscript,
    CustomImage,
    ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        upload: uploadImage,
        onError: (error) => console.error('Upload failed:', error),
    }),
    PublishedNode,
]
