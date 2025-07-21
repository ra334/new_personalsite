import { PublishedNode } from '@src/components/tiptap/tiptap-node/icon-node/PublishedNode'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Image } from '@tiptap/extension-image'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
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
    PublishedNode,
    Image,
]
