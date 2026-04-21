import { useEffect } from "react"

interface KeyboardShortcutsConfig {
  onUndo?: () => void
  onRedo?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onEscape,
}: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        // Allow Escape in inputs
        if (event.key === "Escape" && onEscape) {
          onEscape()
        }
        return
      }

      // Ctrl+Z or Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault()
        onUndo?.()
      }
      // Ctrl+Y or Cmd+Shift+Z
      else if (
        ((event.ctrlKey || event.metaKey) && event.key === "y") ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z")
      ) {
        event.preventDefault()
        onRedo?.()
      }
      // Escape
      else if (event.key === "Escape") {
        onEscape?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onUndo, onRedo, onEscape])
}
