
import { useBoardStore } from "@/store/board"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Grid, List } from "lucide-react"
import { BoardsSection } from "@/components/sections/BoardsSection"
import { useAppStore } from "@/store/app.store"

export default function BoardPage() {
  const boardStore = useBoardStore()

  const appStore = useAppStore()
  const navigate = useNavigate()

  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('grid')

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
    <div className="min-h-svh p-4">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex gap-2 mt-4 ml-auto w-max"> 
            <Button
              variant={displayMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setDisplayMode('grid')}
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant={displayMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setDisplayMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BoardsSection
            display={displayMode}
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
  )
}
