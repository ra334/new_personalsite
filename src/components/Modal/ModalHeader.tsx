import CrossIcon from '@src/components/svg/CrossIcon'

interface ModalHeaderProps {
    onClose: (value: boolean) => void
    children?: React.ReactNode
}

function ModalHeader({ onClose, children }: ModalHeaderProps) {
    return (
        <div className="flex justify-between items-center border-b pb-2">
            {children}
            <button onClick={() => onClose(false)} className="cursor-pointer">
                <CrossIcon />
            </button>
        </div>
    )
}

export default ModalHeader
