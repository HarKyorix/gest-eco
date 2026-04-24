import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { Button } from "@/components/ui/button"
import { type Depense } from "@/store/db/planning"
import type { Divers } from "@/store/db/divers"
import type { Caisse } from "@/store/db/caisse"
import { SearchAndSort } from "@/components/SearchAndSort"
import { useSearchAndSort } from "@/hooks/useSearchAndSort"

interface DepenseSectionProps {
  currency?: string;
  currentDepenseTotal: number;
  divers: Divers[]
  caisses: Caisse[]
  depenses: Depense[]
  addDepense: () => void
  updateDepense: (id: string, data: Partial<Depense>) => void
  updateDepenseModal: (id: string, data: Partial<Depense>) => void
  deleteDepense: (id: string) => void
}

export function DepenseSection({ currentDepenseTotal, currency, divers, caisses, depenses, addDepense, updateDepense, updateDepenseModal, deleteDepense }: DepenseSectionProps) {
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, setSortBy, sortOrder, setSortOrder } = useSearchAndSort(
    depenses.map((depense) => ({
      ...depense,
      title: depense.caisseId 
        ? `📦 ${caisses.find((c) => c.id === depense.caisseId)?.title || "Caisse inconnue"}`
        : divers.find((d) => d.id === depense.diversId)?.title || `Dépense ${depense.id.slice(0, 8)}`,
    }))
  )
  
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="font-medium">Dépenses</span>
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={addDepense}
          >
            <Plus className="size-4" />
            <span className="sr-only">Ajouter une dépense</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-4">
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
          list={filteredAndSorted.map((depense) => ({
            title: depense.caisseId 
              ? `${divers.find((d) => d.id === depense.diversId)?.title || "Divers inconnu"} 📦 ${caisses.find((c) => c.id === depense.caisseId)?.title || "Caisse inconnue"}`
              : divers.find((d) => d.id === depense.diversId)?.title || `Dépense ${depense.id.slice(0, 8)}`,
            amount: depense.amount,
            commentaire: depense.commentaire,
            onUpdate: (data) => updateDepense(depense.id, { ...data }),
            onUpdateModal: (data) => updateDepenseModal(depense.id, { ...depense, ...data }),
            onDelete: () => deleteDepense(depense.id),
          }))}
        />
      </CardContent>
      <CardFooter className="p-2">
        <p className="text-xs text-muted-foreground">
          {currentDepenseTotal > 0 ? (
            <>
              Total actuel : <span className="font-medium">{currentDepenseTotal} {currency}</span>
            </>
          ) : (
            <>Aucune dépense définie pour cette période.</>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}