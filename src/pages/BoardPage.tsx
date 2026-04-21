
import { useBoardStore } from "@/store/db/board"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Grid, List } from "lucide-react"
import { BoardsSection } from "@/components/sections/BoardsSection"
import { useAppStore } from "@/store/app.store"
import { useSettingStore } from "@/store/setting.store"

export default function BoardPage() {
  const boardStore = useBoardStore()

  const appStore = useAppStore()
  const settingStore = useSettingStore()
  const navigate = useNavigate()


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
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Button variant="outline" onClick={() => navigate("/")} size="icon">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex gap-2 ml-auto w-max"> 
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
                onConfirm: () => boardStore.remove(board.id)
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
