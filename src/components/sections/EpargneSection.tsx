import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { Button } from "@/components/ui/button"
import { type Epargne } from "@/store/db/planning"
import type { Caisse } from "@/store/db/caisse"
import { SearchAndSort } from "@/components/SearchAndSort"
import { useSearchAndSort } from "@/hooks/useSearchAndSort"

interface EpargneSectionProps {
  currency?: string;
  currentEpargneTotal: number;
  caisses: Caisse[]
  epargnes: Epargne[]
  addEpargne: () => void
  updateEpargne: (id: string, data: Partial<Epargne>) => void
  deleteEpargne: (id: string) => void
}

export function EpargneSection({ currentEpargneTotal, currency, caisses, epargnes, addEpargne, updateEpargne, deleteEpargne }: EpargneSectionProps) {
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, setSortBy, sortOrder, setSortOrder } = useSearchAndSort(
    epargnes.map((epargne) => ({
      ...epargne,
      title: caisses.find((c) => c.id === epargne.caisseId)?.title || `Épargne ${epargne.id.slice(0, 8)}`,
    }))
  )
  
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="font-medium">Épargnes</span>
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={addEpargne}
          >
            <Plus className="size-4" />
            <span className="sr-only">Ajouter une épargne</span>
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
          list={filteredAndSorted.map((epargne) => ({
            title: caisses.find((c) => c.id === epargne.caisseId)?.title || `Épargne ${epargne.id.slice(0, 8)}`,
            amount: epargne.amount,
            commentaire: epargne.commentaire,
            onUpdate: (data) => updateEpargne(epargne.id, { ...data }),
            onDelete: () => deleteEpargne(epargne.id),
          }))}
        />
      </CardContent>
      <CardFooter className="p-2">
        <p className="text-xs text-muted-foreground">
          {currentEpargneTotal ? (
            <>
              Total actuel : <span className="font-medium">{currentEpargneTotal} {currency}</span>
            </>
          ) : (
            <>Aucune épargne définie pour cette période.</>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}