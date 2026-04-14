import { type Table } from "@/store/table"
import { Button } from "@/components/ui/button"
import { PieChart, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { DropdownMenuDestructive } from "../DropdownMenuDestructive"

interface SidebarSectionProps {
  currentTableId: string | null
  tables?: Table[]
  navigate: (path: string) => void
  onUpdateTable: (id: string, data: Partial<Table>) => void
  onAddTable: () => void
  onRemoveTable: (id: string) => void
}

export function SidebarSection({
  currentTableId,
  tables,
  navigate,
  onAddTable,
  // onUptadeTable,
  // onRemoveTable,
}: SidebarSectionProps) {
  return (
    <Sidebar className="w-(--sidebar-width) bg-slate-950/95 text-white shadow-lg">
      <SidebarHeader className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Family Eco</p>
            <p className="text-xs text-white/70">Budget management, simplified.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onAddTable()}
            size="icon"
          >
            <Plus />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          { tables?.map((table) => (
            <SidebarMenuItem key={table.id} className="flex">
              <SidebarMenuButton
                isActive={currentTableId === table.id}
                onClick={() => navigate(table.id)}
              >
                <PieChart className="size-4" />
                <span>{table.title}</span>
              </SidebarMenuButton>
              <DropdownMenuDestructive onUpdate={() => {}} onDelete={() => {}} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 px-4 py-4">
        {/* <Button variant="outline" className="w-full" onClick={() => onAddTable()}>
          Add Table
        </Button> */}
      </SidebarFooter>
    </Sidebar>
  )
}
