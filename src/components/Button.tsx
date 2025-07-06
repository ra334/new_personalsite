interface ButtonProps {
    className?: string
    onClick?: () => void
    children?: React.ReactNode
}

function Button({ className, onClick, children }: ButtonProps) {
    const classNames = [
        'cursor-pointer',
        'border',
        'border-black',
        'dark:border-white',
        'py-1',
        'px-2',
        'hover:border-slate-500',
        'hover:text-slate-500',
        'w-full',
        className,
    ].join(' ')

    return (
        <button className={classNames} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
