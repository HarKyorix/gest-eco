import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"

interface EpargneSectionProps {
  planningId: string
}

export function EpargneSection({ planningId }: EpargneSectionProps) {
  // TODO: Use planningId for dynamic savings management
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Épargnes</span>
        <Button variant="default" size="icon">
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une épargne</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        planningId: {planningId} {/* Displaying planningId for debugging purposes */}
        <ItemGroupContainer
          list={[
            {
              title: "Épargne 1",
              amount: 1000,
              commentaire: "Pour les vacances",
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Épargne 2",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Épargne 3",
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