
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { DropdownMenuDestructive } from "./DropdownMenuDestructive"
import { type Budget, type Depense, type Epargne } from '../store/planning'

type ItemWithActions = (Partial<Budget | Depense | Epargne>) & {
  title?: string;
  update?: () => void
  delete?: () => void
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
            <DropdownMenuDestructive 
              onUpdate={() => item.update?.()}
              onDelete={() => item.delete?.()} 
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
