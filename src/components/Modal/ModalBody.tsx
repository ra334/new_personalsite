function ModalBody({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return <div className={`p-2 ${className}`}>{children}</div>
}

export default ModalBody
