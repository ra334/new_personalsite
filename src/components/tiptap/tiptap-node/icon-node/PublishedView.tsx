import { NodeViewWrapper } from '@tiptap/react'
import { Clock } from 'lucide-react'

interface Props {
    node: {
        attrs: {
            text: string
        }
    }
}

export default function IconWithTextView({ node }: Props) {
    return (
        <NodeViewWrapper className="flex items-center gap-2 pb-8">
            <Clock className="block" width={18} />
            <span className="m">{node.attrs.text}</span>
        </NodeViewWrapper>
    )
}
