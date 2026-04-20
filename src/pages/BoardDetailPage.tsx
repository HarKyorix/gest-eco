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
import { useDiversStore } from "@/store/divers"
import { useCaisseStore } from "@/store/caisse"
import { useAppStore } from "@/store/app.store"
import { DialogForm } from "@/components/DialogForm"

export default function BoardDetailPage() {
  const planningStore = usePlanningStore()
  const sourceStore = useSourceStore()
  const diversStore = useDiversStore()
  const caisseStore = useCaisseStore()
  const appStore = useAppStore()
  const navigate = useNavigate()
  const { boardId, planningId } = useParams<{ boardId?: string; planningId?: string }>()

  const plannings = planningStore.getList(boardId ?? undefined)
  const currentPlanning = planningId ? planningStore.getOne({ id: planningId }) : undefined
  const currentBudgetTotal = currentPlanning?.budgets.reduce((total, b) => total + b.amount, 0) ?? 0
  const currentDepenseTotal = currentPlanning?.depenses.reduce((total, d) => total + d.amount, 0) ?? 0
  const currentEpargneMax = currentBudgetTotal - currentDepenseTotal

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
                    onClick={() => appStore.openDialog({
                      title: "Supprimer le planning",
                      description: `Êtes-vous sûr de vouloir supprimer "${planningStore.getOne({ id: planningId })?.title}" ?`,
                      onConfirm: () => planningStore.remove(planningId),
                    })}
                  >
                    <Trash className="size-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardDescription className="px-4">
                <div className="mt-4 grid gap-4 xl:grid-cols-3">
                  <BudgetSection 
                    budgets={planningStore.getOne({ id: planningId })?.budgets || []} 
                    sources={sourceStore.getList()}
                    addBudget={() => appStore.openForm({
                      title: "Ajouter un budget",
                      description: "Entrez les détails du nouveau budget",
                      fields: [
                        { id: "amount", name: "amount", label: "Montant", type: "number" },
                        { id: "sourceId", name: "sourceId", label: "Source", type: "select", options: sourceStore.getList().map(s => ({ label: s.title, value: s.id })) }
                      ],
                      onSubmit: (formData) => planningStore.addBudget(planningId, { 
                        amount: parseFloat(formData.amount as string),
                        sourceId: formData.sourceId as string,
                      })
                    })}
                    updateBudget={(id: string, data: Partial<Budget>) => planningStore.updateBudget(planningId, id, data)}
                    deleteBudget={(id: string) => appStore.openDialog({
                      title: "Supprimer le budget",
                      description: `Êtes-vous sûr de vouloir supprimer ce budget ?`,
                      onConfirm: () => planningStore.removeBudget(planningId, id)
                    })}
                  />
                  <DepenseSection 
                    divers={diversStore.getList()}
                    depenses={planningStore.getOne({ id: planningId })?.depenses || []} 
                    addDepense={() => appStore.openForm({
                      title: "Ajouter une dépense",
                      description: "Entrez les détails de la nouvelle dépense",
                      fields: [
                        { id: "amount", name: "amount", label: "Montant", type: "number", max: currentBudgetTotal.toString() },
                        { id: "diversId", name: "diversId", label: "Divers", type: "select", options: diversStore.getList().map(d => ({ label: d.title, value: d.id })) }
                      ],
                      onSubmit: (formData) => planningStore.addDepense(planningId, { amount: parseFloat(formData.amount as string), diversId: formData.diversId as string })
                    })}
                    updateDepense={(id: string, data: Partial<Depense>) => planningStore.updateDepense(planningId, id, data)}
                    deleteDepense={(id: string) => appStore.openDialog({
                      title: "Supprimer la dépense",
                      description: `Êtes-vous sûr de vouloir supprimer cette dépense ?`,
                      onConfirm: () => planningStore.removeDepense(planningId, id)
                    })}
                  />
                  <EpargneSection 
                    caisses={caisseStore.getList()}
                    epargnes={planningStore.getOne({ id: planningId })?.epargnes || []}
                    addEpargne={() => appStore.openForm({
                        title: "Ajouter une épargne",
                        description: "Entrez les détails de la nouvelle épargne",
                        fields: [
                          { id: "amount", name: "amount", label: "Montant", type: "number", max: currentEpargneMax.toString() },
                          { id: "caisseId", name: "caisseId", label: "Caisse", type: "select", options: caisseStore.getList().map(c => ({ label: c.title, value: c.id })) }
                        ],
                        onSubmit: (formData) => planningStore.addEpargne(planningId, { amount: parseFloat(formData.amount as string), caisseId: formData.caisseId as string })
                      })}
                    updateEpargne={(id: string, data: Partial<Epargne>) => planningStore.updateEpargne(planningId, id, data)}
                    deleteEpargne={(id: string) => appStore.openDialog({
                      title: "Supprimer l'épargne",
                      description: `Êtes-vous sûr de vouloir supprimer cette épargne ?`,
                      onConfirm: () => planningStore.removeEpargne(planningId, id)
                    })}
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
      <DialogForm
        open={appStore.form.open}
        title={appStore.form.title}
        description={appStore.form.description}
        fields={appStore.form.fields}
        close={() => appStore.closeForm()}
        submit={(data) => {
          if (appStore.form.onSubmit) {
            appStore.form.onSubmit(data)
          }
          appStore.closeForm()
        }}
      />
    </>
  )
}
