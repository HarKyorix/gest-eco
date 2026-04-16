
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { type Budget, type Depense, type Epargne } from '../store/planning'
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type ItemWithActions = (Partial<Budget | Depense | Epargne>) & {
  title?: string;
  onUpdate?: (id: string, data: Partial<Budget | Depense | Epargne>) => void
  onDelete?: (id: string) => void
}

export function ItemGroupContainer({ list }: { list: ItemWithActions[] }) {
  return (
    <ItemGroup className="max-w-sm">
      {list.map((item, index) => (
        <Item key={index} variant="outline" className="flex items-start border-1 rounded-xl border-muted">
          <ItemContent className="gap-1">
            <ItemTitle className="w-full flex items-center justify-between">
              <span>{item.title}</span>
              <span>{item.amount}F</span>
            </ItemTitle>
            {item.commentaire && (
              <ItemDescription className="text-xs">{item.commentaire}</ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            {item.onDelete && item.id && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => item.onDelete!(item.id!)}
              >
                <Trash className="size-4" />
              </Button>
            )}
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
