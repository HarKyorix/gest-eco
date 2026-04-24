
import {  Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import TextEditable from "./TextEditable";
import { DropdownMenuDestructive } from "./DropdownMenuDestructive";
import type { Budget, Depense, Epargne } from "@/store/db/planning";

type ItemWithActions = {
  title?: string;
  amount?: number;
  commentaire?: string;
  onUpdate?: (data: Partial<Budget | Depense | Epargne>) => void;
  onUpdateModal?: (data: Partial<Budget | Depense | Epargne>) => void;
  onDelete?: () => void;
}

export function ItemGroupContainer({ currency, list }: { currency?: string; list: ItemWithActions[] }) {
  return (
    <ItemGroup className="w-full">
      {list.map((item, index) => (
        <Item key={index} variant="outline" className="flex items-start border-1 rounded-xl border-muted">
          <ItemContent className="gap-1">
            <ItemTitle className="w-full flex items-center justify-between">
              {item.commentaire ? 
                item.onUpdate ? (
                  <TextEditable
                    value={item.commentaire}
                    onSave={(value) => item.onUpdate!({ commentaire: value })}
                    className="text-left"
                  >
                    {item.commentaire}
                  </TextEditable>
                ) 
                :
                (<span className="w-1/2 text-left truncate">{item.commentaire}</span>)
                :
                <span className="w-1/2 text-left truncate">{item.title}</span>
              }
              {item.onUpdate ? (
                <TextEditable
                  value={item.amount?.toString() || "0"}
                  onSave={(value) => item.onUpdate!({ amount: parseFloat(value) || 0 })}
                  type="number"
                  className="text-right"
                >
                  <span className="text-xs">{item.amount} {currency}</span>
                </TextEditable>
              ) : (
                <span className="text-xs">{item.amount} {currency}</span>
              )}
            </ItemTitle>
            <ItemDescription className="text-left text-xs">
              {item.commentaire ? 
                (<span>{item.title}</span>)
                :
                item.onUpdate ? (
                  <TextEditable
                    value={item.commentaire}
                    onSave={(value) => item.onUpdate!({ commentaire: value })}
                  >
                    {item.commentaire}
                  </TextEditable>
                ) 
                :
                (<span>{item.commentaire}</span>)
              }
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <DropdownMenuDestructive
              onUpdate={(data) => item.onUpdateModal?.(data as Partial<Budget | Depense | Epargne>)}
              onDelete={item.onDelete}
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
