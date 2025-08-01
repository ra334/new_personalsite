'use client'

import { useListDropdownMenu } from './use-list-dropdown-menu'
// --- Icons ---
import { ChevronDownIcon } from '@src/components/tiptap/tiptap-icons/chevron-down-icon'
// --- UI Primitives ---
import type { ButtonProps } from '@src/components/tiptap/tiptap-ui-primitive/button'
import {
    Button,
    ButtonGroup,
} from '@src/components/tiptap/tiptap-ui-primitive/button'
import { Card, CardBody } from '@src/components/tiptap/tiptap-ui-primitive/card'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@src/components/tiptap/tiptap-ui-primitive/dropdown-menu'
// --- Tiptap UI ---
import {
    ListButton,
    type ListType,
} from '@src/components/tiptap/tiptap-ui/list-button'
// --- Hooks ---
import { useTiptapEditor } from '@src/hooks/use-tiptap-editor'
import { type Editor } from '@tiptap/react'
import * as React from 'react'

export interface ListDropdownMenuProps extends Omit<ButtonProps, 'type'> {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor
    /**
     * The list types to display in the dropdown.
     */
    types?: ListType[]
    /**
     * Whether the dropdown should be hidden when no list types are available
     * @default false
     */
    hideWhenUnavailable?: boolean
    /**
     * Callback for when the dropdown opens or closes
     */
    onOpenChange?: (isOpen: boolean) => void
    /**
     * Whether to render the dropdown menu in a portal
     * @default false
     */
    portal?: boolean
}

export function ListDropdownMenu({
    editor: providedEditor,
    types = ['bulletList', 'orderedList', 'taskList'],
    hideWhenUnavailable = false,
    onOpenChange,
    portal = false,
    ...props
}: ListDropdownMenuProps) {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = React.useState(false)

    const { filteredLists, canToggle, isActive, isVisible, Icon } =
        useListDropdownMenu({
            editor,
            types,
            hideWhenUnavailable,
        })

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => {
            setIsOpen(open)
            onOpenChange?.(open)
        },
        [onOpenChange],
    )

    if (!isVisible || !editor || !editor.isEditable) {
        return null
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={isActive ? 'on' : 'off'}
                    role="button"
                    tabIndex={-1}
                    disabled={!canToggle}
                    data-disabled={!canToggle}
                    aria-label="List options"
                    tooltip="List"
                    {...props}
                >
                    <Icon className="tiptap-button-icon" />
                    <ChevronDownIcon className="tiptap-button-dropdown-small" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" portal={portal}>
                <Card>
                    <CardBody>
                        <ButtonGroup>
                            {filteredLists.map((option) => (
                                <DropdownMenuItem key={option.type} asChild>
                                    <ListButton
                                        editor={editor}
                                        type={option.type}
                                        text={option.label}
                                        showTooltip={false}
                                    />
                                </DropdownMenuItem>
                            ))}
                        </ButtonGroup>
                    </CardBody>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ListDropdownMenu
