import IconWithTextView from './PublishedView'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const PublishedNode = Node.create({
    name: 'publishedNode',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            text: {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'icon-with-text',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['icon-with-text', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(IconWithTextView)
    },
})
