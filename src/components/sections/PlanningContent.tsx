import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Planning } from "@/store/planning"
import TextEditable from "../TextEditable"
import { BudgetSection } from "./BudgetSection"
import { EpargneSection } from "./EpargneSection"
import { DepenseSection } from "./DepenseSection"

interface PlanningContentProps {
  planning: Planning
  planningId: string
  onUpdatePlanning: (id: string, data: Partial<Planning>) => void
  onRemovePlanning: (id: string) => void
}

export function PlanningContent({
  planning,
  planningId,
  onUpdatePlanning,
  onRemovePlanning
}: PlanningContentProps) {
  return (
    <TabsContent value={planningId} className="mt-4">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-4">
            <div className="text-left">
              <TextEditable
                value={planning.title}
                onSave={(value: string) => onUpdatePlanning(planningId, { title: value })}
              >
                <p className="text-lg font-semibold">{planning.title}</p>
              </TextEditable>
              <TextEditable
                value={planning.commentaire}
                onSave={(value: string) => onUpdatePlanning(planningId, { commentaire: value })}
              >
                <p className="text-sm text-muted-foreground">{planning.commentaire || "Aucun commentaire"}</p>
              </TextEditable>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemovePlanning(planningId)}
            >
              <Trash className="size-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardDescription>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <BudgetSection planningId={planningId} />
            <DepenseSection planningId={planningId} />
            <EpargneSection planningId={planningId} />
          </div>
        </CardDescription>

        <CardContent className="mt-6">
          <p className="text-sm text-muted-foreground">
            Vous pouvez étendre ce tableau pour afficher les transactions ou les totaux.
          </p>
        </CardContent>
      </Card>
    </TabsContent>
  )
}