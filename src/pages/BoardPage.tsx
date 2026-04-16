
import { usePlanningStore } from "@/store/planning"
import { useBoardStore } from "@/store/board"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowRight } from "lucide-react"

export default function BoardPage() {
  const boardStore = useBoardStore()
  const planningStore = usePlanningStore()
  const navigate = useNavigate()

  const onAddBoard = () => {
    const newBoard = {
      title: "Nouveau tableau"+boardStore.list.length,
    }
    boardStore.add(newBoard)
  }

  const onViewDetail = (id: string) => {
    navigate(`/board/${id}`)
  }

  useEffect(() => {
    boardStore.init()
  }, [boardStore])

  return (
    <div className="min-h-svh p-4">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-left">
            <CardTitle className="text-2xl">Tableaux</CardTitle>
            <CardDescription>
              Gérez vos tableaux et vos plannings en un seul endroit.
            </CardDescription>
          </div>
          <Button onClick={onAddBoard} size="icon" variant="default">
            <Plus />
            <span className="sr-only">Ajouter un tableau</span>
          </Button>
        </CardHeader>
        <CardContent>
          {boardStore.list.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <p className="mb-4 text-sm text-muted-foreground">
                Aucun tableau créé. Commencez par en ajouter un.
              </p>
              <Button onClick={onAddBoard} variant="outline">
                <Plus className="mr-2 size-4" />
                Créer un tableau
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boardStore.list.map((board) => (
                <Card
                  key={board.id}
                  className="flex flex-col cursor-pointer transition-all hover:border-primary hover:bg-muted/50"
                >
                  <CardHeader className="flex-1 flex items-center justify-between">
                    <CardTitle className="text-base">{board.title}</CardTitle>
                    <CardDescription>
                      {planningStore.getList(board.id).length} planning
                      {planningStore.getList(board.id).length > 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => onViewDetail(board.id)}
                    >
                      Voir les détails
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
