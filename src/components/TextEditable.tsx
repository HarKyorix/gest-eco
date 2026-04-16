/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TextEditableProps {
  value?: string
  onSave: (value: string) => void
  type?: "text" | "number"
  className?: string
  placeholder?: string
  children?: React.ReactNode
}

export default function TextEditable({
  value,
  onSave,
  className,
  type = "text",
  placeholder = "Cliquez pour modifier",
  children
}: TextEditableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || "")
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDraft(value || "")
  }, [value])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function handleSave() {
    setEditing(false)
    onSave(draft?.trim() || "")
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSave()
    }
    if (event.key === "Escape") {
      setEditing(false)
      setDraft(value || "")
    }
  }

  return (
    <>
    { editing ? 
      <input
        ref={inputRef}
        value={draft}
        type={type}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
          className,
        )}
        placeholder={placeholder}
      />
      : 
        <div onClick={() => setEditing(true)}>
          {value ?
          (children || <span>{value}</span>)
          : (
            <span className="text-xs text-muted-foreground">{placeholder}</span>
          )}
        </div>
      }
    </>
  )
}
