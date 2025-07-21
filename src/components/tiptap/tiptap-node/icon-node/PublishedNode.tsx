import { Node, mergeAttributes } from '@tiptap/core'

export const PublishedNode = Node.create({
    name: 'publishedNode',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            text: {
                default: '',
                parseHTML: (element) => element.getAttribute('text') || '',
                renderHTML: (attributes) => ({ text: attributes.text }),
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
        return [
            'icon-with-text',
            mergeAttributes(HTMLAttributes, {
                class: 'flex items-center gap-2 pb-8',
            }),
            [
                'svg',
                {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '18',
                    height: '18',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    class: 'lucide lucide-clock',
                    viewBox: '0 0 24 24',
                },
                ['circle', { cx: '12', cy: '12', r: '10' }],
                ['polyline', { points: '12 6 12 12 16 14' }],
            ],
            ['span', {}, HTMLAttributes.text ?? ''],
        ]
    },
})
