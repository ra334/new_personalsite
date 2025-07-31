'use client'

import { useEffect, useState } from 'react'

export interface MenuItem {
    value: string
    label: string
}

export interface DropdownProps {
    items: MenuItem[]
    selected?: MenuItem | null
    id?: string
    placeholder?: string
    onChange?: (item: MenuItem) => void
}

function Dropdown({
    items,
    selected,
    id,
    placeholder,
    onChange,
}: DropdownProps) {
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(
        selected || null,
    )
    const [isOpen, setIsOpen] = useState(false)

    function handleItemClick(item: MenuItem) {
        setSelectedItem(item)
        onChange?.(item)
        setIsOpen(false)
    }

    return (
        <div
            id={id || ''}
            className="border p-1 cursor-pointer relative select-none"
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="my-10">
                {selectedItem?.label || placeholder || 'Select an option'}
            </span>
            <ul
                className={`absolute top-9 left-0 border w-full max-h-[160px] overflow-y-auto bg-black p-1 ${isOpen ? 'block' : 'hidden'}`}
            >
                {items.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className="hover:text-gray-800"
                            onClick={() => handleItemClick(item)}
                        >
                            {item.label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Dropdown
