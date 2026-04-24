import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Budget } from "@/store/db/planning"
import type { Source } from "@/store/db/source"
import { Button } from "../ui/button"
import { SearchAndSort } from "@/components/SearchAndSort"
import { useSearchAndSort } from "@/hooks/useSearchAndSort"
import { EmptyState } from "@/components/EmptyState"

interface BudgetSectionProps {
  currency?: string;
  currentBudgetTotal: number;
  budgets: Budget[]
  sources: Source[]
  addBudget: () => void
  updateBudget: (id: string, data: Partial<Budget>) => void
  updateBudgetModal: (id: string, data: Partial<Budget>) => void
  deleteBudget: (id: string) => void
}

export function BudgetSection({ currentBudgetTotal, currency, budgets, sources, addBudget, updateBudget, updateBudgetModal, deleteBudget }: BudgetSectionProps) {
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, setSortBy, sortOrder, setSortOrder } = useSearchAndSort(
    budgets.map((budget) => ({
      ...budget,
      title: sources.find((s) => s.id === budget.sourceId)?.title || `Budget ${budget.id.slice(0, 8)}`,
    }))
  )
  
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="font-medium">Budgets</span>
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={addBudget}
            title="Ajouter un budget"
            aria-label="Ajouter un budget"
          >
            <Plus className="size-4" />
            <span className="sr-only">Ajouter un budget</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-4">
        {budgets.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="Aucun budget"
            description="Ajoutez un budget pour cette période pour commencer à planifier"
            actionLabel="Ajouter un budget"
            onAction={addBudget}
          />
        ) : (
          <>
            <SearchAndSort
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
            <ItemGroupContainer
              currency={currency}
              list={filteredAndSorted.map((budget) => ({
                title: sources.find((s) => s.id === budget.sourceId)?.title || `Budget ${budget.id.slice(0, 8)}`,
                amount: budget.amount,
                commentaire: budget.commentaire,
                onUpdate: (data) => updateBudget(budget.id, { ...data }),
                onUpdateModal: (data) => updateBudgetModal(budget.id, { ...budget, ...data }),
                onDelete: () => deleteBudget(budget.id),
              }))}
            />
          </>
        )}
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