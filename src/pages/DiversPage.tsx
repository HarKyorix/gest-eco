import { useDiversStore } from "@/store/db/divers"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Grid, List } from "lucide-react"
import { DiversSection } from "@/components/sections/DiversSection"
import { useAppStore } from "@/store/app.store"
import { useSettingStore } from "@/store/setting.store"
import { useToast } from "@/store/toast.store"
import { Card, CardContent } from "@/components/ui/card"
import { ExportImportButtons } from "@/components/ExportImportButtons"
import { useDataExportImport } from "@/lib/exportImport"

export default function DiversPage() {
  const diversStore = useDiversStore()
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
          divers: diversStore.getList(),
        },
        settingStore,
        "divers"
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
      diversStore.clear()

      // Importer les nouvelles données
      data.divers.forEach((divers) => diversStore.add(divers))

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

  const onAddDivers = () => {
    const newDivers = {
      title: "Nouveau divers " + (diversStore.list.length + 1),
    }
    diversStore.add(newDivers)
  }

  useEffect(() => {
    diversStore.init()
  }, [diversStore])

  return (
    <div className="min-h-svh w-full p-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Button variant="outline" onClick={() => navigate("/")} size="icon">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex gap-2 ml-auto w-max"> 
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
            <DiversSection
              display={settingStore.displayMode}
              diversList={diversStore.list}
              onAdd={onAddDivers}
              onEdit={(divers) => appStore.openForm({
                title: "Modifier le divers",
                description: "Modifiez les détails du divers",
                fields: [{ id: "title", name: "title", label: "Titre", type: "text" }],
                initialData: { title: divers.title },
                onSubmit: (data) => diversStore.update(divers.id, { title: data.title as string })
              })}
              onDelete={(divers) => appStore.openDialog({
                title: "Supprimer le divers",
                description: `Êtes-vous sûr de vouloir supprimer "${divers.title}" ?`,
                onConfirm: () => {
                  diversStore.remove(divers.id)
                  toast.success("Divers supprimé", `Le divers "${divers.title}" a été supprimé`)
                }
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
