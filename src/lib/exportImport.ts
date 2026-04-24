import type { Board } from "@/store/db/board"
import type { Caisse } from "@/store/db/caisse"
import type { Divers } from "@/store/db/divers"
import type { Planning } from "@/store/db/planning"
import type { Source } from "@/store/db/source"

export interface ExportImportData {
  version: string
  exportedAt: string
  boards: Board[]
  plannings: Planning[]
  caisses: Caisse[]
  sources: Source[]
  divers: Divers[]
  settings: {
    currency: string
  }
}

export function useDataExportImport() {
  const exportData = (
    list: {
      boards?: Board[],
      plannings?: Planning[],
      caisses?: Caisse[],
      sources?: Source[],
      divers?: Divers[],
    },
    settings: {
      currency: string
    },
    name: string
  ) => {
    const data: ExportImportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      boards: list.boards || [],
      plannings: list.plannings || [],
      caisses: list.caisses || [],
      sources: list.sources || [],
      divers: list.divers || [],
      settings,
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${name}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = (file: File): Promise<ExportImportData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = e.target?.result
          if (typeof result !== "string") {
            throw new Error("Impossible de lire le fichier")
          }
          const data = JSON.parse(result) as ExportImportData
          if (!data.version || !Array.isArray(data.boards)) {
            throw new Error("Format de fichier invalide")
          }
          resolve(data)
        } catch (error) {
          reject(
            error instanceof Error
              ? error
              : new Error("Erreur lors de la lecture du fichier")
          )
        }
      }
      reader.onerror = () =>
        reject(new Error("Erreur lors de la lecture du fichier"))
      reader.readAsText(file)
    })
  }


  return { exportData, importData }
}