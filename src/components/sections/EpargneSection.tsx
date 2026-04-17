import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { type Epargne } from "@/store/planning"

interface EpargneSectionProps {
  epargnes: Epargne[]
  addEpargne: (data: Partial<Epargne>) => void
  updateEpargne: (id: string, data: Partial<Epargne>) => void
  deleteEpargne: (id: string) => void
}

export function EpargneSection({ epargnes, addEpargne, updateEpargne, deleteEpargne }: EpargneSectionProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Épargnes</span>
        <Button variant="default" size="icon" onClick={() => addEpargne({ amount: 0, caisseId: "" })}>
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une épargne</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          list={epargnes.map((epargne) => ({
            title: `Épargne ${epargne.id.slice(0, 8)}`, // Placeholder title
            amount: epargne.amount,
            commentaire: epargne.commentaire,
            onUpdate: (data) => updateEpargne(epargne.id, { amount: data.amount, commentaire: data.commentaire }),
            onDelete: () => deleteEpargne(epargne.id),
          }))}
        />
      </CardContent>
    </Card>
  )
}