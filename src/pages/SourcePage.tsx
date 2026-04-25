import { useSourceStore } from "@/store/db/source"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Grid, List } from "lucide-react"
import { SourcesSection } from "@/components/sections/SourcesSection"
import { useAppStore } from "@/store/app.store"
import { useSettingStore } from "@/store/setting.store"
import { useToast } from "@/store/toast.store"
import { Card, CardContent } from "@/components/ui/card"
import { ExportImportButtons } from "@/components/ExportImportButtons"
import { useDataExportImport } from "@/lib/exportImport"

export default function SourcePage() {
  const sourceStore = useSourceStore()
  const appStore = useAppStore()
  const settingStore = useSettingStore()
  const toast = useToast()
  const navigate = useNavigate()
  const { exportData, importData } = useDataExportImport()
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    try {
      exportData(
        {
          sources: sourceStore.getList(),
        },
        settingStore,
        "sources"
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
      sourceStore.clear()

      // Importer les nouvelles données
      data.sources.forEach((source) => sourceStore.add(source))

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

  const onAddSource = () => {
    const newSource = {
      title: "Nouvelle source " + (sourceStore.list.length + 1),
    }
    sourceStore.add(newSource)
  }

  useEffect(() => {
    sourceStore.init()
  }, [sourceStore])

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
            <SourcesSection
              display={settingStore.displayMode}
              sources={sourceStore.list}
              onAdd={onAddSource}
              onEdit={(source) => appStore.openForm({
                title: "Modifier la source",
                description: "Modifiez les détails de la source",
                fields: [{ id: "title", name: "title", label: "Titre", type: "text" }],
                initialData: { title: source.title },
                onSubmit: (data) => sourceStore.update(source.id, { title: data.title as string })
              })}
              onDelete={(source) => appStore.openDialog({
                title: "Supprimer la source",
                description: `Êtes-vous sûr de vouloir supprimer "${source.title}" ?`,
                onConfirm: () => {
                  sourceStore.remove(source.id)
                  toast.success("Source supprimée", `La source "${source.title}" a été supprimée`)
                }
              })}
              onDeleteMultiple={(sources) => appStore.openDialog({
                title: "Supprimer les sources",
                description: `Êtes-vous sûr de vouloir supprimer ${sources.length} source${sources.length > 1 ? 's' : ''} ?`,
                onConfirm: () => {
                  sources.forEach((source) => sourceStore.remove(source.id))
                  toast.success("Sources supprimées", `${sources.length} source${sources.length > 1 ? 's' : ''} ${sources.length > 1 ? 'ont' : 'a'} été supprimée${sources.length > 1 ? 's' : ''}`)
                }
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
