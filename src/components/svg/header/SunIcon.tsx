interface SunIconProps {
    width?: number
    height?: number
}

function SunIcon({ width = 20, height = 20 }: SunIconProps) {
    return (
        <svg
            width={width + 'px'}
            height={height + 'px'}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_2_2)">
                <path
                    d="M7.99996 11.3333C9.84091 11.3333 11.3333 9.84095 11.3333 8C11.3333 6.15905 9.84091 4.66666 7.99996 4.66666C6.15901 4.66666 4.66663 6.15905 4.66663 8C4.66663 9.84095 6.15901 11.3333 7.99996 11.3333Z"
                    stroke="white"
                    strokeWidth="0.88"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M7.99996 0.666664V2M7.99996 14V15.3333M2.79996 2.8L3.73329 3.73333M12.2666 12.2667L13.2 13.2M0.666626 8H1.99996M14 8H15.3333M2.79996 13.2L3.73329 12.2667M12.2666 3.73333L13.2 2.8"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_2_2">
                    <rect
                        width={width + 'px'}
                        height={height + 'px'}
                        fill="white"
                    />
                </clipPath>
            </defs>
        </svg>
    )
}

export default SunIcon
