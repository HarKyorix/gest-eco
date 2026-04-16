import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"

interface BudgetSectionProps {
  planningId: string
}

export function BudgetSection({ planningId }: BudgetSectionProps) {
  // planningId will be used for dynamic budget management in the future
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Budgets</span>
        <Button variant="default" size="icon">
          <Plus className="size-4" />
          <span className="sr-only">Ajouter un budget</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        planningId: {planningId} {/* Displaying planningId for debugging purposes */}
        <ItemGroupContainer
          list={[
            {
              title: "Budget 1",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Budget 2",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Budget 3",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}