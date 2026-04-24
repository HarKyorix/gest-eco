
import { useBoardStore } from "@/store/db/board"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Grid, List } from "lucide-react"
import { BoardsSection } from "@/components/sections/BoardsSection"
import { useAppStore } from "@/store/app.store"
import { useSettingStore } from "@/store/setting.store"
import { useToast } from "@/store/toast.store"
import { useDataExportImport } from "@/lib/exportImport"
import { ExportImportButtons } from "@/components/ExportImportButtons"

export default function BoardPage() {
  const boardStore = useBoardStore()
  const toast = useToast()
  const appStore = useAppStore()
  const settingStore = useSettingStore()
  const navigate = useNavigate()
  const { exportData, importData } = useDataExportImport()
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    try {
      exportData(
        {
          boards: boardStore.getList(),
        },
        settingStore,
        "boards"
      )
      toast.success("Export réussi", "Vos données ont été téléchargées")
    } catch (error) {
      console.log(error);
      toast.error("Erreur d'export", "Impossible d'exporter les données")
    }
  }

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true)
      const data = await importData(file)
      
      // Effacer les données existantes
      boardStore.clear()

      // Importer les nouvelles données
      data.boards.forEach((board) => boardStore.add(board))

      toast.success("Import réussi", "Vos données ont été importées avec succès")
      
      // Rafraîchir après un court délai
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      toast.error(
        "Erreur d'importation",
        error instanceof Error ? error.message : "Erreur lors de l'importation"
      )
    } finally {
      setIsImporting(false)
    }
  }

  const onAddBoard = () => {
    const newBoard = {
      title: "Nouveau tableau"+boardStore.list.length,
    }
    boardStore.add(newBoard)
  }

  useEffect(() => {
    boardStore.init()
  }, [boardStore])

  return (
    <div className="min-h-svh w-full p-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4 space-y-0 pb-4">
          <Button variant="outline" onClick={() => navigate("/")} size="icon">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex flex-wrap gap-2 ml-auto w-max"> 
            <ExportImportButtons
              onExport={handleExport}
              onImport={handleImport}
              disabled={isImporting}
            />
            <Button
              variant={settingStore.displayMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => settingStore.setPreferances('displayMode', 'grid')}
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant={settingStore.displayMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => settingStore.setPreferances('displayMode', 'list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
        <Card className="w-full h-full">
          <CardContent>
            <BoardsSection
              display={settingStore.displayMode}
              boards={boardStore.list}
              onAdd={onAddBoard}
              onNavigate={(id) => navigate(`/?boardId=${id}`)}
              onEdit={(board) => appStore.openForm({
                title: "Modifier le tableau",
                description: "Modifiez les détails du tableau",
                fields: [{ id: "title", name: "title", label: "Titre", type: "text" }],
                initialData: { title: board.title },
                onSubmit: (data) => boardStore.update(board.id, { title: data.title as string })
              })}
              onDelete={(board) => appStore.openDialog({
                title: "Supprimer le tableau",
                description: `Êtes-vous sûr de vouloir supprimer "${board.title}" ?`,
                onConfirm: () => boardStore.remove(board.id)
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
