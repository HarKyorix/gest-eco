/* eslint-disable react-hooks/set-state-in-effect */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenuDestructive } from "@/components/DropdownMenuDestructive"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Planning } from "@/store/planning"
import { useEffect, useMemo, useState } from "react"

interface DashboardContentSectionProps {
  currentTableId: string | null;
  onPlanningInit: (tableId?: string) => void;
  plannings: Planning[];
  onAddPlanning: () => void;
  onUptadePlanning: (id: string, data: Partial<Planning>) => void;
  onRemovePlanning: (id: string) => void;
  onAddDepense: (planningId: string) => void;
  onUptadeDepense: (planningId: string, id: string, data: Partial<Planning>) => void;
  onRemoveDepense: (planningId: string, id: string) => void;
  onAddBudget: (planningId: string) => void;
  onUptadeBudget: (planningId: string, id: string, data: Partial<Planning>) => void;
  onRemoveBudget: (planningId: string, id: string) => void;
  onAddEpargne: (planningId: string) => void;
  onUptadeEpargne: (planningId: string, id: string, data: Partial<Planning>) => void;
  onRemoveEpargne: (planningId: string, id: string) => void;
}

export function DashboardContentSection({
  currentTableId,
  onPlanningInit,
  plannings,
  onAddPlanning,
  // onUptadePlanning,
  // onRemovePlanning,
  // onAddDepense,
  // onUptadeDepense,
  // onRemoveDepense,
  // onAddBudget,
  // onUptadeBudget,
  // onRemoveBudget,
  // onAddEpargne,
  // onUptadeEpargne,
  // onRemoveEpargne
}: DashboardContentSectionProps) {
  const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null)

  useEffect(() => {
    if (currentTableId && plannings.length === 0) {
      onPlanningInit(currentTableId)
    } else if (plannings.length > 0) {
      setSelectedPlanning(plannings[0])
    }
  }, [onPlanningInit, currentTableId, plannings])

  const selectedPlanningId = useMemo(() => {
    if (selectedPlanning) {
      return selectedPlanning.id
    }
    return plannings[0].id
  }, [selectedPlanning, plannings])


  return (
    <Tabs
      value={selectedPlanningId || plannings[0]?.id}
      onValueChange={(value) => {
        const nextPlanning = plannings.find((planning) => planning.id === value)
        if (nextPlanning) {
          setSelectedPlanning(nextPlanning)
        }
      }}
      className="max-w-fit mt-6 flex-1 flex-col"
    >
      <TabsList className="gap-2 overflow-x-auto border-b">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onAddPlanning()}
        >
          <Plus className="size-4" />
          <span className="sr-only">Add Tab</span>
        </Button>
        {plannings.map((planning) => (
          <TabsTrigger key={planning.id} value={planning.id}>
            {planning.title}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedPlanningId}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{selectedPlanning?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlanning?.commentaire || "Détails du planning"}
                </p>
              </div>
              <DropdownMenuDestructive onUpdate={() => {}} onDelete={() => {}} />
            </CardTitle>
          </CardHeader>

          <CardDescription>
            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <Card className="flex flex-col gap-4 p-4">
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="font-medium">Budgets</span>
                  <Button variant="default" size="icon">
                    <Plus className="size-4" />
                    <span className="sr-only">Ajouter un budget</span>
                  </Button>
                </CardTitle>
                <CardContent className="text-sm text-muted-foreground">
                  <ItemGroupContainer
                    list={[
                      {
                        title: "Budget 1",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Budget 2",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Budget 3",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="flex flex-col gap-4 p-4">
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="font-medium">Dépenses</span>
                  <Button variant="default" size="icon">
                    <Plus className="size-4" />
                    <span className="sr-only">Ajouter une dépense</span>
                  </Button>
                </CardTitle>
                <CardContent className="text-sm text-muted-foreground">
                  <ItemGroupContainer
                    list={[
                      {
                        title: "Dépense 1",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Dépense 2",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Dépense 3",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="flex flex-col gap-4 p-4">
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="font-medium">Épargnes</span>
                  <Button variant="default" size="icon">
                    <Plus className="size-4" />
                    <span className="sr-only">Ajouter une épargne</span>
                  </Button>
                </CardTitle>
                <CardContent className="text-sm text-muted-foreground">
                  <ItemGroupContainer
                    list={[
                      {
                        title: "Épargne 1",
                        amount: 1000,
                        commentaire: "Pour les vacances",
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Épargne 2",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                      {
                        title: "Épargne 3",
                        amount: 1000,
                        update: () => {},
                        delete: () => {},
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </CardDescription>

          <CardContent className="mt-6">
            <p className="text-sm text-muted-foreground">
              Vous pouvez étendre ce tableau pour afficher les transactions ou les totaux.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
