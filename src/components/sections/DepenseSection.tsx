import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { Button } from "@/components/ui/button"
import { type Depense } from "@/store/db/planning"
import type { Divers } from "@/store/db/divers"

interface DepenseSectionProps {
  currency?: string;
  currentDepenseTotal: number;
  divers: Divers[]
  depenses: Depense[]
  addDepense: () => void
  updateDepense: (id: string, data: Partial<Depense>) => void
  deleteDepense: (id: string) => void
}

export function DepenseSection({ currentDepenseTotal, currency, divers, depenses, addDepense, updateDepense, deleteDepense }: DepenseSectionProps) {
  
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Dépenses</span>
        <Button variant="outline" size="icon" onClick={addDepense}>
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une dépense</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          currency={currency}
          list={depenses.map((depense) => ({
            title: divers.find((d) => d.id === depense.diversId)?.title || `Dépense ${depense.id.slice(0, 8)}`,
            amount: depense.amount,
            commentaire: depense.commentaire,
            onUpdate: (data) => updateDepense(depense.id, { ...data }),
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