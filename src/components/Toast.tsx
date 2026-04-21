import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react"
import { useToastStore } from "@/store/toast.store"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: {
    id: string
    title: string
    description?: string
    type: "success" | "error" | "warning" | "info"
  }
  onClose: () => void
}

function Toast({ toast, onClose }: ToastProps) {
  const baseClasses =
    "flex gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300"

  const styleClasses = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  }

  const iconClasses = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className={cn("size-5 flex-shrink-0", iconClasses.success)} />
      case "error":
        return <AlertCircle className={cn("size-5 flex-shrink-0", iconClasses.error)} />
      case "warning":
        return <AlertTriangle className={cn("size-5 flex-shrink-0", iconClasses.warning)} />
      case "info":
        return <Info className={cn("size-5 flex-shrink-0", iconClasses.info)} />
    }
  }

  return (
    <div className={cn(baseClasses, styleClasses[toast.type])}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.description && (
          <p className="text-xs opacity-90 mt-1">{toast.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
