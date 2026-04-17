import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Depense } from "@/store/planning"

interface DepenseSectionProps {
  depenses: Depense[]
  addDepense: (data: Partial<Depense>) => void
  updateDepense: (id: string, data: Partial<Depense>) => void
  deleteDepense: (id: string) => void
}

export function DepenseSection({ depenses, addDepense, updateDepense, deleteDepense }: DepenseSectionProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Dépenses</span>
        <Button variant="default" size="icon" onClick={() => addDepense({ amount: 0, diversId: "" })}>
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une dépense</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          list={depenses.map((depense) => ({
            title: `Dépense ${depense.id.slice(0, 8)}`, // Placeholder title
            amount: depense.amount,
            onUpdate: (data) => updateDepense(depense.id, { amount: data.amount, commentaire: data.commentaire }),
            onDelete: () => deleteDepense(depense.id),
          }))}
        />
      </CardContent>
    </Card>
  )
}