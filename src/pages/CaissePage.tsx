import { useCaisseStore } from "@/store/db/caisse"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Grid, List } from "lucide-react"
import { CaissesSection } from "@/components/sections/CaissesSection"
import { useAppStore } from "@/store/app.store"
import { useSettingStore } from "@/store/setting.store"
import { useToast } from "@/store/toast.store"
import { Card, CardContent } from "@/components/ui/card"
import { ExportImportButtons } from "@/components/ExportImportButtons"
import { useDataExportImport } from "@/lib/exportImport"

export default function CaissePage() {
  const caisseStore = useCaisseStore()
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
          caisses: caisseStore.getList(),
        },
        settingStore,
        "caisses"
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
      caisseStore.clear()

      // Importer les nouvelles données
      data.caisses.forEach((caisse) => caisseStore.add(caisse))

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

  const onAddCaisse = () => {
    const newCaisse = {
      title: "Nouvelle caisse " + (caisseStore.list.length + 1),
    }
    caisseStore.add(newCaisse)
  }

  useEffect(() => {
    caisseStore.init()
  }, [caisseStore])

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
            <CaissesSection
              display={settingStore.displayMode}
              caisses={caisseStore.list}
              onAdd={onAddCaisse}
              onEdit={(caisse) => appStore.openForm({
                title: "Modifier la caisse",
                description: "Modifiez les détails de la caisse",
                fields: [{ id: "title", name: "title", label: "Titre", type: "text" }],
                initialData: { title: caisse.title },
                onSubmit: (data) => caisseStore.update(caisse.id, { title: data.title as string })
              })}
              onDelete={(caisse) => appStore.openDialog({
                title: "Supprimer la caisse",
                description: `Êtes-vous sûr de vouloir supprimer "${caisse.title}" ?`,
                onConfirm: () => {
                  caisseStore.remove(caisse.id)
                  toast.success("Caisse supprimée", `La caisse "${caisse.title}" a été supprimée`)
                }
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
