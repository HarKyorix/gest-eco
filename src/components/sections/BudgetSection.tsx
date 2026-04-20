import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Budget } from "@/store/db/planning"
import type { Source } from "@/store/db/source"
import { Button } from "../ui/button"

interface BudgetSectionProps {
  currency?: string;
  currentBudgetTotal: number;
  budgets: Budget[]
  sources: Source[]
  addBudget: () => void
  updateBudget: (id: string, data: Partial<Budget>) => void
  deleteBudget: (id: string) => void
}

export function BudgetSection({ currentBudgetTotal, currency, budgets, sources, addBudget, updateBudget, deleteBudget }: BudgetSectionProps) {
  
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
          currency={currency}
          list={budgets.map((budget) => ({
            title: sources.find((s) => s.id === budget.sourceId)?.title || `Budget ${budget.id.slice(0, 8)}`,
            amount: budget.amount,
            commentaire: budget.commentaire,
            onUpdate: (data) => updateBudget(budget.id, { ...data }),
            onDelete: () => deleteBudget(budget.id),
          }))}
        />
      </CardContent>
      <CardFooter className="p-2">
        <p className="text-xs text-muted-foreground">
          {currentBudgetTotal > 0 ? (
            <>
              Total actuel : <span className="font-medium">{currentBudgetTotal} {currency}</span>
            </>
          ) : (
            <>Aucun budget défini pour cette période.</>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}