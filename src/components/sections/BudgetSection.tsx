import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Budget } from "@/store/db/planning"
import type { Source } from "@/store/db/source"
import { Button } from "../ui/button"

interface BudgetSectionProps {
  budgets: Budget[]
  sources: Source[]
  addBudget: () => void
  updateBudget: (id: string, data: Partial<Budget>) => void
  deleteBudget: (id: string) => void
}

export function BudgetSection({ budgets, sources, addBudget, updateBudget, deleteBudget }: BudgetSectionProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Budgets</span>
        <Button
          variant="outline"
          size="icon"
          onClick={addBudget}
        >
          <Plus className="size-4" />
          <span className="sr-only">Ajouter un budget</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          list={budgets.map((budget) => ({
            title: sources.find((s) => s.id === budget.sourceId)?.title || `Budget ${budget.id.slice(0, 8)}`,
            amount: budget.amount,
            commentaire: budget.commentaire,
            onUpdate: (data) => updateBudget(budget.id, { ...data }),
            onDelete: () => deleteBudget(budget.id),
          }))}
        />
      </CardContent>
    </Card>
  )
}