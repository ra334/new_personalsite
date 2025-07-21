'use client'

import { Badge } from '@src/components/tiptap/tiptap-ui-primitive/badge'
// --- UI Primitives ---
import type { ButtonProps } from '@src/components/tiptap/tiptap-ui-primitive/button'
import { Button } from '@src/components/tiptap/tiptap-ui-primitive/button'
// --- Tiptap UI ---
import type {
    Level,
    UseHeadingConfig,
} from '@src/components/tiptap/tiptap-ui/heading-button'
import {
    HEADING_SHORTCUT_KEYS,
    useHeading,
} from '@src/components/tiptap/tiptap-ui/heading-button'
import { useTiptapEditor } from '@src/hooks/use-tiptap-editor'
// --- Lib ---
import { parseShortcutKeys } from '@src/lib/tiptap-utils'
import * as React from 'react'

export interface HeadingButtonProps
    extends Omit<ButtonProps, 'type'>,
        UseHeadingConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean
}

export function HeadingShortcutBadge({
    level,
    shortcutKeys = HEADING_SHORTCUT_KEYS[level],
}: {
    level: Level
    shortcutKeys?: string
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>
}

/**
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = React.forwardRef<
    HTMLButtonElement,
    HeadingButtonProps
>(
    (
        {
            editor: providedEditor,
            level,
            text,
            hideWhenUnavailable = false,
            onToggled,
            showShortcut = false,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor)
        const {
            isVisible,
            canToggle,
            isActive,
            handleToggle,
            label,
            Icon,
            shortcutKeys,
        } = useHeading({
            editor,
            level,
            hideWhenUnavailable,
            onToggled,
        })

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event)
                if (event.defaultPrevented) return
                handleToggle()
            },
            [handleToggle, onClick],
        )

        if (!isVisible) {
            return null
        }

        return (
            <Button
                type="button"
                data-style="ghost"
                data-active-state={isActive ? 'on' : 'off'}
                role="button"
                tabIndex={-1}
                disabled={!canToggle}
                data-disabled={!canToggle}
                aria-label={label}
                aria-pressed={isActive}
                tooltip={label}
                onClick={handleClick}
                {...buttonProps}
                ref={ref}
            >
                {children ?? (
                    <>
                        <Icon className="tiptap-button-icon" />
                        {text && (
                            <span className="tiptap-button-text">{text}</span>
                        )}
                        {showShortcut && (
                            <HeadingShortcutBadge
                                level={level}
                                shortcutKeys={shortcutKeys}
                            />
                        )}
                    </>
                )}
            </Button>
        )
    },
)

HeadingButton.displayName = 'HeadingButton'
