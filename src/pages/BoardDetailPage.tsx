import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlanningStore } from "@/store/planning"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PlanningContent } from "@/components/sections"


export default function BoardDetailPage() {
  const planningStore = usePlanningStore()
  const navigate = useNavigate()
  const { boardId, planningId } = useParams<{ boardId?: string; planningId?: string }>()

  const plannings = planningStore.getList(boardId ?? undefined)

  useEffect(() => {
    if (boardId && plannings.length === 0) {
      planningStore.init(boardId)
    } else if (plannings.length > 0 && planningId == null) {
      navigate(`/board/${boardId}/${plannings[0]?.id ?? ""}`)
    }
  }, [planningStore, planningId, boardId, navigate, plannings])

  return (
    <>
      {plannings.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des plannings...</p>
        </div>
      ) : (
        <Tabs
          value={planningId || plannings[0]?.id}
          onValueChange={(value) => {
            const nextPlanning = plannings.find((planning) => planning.id === value)
            if (nextPlanning) {
              navigate(`/board/${boardId}/${nextPlanning.id}`)
            }
          }}
          className="mt-6 flex-1 flex-col"
        >
          <Button
            variant="outline"
            size="icon"
            className="ml-auto mb-4"
            onClick={() => planningStore.add({ title: `Nouveau planning ${plannings.length + 1}`, boardId: boardId ?? undefined })}
          >
            <Plus className="size-4" />
            <span className="sr-only">Ajouter un planning</span>
          </Button>
          <TabsList className="w-full flex justify-start gap-2 overflow-x-auto">
            {plannings.map((planning) => (
              <TabsTrigger key={planning.id} value={planning.id} className="flex-none py-2">
                {planning.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {plannings.map((planning) => (
            <PlanningContent
              key={planning.id}
              planning={planning}
              planningId={planning.id}
              onUpdatePlanning={planningStore.update}
              onRemovePlanning={planningStore.remove}
            />
          ))}
        </Tabs>
      )}
    </>
  )
}
