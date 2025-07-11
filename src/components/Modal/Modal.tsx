interface ModalProps {
    isOpen: boolean
    onClose: (value: boolean) => void
    children?: React.ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null

    return (
        <div
            onClick={() => onClose(false)}
            className="
                absolute
                top-0
                left-0
                z-11
                flex
                justify-center
                items-center
                w-full
                h-full
                dark:bg-gray-900
                bg-black opacity-90
                text-white"
        >
            <div className="" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal
