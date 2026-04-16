import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Planning } from "@/store/planning"

interface PlanningTabsProps {
  plannings: Planning[]
  currentPlanningId: string | null
  onAddPlanning: () => void
  onPlanningChange: (planningId: string) => void
}

export function PlanningTabs({
  plannings,
  currentPlanningId,
  onAddPlanning,
  onPlanningChange
}: PlanningTabsProps) {
  return (
    <div className="mt-6 flex-1 flex-col">
      <Button
        variant="outline"
        size="icon"
        className="ml-auto mb-4"
        onClick={() => onAddPlanning()}
      >
        <Plus className="size-4" />
        <span className="sr-only">Ajouter un planning</span>
      </Button>
      <Tabs
        value={currentPlanningId || plannings[0]?.id}
        onValueChange={(value) => {
          const nextPlanning = plannings.find((planning) => planning.id === value)
          if (nextPlanning) {
            onPlanningChange(nextPlanning.id)
          }
        }}
        className="w-full"
      >
        <TabsList className="w-full flex justify-start gap-2 overflow-x-auto">
          {plannings.map((planning) => (
            <TabsTrigger key={planning.id} value={planning.id} className="flex-none py-2">
              {planning.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}