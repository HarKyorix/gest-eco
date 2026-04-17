import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlanningStore, type Budget, type Depense, type Epargne } from "@/store/planning"
import { useSourceStore } from "@/store/source"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BudgetSection, DepenseSection, EpargneSection } from "@/components/sections"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TextEditable from "@/components/TextEditable"

export default function BoardDetailPage() {
  const planningStore = usePlanningStore()
  const sourceStore = useSourceStore()
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

          <TabsContent value={planningId} className="mt-4">
            {planningId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-4">
                  <div className="text-left">
                    <TextEditable
                      value={planningStore.getOne({ id: planningId })?.title}
                      onSave={(value: string) => planningStore.update(planningId, { title: value })}
                    >
                      <p className="text-lg font-semibold">{planningStore.getOne({ id: planningId })?.title}</p>
                    </TextEditable>
                    <TextEditable
                      value={planningStore.getOne({ id: planningId })?.commentaire}
                      onSave={(value: string) => planningStore.update(planningId, { commentaire: value })}
                    >
                      <p className="text-sm text-muted-foreground">{planningStore.getOne({ id: planningId })?.commentaire || "Aucun commentaire"}</p>
                    </TextEditable>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => planningStore.remove(planningId)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardDescription className="px-4">
                <div className="mt-4 grid gap-4 xl:grid-cols-3">
                  <BudgetSection 
                    sources={sourceStore.getList()}
                    budgets={planningStore.getOne({ id: planningId })?.budgets || []} 
                    addBudget={(data: Partial<Budget>) => planningStore.addBudget(planningId, data)}
                    updateBudget={(id: string, data: Partial<Budget>) => planningStore.updateBudget(planningId, id, data)}
                    deleteBudget={(id: string) => planningStore.removeBudget(planningId, id)}
                  />
                  <DepenseSection 
                    depenses={planningStore.getOne({ id: planningId })?.depenses || []} 
                    addDepense={(data: Partial<Depense>) => planningStore.addDepense(planningId, data)}
                    updateDepense={(id: string, data: Partial<Depense>) => planningStore.updateDepense(planningId, id, data)}
                    deleteDepense={(id: string) => planningStore.removeDepense(planningId, id)}
                  />
                  <EpargneSection 
                    epargnes={planningStore.getOne({ id: planningId })?.epargnes || []} 
                    addEpargne={(data: Partial<Epargne>) => planningStore.addEpargne(planningId, data)}
                    updateEpargne={(id: string, data: Partial<Epargne>) => planningStore.updateEpargne(planningId, id, data)}
                    deleteEpargne={(id: string) => planningStore.removeEpargne(planningId, id)}
                  />
                </div>
              </CardDescription>

              <CardContent className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Vous pouvez étendre ce tableau pour afficher les transactions ou les totaux.
                </p>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
