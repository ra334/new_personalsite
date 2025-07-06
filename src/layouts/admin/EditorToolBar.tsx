import {
    Toolbar,
    ToolbarGroup,
} from '@src/components/tiptap/tiptap-ui-primitive/toolbar/index'
import { BlockquoteButton } from '@src/components/tiptap/tiptap-ui/blockquote-button/index'
import { CodeBlockButton } from '@src/components/tiptap/tiptap-ui/code-block-button'
import { HeadingButton } from '@src/components/tiptap/tiptap-ui/heading-button/index'
import { ImageUploadButton } from '@src/components/tiptap/tiptap-ui/image-upload-button'
import { LinkPopover } from '@src/components/tiptap/tiptap-ui/link-popover'
import { ListButton } from '@src/components/tiptap/tiptap-ui/list-button'
import { MarkButton } from '@src/components/tiptap/tiptap-ui/mark-button'
import { TextAlignButton } from '@src/components/tiptap/tiptap-ui/text-align-button'
import { type Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'

const toolbarElements = [
    [
        {
            component: HeadingButton,
            props: { level: 1 },
        },
        {
            component: HeadingButton,
            props: { level: 2 },
        },
        {
            component: HeadingButton,
            props: { level: 3 },
        },
        {
            component: HeadingButton,
            props: { level: 4 },
        },
    ],
    [
        {
            component: BlockquoteButton,
            props: {},
        },
        {
            component: LinkPopover,
            props: {},
        },
        {
            component: CodeBlockButton,
            props: {},
        },
        {
            component: ImageUploadButton,
            props: {},
        },
    ],
    [
        {
            component: ListButton,
            props: { type: 'bulletList' },
        },
        {
            component: ListButton,
            props: { type: 'orderedList' },
        },
        {
            component: ListButton,
            props: { type: 'taskList' },
        },
    ],
    [
        {
            component: TextAlignButton,
            props: { align: 'left' },
        },
        {
            component: TextAlignButton,
            props: { align: 'center' },
        },
        {
            component: TextAlignButton,
            props: { align: 'right' },
        },
        {
            component: TextAlignButton,
            props: { align: 'justify' },
        },
    ],
    [
        {
            component: MarkButton,
            props: { type: 'bold' },
        },
        {
            component: MarkButton,
            props: { type: 'italic' },
        },
        {
            component: MarkButton,
            props: { type: 'strike' },
        },
        {
            component: MarkButton,
            props: { type: 'code' },
        },
        {
            component: MarkButton,
            props: { type: 'underline' },
        },
        {
            component: MarkButton,
            props: { type: 'superscript' },
        },
        {
            component: MarkButton,
            props: { type: 'subscript' },
        },
    ],
]

interface EditorToolBarProps {
    editor: Editor | null
    key?: number
    type?: string
    align?: string
    level?: number
}

function EditorToolBar({ editor }: { editor: Editor | null }) {
    const [, setForceUpdate] = useState({})

    useEffect(() => {
        if (!editor) return

        function handleUpdate() {
            setForceUpdate({})
        }

        editor.on('update', handleUpdate)
        editor.on('selectionUpdate', handleUpdate)

        return () => {
            editor.off('update', handleUpdate)
            editor.off('selectionUpdate', handleUpdate)
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border">
            <Toolbar className="flex justify-between">
                {toolbarElements.map((group, index) => (
                    <ToolbarGroup key={index} className="border">
                        {group.map((item, itemIndex) => {
                            const Component =
                                item.component as React.ComponentType<EditorToolBarProps>
                            return (
                                <Component
                                    key={itemIndex}
                                    editor={editor}
                                    {...(item.props || {})}
                                />
                            )
                        })}
                    </ToolbarGroup>
                ))}
            </Toolbar>
        </div>
    )
}

export default EditorToolBar
