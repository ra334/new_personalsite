import Image from '@tiptap/extension-image'
import {
    NodeViewWrapper,
    NodeViewProps,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { useState, useEffect } from 'react'

export const ImageNode = (props: NodeViewProps) => {
    const { src, alt } = props.node.attrs
    const { editor } = props
    const { updateAttributes } = props
    const [imageAlt, setImageAlt] = useState(alt || '')

    useEffect(() => {
        updateAttributes({ alt: imageAlt })
    }, [imageAlt])

    return (
        <NodeViewWrapper className="relative">
            <img src={src} alt={imageAlt} className="m-auto" />
            {editor.isEditable && (
                <input
                    type="text"
                    placeholder="Alt text"
                    defaultValue={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        border: '1px solid black',
                        backgroundColor: 'white',
                        color: 'black',
                    }}
                />
            )}
        </NodeViewWrapper>
    )
}

export default Image.extend({
    addNodeView() {
        return ReactNodeViewRenderer(ImageNode)
    },
})
