
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import TextEditable from "./TextEditable";

type ItemWithActions = {
  title?: string;
  amount?: number;
  commentaire?: string;
  onUpdate?: (data: { title?: string; amount?: number; commentaire?: string }) => void;
  onDelete?: () => void;
}

export function ItemGroupContainer({ list }: { list: ItemWithActions[] }) {
  return (
    <ItemGroup className="max-w-sm">
      {list.map((item, index) => (
        <Item key={index} variant="outline" className="flex items-start border-1 rounded-xl border-muted">
          <ItemContent className="gap-1">
            <ItemTitle className="w-full flex items-center justify-between">
              <span>{item.title}</span>
              {item.onUpdate ? (
                <TextEditable
                  value={item.amount?.toString() || "0"}
                  onSave={(value) => item.onUpdate!({ amount: parseFloat(value) || 0 })}
                  type="number"
                  className="text-right"
                >
                  <span>{item.amount}F</span>
                </TextEditable>
              ) : (
                <span>{item.amount}F</span>
              )}
            </ItemTitle>
            {item.commentaire && (
              <ItemDescription className="text-xs">
                {item.onUpdate ? (
                  <TextEditable
                    value={item.commentaire}
                    onSave={(value) => item.onUpdate!({ commentaire: value })}
                  >
                    {item.commentaire}
                  </TextEditable>
                ) : (
                  item.commentaire
                )}
              </ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            {item.onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => item.onDelete!()}
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
