import { useBoardStore } from "@/store/db/board"
import { useCaisseStore } from "@/store/db/caisse"
import { useDiversStore } from "@/store/db/divers"
import { useSourceStore } from "@/store/db/source"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/app.store"
import { BoardsSection, CaissesSection, DiversSection, SourcesSection } from "@/components/sections"
import { Grid, List, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettingStore } from "@/store/setting.store"
import { useToast } from "@/store/toast.store"

export default function HomePage() {
  const boardStore = useBoardStore()
  const caisseStore = useCaisseStore()
  const diversStore = useDiversStore()
  const sourceStore = useSourceStore()

  const appStore = useAppStore()
  const settingStore = useSettingStore()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()


  const activeTab = useMemo(() => {
    const path = location.pathname.toLowerCase()
    if (path === "/caisse") return "caisses"
    if (path === "/divers") return "divers"
    if (path === "/source") return "sources"
    return "boards"
  }, [location.pathname])

  useEffect(() => {
    if (!["/", "/caisse", "/divers", "/source"].includes(location.pathname)) {
      navigate("/")
    }
  }, [location.pathname, navigate])

  const onChangeTab = (value: string) => {
    if (value === "boards") {
      navigate("/")
      return
    }
    if (value === "caisses") {
      navigate("/caisse")
      return
    }
    if (value === "divers") {
      navigate("/divers")
      return
    }
    if (value === "sources") {
      navigate("/source")
      return
    }
  }

  const onAddBoard = () => {
    const newBoard = {
      title: "Nouveau tableau " + (boardStore.list.length + 1),
    }
    boardStore.add(newBoard)
  }

  const onAddCaisse = () => {
    caisseStore.add({ title: "Nouvelle caisse " + (caisseStore.list.length + 1) })
  }

  const onAddDivers = () => {
    diversStore.add({ title: "Nouveau divers " + (diversStore.list.length + 1) })
  }

  const onAddSource = () => {
    sourceStore.add({ title: "Nouvelle source " + (sourceStore.list.length + 1) })
  }

  useEffect(() => {
    boardStore.init()
    caisseStore.init()
    diversStore.init()
    sourceStore.init()
  }, [boardStore, caisseStore, diversStore, sourceStore])

  return (
    <div className="min-h-svh p-4 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Button
            variant="default"
            size="sm"
            onClick={() => settingStore.setPreferances('theme', settingStore.theme === 'light' ? 'dark' : 'light')}
          >
            { settingStore.theme === 'light' ? 
              <Sun className="size-4 mr-2" />
              : 
              <Moon className="size-4 mr-2" />
            }
            Mode {settingStore.theme === 'light' ? 'clair' : settingStore.theme === 'dark' ? 'sombre' : 'système'}
          </Button>
          <h1 className="text-2xl font-bold">Bienvenue sur votre gestionnaire économique familial</h1>
          <p className="text-muted-foreground">Organisez vos finances, suivez vos dépenses et atteignez vos objectifs financiers en famille.</p>
          <div className="flex gap-2 mt-4 ml-auto w-max"> 
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

        <Tabs
          value={activeTab}
          onValueChange={onChangeTab}
          className="w-full flex flex-col"
        >
          <TabsList className="flex w-full gap-2 bg-transparent border-b rounded-none">
            <TabsTrigger value="boards">Tableaux</TabsTrigger>
            <TabsTrigger value="caisses">Caisses</TabsTrigger>
            <TabsTrigger value="divers">Divers</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="boards" className="space-y-4 mt-6">
            <BoardsSection
              display={settingStore.displayMode}
              boards={boardStore.list}
              onAdd={onAddBoard}
              onNavigateList={() => navigate("/board")}
              onNavigate={(id) => navigate(`/board/${id}`)}
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
                onConfirm: () => {
                  boardStore.remove(board.id)
                  toast.success("Tableau supprimé", `Le tableau "${board.title}" a été supprimé`)
                }
              })}
            />
          </TabsContent>

          <TabsContent value="caisses" className="space-y-4 mt-6">
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
          </TabsContent>

          <TabsContent value="divers" className="space-y-4 mt-6">
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
          </TabsContent>

          <TabsContent value="sources" className="space-y-4 mt-6">
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
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
