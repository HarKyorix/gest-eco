import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportImportButtonsProps {
  onExport: () => void
  onImport: (file: File) => void
  disabled?: boolean
}

export function ExportImportButtons({
  onExport,
  onImport,
  disabled = false,
}: ExportImportButtonsProps) {
  const handleImportClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onImport(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="default"
        onClick={onExport}
        disabled={disabled}
        className="gap-2"
      >
        <Upload className="size-4" />
        Exporter
      </Button>
      <Button
        variant="outline"
        size="default"
        onClick={handleImportClick}
        disabled={disabled}
        className="gap-2"
      >
        <Download className="size-4" />
        Importer
      </Button>
    </div>
  )
}
