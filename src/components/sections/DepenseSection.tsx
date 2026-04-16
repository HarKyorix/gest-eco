import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemGroupContainer } from "@/components/ItemGroupContainer"

interface DepenseSectionProps {
  planningId: string
}

export function DepenseSection({ planningId }: DepenseSectionProps) {
  // TODO: Use planningId for dynamic expense management
  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardTitle className="flex items-center justify-between gap-2">
        <span className="font-medium">Dépenses</span>
        <Button variant="default" size="icon">
          <Plus className="size-4" />
          <span className="sr-only">Ajouter une dépense</span>
        </Button>
      </CardTitle>
      <CardContent className="text-sm text-muted-foreground">
        planningId: {planningId} {/* Displaying planningId for debugging purposes */}
        <ItemGroupContainer
          list={[
            {
              title: "Dépense 1",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Dépense 2",
              amount: 1000,
              onUpdate: () => {},
              onDelete: () => {},
            },
            {
              title: "Dépense 3",
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