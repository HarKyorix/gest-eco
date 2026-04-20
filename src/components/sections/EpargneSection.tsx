import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"
import { Button } from "@/components/ui/button"
import { type Epargne } from "@/store/db/planning"
import type { Caisse } from "@/store/db/caisse"

interface EpargneSectionProps {
  currency?: string;
  currentEpargneMax: number;
  caisses: Caisse[]
  epargnes: Epargne[]
  addEpargne: () => void
  updateEpargne: (id: string, data: Partial<Epargne>) => void
  deleteEpargne: (id: string) => void
}

export function EpargneSection({ currentEpargneMax, currency, caisses, epargnes, addEpargne, updateEpargne, deleteEpargne }: EpargneSectionProps) {
  
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Épargnes</span>
        <Button variant="outline" size="icon" onClick={addEpargne}>
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une épargne</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        <ItemGroupContainer
          currency={currency}
          list={epargnes.map((epargne) => ({
            title: caisses.find((c) => c.id === epargne.caisseId)?.title || `Épargne ${epargne.id.slice(0, 8)}`,
            amount: epargne.amount,
            commentaire: epargne.commentaire,
            onUpdate: (data) => updateEpargne(epargne.id, { amount: data.amount, commentaire: data.commentaire }),
            onDelete: () => deleteEpargne(epargne.id),
          }))}
        />
      </CardContent>
      <CardFooter className="p-2">
        <p className="text-xs text-muted-foreground">
          {currentEpargneMax ? (
            <>
              Total actuel : <span className="font-medium">{currentEpargneMax} {currency}</span>
            </>
          ) : (
            <>Aucune épargne définie pour cette période.</>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}