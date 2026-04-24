import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDestructive({onUpdate, onDelete}: {onUpdate?: (data: unknown) => void, onDelete?: () => void}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {onUpdate && (
            <DropdownMenuItem onClick={onUpdate}>
              
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {onDelete && (
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
