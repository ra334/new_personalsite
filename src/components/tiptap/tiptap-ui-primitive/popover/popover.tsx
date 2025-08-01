'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import '@src/components/tiptap/tiptap-ui-primitive/popover/popover.scss'
import { cn } from '@src/lib/tiptap-utils'
import * as React from 'react'

function Popover({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger {...props} />
}

function PopoverContent({
    className,
    align = 'center',
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                className={cn('tiptap-popover', className)}
                {...props}
            />
        </PopoverPrimitive.Portal>
    )
}

export { Popover, PopoverTrigger, PopoverContent }
