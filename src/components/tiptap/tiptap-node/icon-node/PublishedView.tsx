import { NodeViewWrapper } from '@tiptap/react'
import { Clock } from 'lucide-react'

export default function IconWithTextView({ node }: { node: any }) {
    return (
        <NodeViewWrapper className="flex items-center gap-2 pb-8">
            <Clock className="block" width={18} />
            <span className="m">{node.attrs.text}</span>
        </NodeViewWrapper>
    )
}
