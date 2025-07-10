interface ButtonProps {
    className?: string
    onClick?: () => void
    children?: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
}

function Button({ className, onClick, children, type }: ButtonProps) {
    const classNames = [
        'cursor-pointer',
        'border',
        'border-inherit',
        'dark:border-white',
        'py-1',
        'px-2',
        'hover:border-slate-500',
        'hover:text-slate-500',
        'w-full',
        '!bg-white',
        className,
    ].join(' ')

    return (
        <button className={classNames} onClick={onClick} type={type}>
            {children}
        </button>
    )
}

export default Button
