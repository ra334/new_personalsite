'use client'

// --- Icons ---
import { BoldIcon } from '@src/components/tiptap/tiptap-icons/bold-icon'
import { Code2Icon } from '@src/components/tiptap/tiptap-icons/code2-icon'
import { ItalicIcon } from '@src/components/tiptap/tiptap-icons/italic-icon'
import { StrikeIcon } from '@src/components/tiptap/tiptap-icons/strike-icon'
import { SubscriptIcon } from '@src/components/tiptap/tiptap-icons/subscript-icon'
import { SuperscriptIcon } from '@src/components/tiptap/tiptap-icons/superscript-icon'
import { UnderlineIcon } from '@src/components/tiptap/tiptap-icons/underline-icon'
// --- Hooks ---
import { useTiptapEditor } from '@src/hooks/use-tiptap-editor'
// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from '@src/lib/tiptap-utils'
import type { Editor } from '@tiptap/react'
import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export type Mark =
    | 'bold'
    | 'italic'
    | 'strike'
    | 'code'
    | 'underline'
    | 'superscript'
    | 'subscript'

/**
 * Configuration for the mark functionality
 */
export interface UseMarkConfig {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor | null
    /**
     * The type of mark to toggle
     */
    type: Mark
    /**
     * Whether the button should hide when mark is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean
    /**
     * Callback function called after a successful mark toggle.
     */
    onToggled?: () => void
}

export const markIcons = {
    bold: BoldIcon,
    italic: ItalicIcon,
    underline: UnderlineIcon,
    strike: StrikeIcon,
    code: Code2Icon,
    superscript: SuperscriptIcon,
    subscript: SubscriptIcon,
}

export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
    bold: 'mod+b',
    italic: 'mod+i',
    underline: 'mod+u',
    strike: 'mod+shift+s',
    code: 'mod+e',
    superscript: 'mod+.',
    subscript: 'mod+,',
}

/**
 * Checks if a mark can be toggled in the current editor state
 */
export function canToggleMark(editor: Editor | null, type: Mark): boolean {
    if (!editor || !editor.isEditable) return false
    if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ['image']))
        return false

    return editor.can().toggleMark(type)
}

/**
 * Checks if a mark is currently active
 */
export function isMarkActive(editor: Editor | null, type: Mark): boolean {
    if (!editor || !editor.isEditable) return false
    return editor.isActive(type)
}

/**
 * Toggles a mark in the editor
 */
export function toggleMark(editor: Editor | null, type: Mark): boolean {
    if (!editor || !editor.isEditable) return false
    if (!canToggleMark(editor, type)) return false

    return editor.chain().focus().toggleMark(type).run()
}

/**
 * Determines if the mark button should be shown
 */
export function shouldShowButton(props: {
    editor: Editor | null
    type: Mark
    hideWhenUnavailable: boolean
}): boolean {
    const { editor, type, hideWhenUnavailable } = props

    if (!editor || !editor.isEditable) return false
    if (!isMarkInSchema(type, editor)) return false

    if (hideWhenUnavailable && !editor.isActive('code')) {
        return canToggleMark(editor, type)
    }

    return true
}

/**
 * Gets the formatted mark name
 */
export function getFormattedMarkName(type: Mark): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Custom hook that provides mark functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MySimpleBoldButton() {
 *   const { isVisible, handleMark } = useMark({ type: "bold" })
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleMark}>Bold</button>
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedItalicButton() {
 *   const { isVisible, handleMark, label, isActive } = useMark({
 *     editor: myEditor,
 *     type: "italic",
 *     hideWhenUnavailable: true,
 *     onToggled: () => console.log('Mark toggled!')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleMark}
 *       aria-pressed={isActive}
 *       aria-label={label}
 *     >
 *       Italic
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useMark(config: UseMarkConfig) {
    const {
        editor: providedEditor,
        type,
        hideWhenUnavailable = false,
        onToggled,
    } = config

    const { editor } = useTiptapEditor(providedEditor)
    const [isVisible, setIsVisible] = React.useState<boolean>(true)
    const canToggle = canToggleMark(editor, type)
    const isActive = isMarkActive(editor, type)

    React.useEffect(() => {
        if (!editor) return

        const handleSelectionUpdate = () => {
            setIsVisible(
                shouldShowButton({ editor, type, hideWhenUnavailable }),
            )
        }

        handleSelectionUpdate()

        editor.on('selectionUpdate', handleSelectionUpdate)

        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate)
        }
    }, [editor, type, hideWhenUnavailable])

    const handleMark = React.useCallback(() => {
        if (!editor) return false

        const success = toggleMark(editor, type)
        if (success) {
            onToggled?.()
        }
        return success
    }, [editor, type, onToggled])

    useHotkeys(
        MARK_SHORTCUT_KEYS[type],
        (event) => {
            event.preventDefault()
            handleMark()
        },
        {
            enabled: isVisible && canToggle,
            enableOnContentEditable: true,
            enableOnFormTags: true,
        },
    )

    return {
        isVisible,
        isActive,
        handleMark,
        canToggle,
        label: getFormattedMarkName(type),
        shortcutKeys: MARK_SHORTCUT_KEYS[type],
        Icon: markIcons[type],
    }
}
