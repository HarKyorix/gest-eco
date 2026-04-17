import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { DialogForm } from "@/components/DialogForm"
import { type Budget } from "@/store/planning"
import type { Source } from "@/store/source"
import { Button } from '@/components/ui/button';

interface BudgetSectionProps {
  sources: Source[]
  budgets: Budget[]
  addBudget: (data: Partial<Budget>) => void
  updateBudget: (id: string, data: Partial<Budget>) => void
  deleteBudget: (id: string) => void
}

export function BudgetSection({ sources, budgets, addBudget, updateBudget, deleteBudget }: BudgetSectionProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Budgets</span>
        <DialogForm
          title="Ajouter un budget"
          fields={[
            {
              id: "amount",
              name: "amount",
              label: "Montant",
              type: "number",
              defaultValue: "0"
            },
            {
              id: "sources",
              name: "sources",
              label: "Sources",
              type: "select",
              multiple: true,
              options: sources.map(source => ({ label: source.title, value: source.id }))
            }
          ]}
          onSubmit={(data) => addBudget({ 
            amount: parseFloat(data.amount as string), 
            sourceIds: data.sources as string[] 
          })}
        >
          <Button variant="default" size="icon">
            <Plus className="size-4" />
            <span className="sr-only">Ajouter un budget</span>
          </Button>
        </DialogForm>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          list={budgets.map((budget) => ({
            title: sources.find((s) => s.id === budget.sourceId)?.title || `Budget ${budget.id.slice(0, 8)}`,
            amount: budget.amount,
            onUpdate: (data) => updateBudget(budget.id, { amount: data.amount, commentaire: data.commentaire }),
            onDelete: () => deleteBudget(budget.id),
          }))}
        />
      </CardContent>
    </Card>
  )
}