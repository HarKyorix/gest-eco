import { type Board } from "@/store/board"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PieChart, Plus, Trash } from "lucide-react"
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

interface SidebarSectionProps {
  currentBoardId: string | null
  boards?: Board[]
  goBack: () => void
  gotoDetail: (id: string) => void
  onAddBoard: () => void
  onRemoveBoard: (id: string) => void
}

export function SidebarSection({
  currentBoardId,
  boards,
  goBack,
  gotoDetail,
  onAddBoard,
  onRemoveBoard,
}: SidebarSectionProps) {
  return (
    <Sidebar className="w-(--sidebar-width) bg-slate-950/95 text-white shadow-lg">
      <SidebarHeader className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="icon" onClick={goBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <p className="text-sm font-semibold">Family Eco</p>
          <Button 
            variant="outline" 
            onClick={() => onAddBoard()}
            size="icon"
          >
            <Plus />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-8 px-2 py-3">
        <SidebarMenu className="flex flex-col gap-4">
          { boards?.map((board) => (
            <SidebarMenuItem key={board.id} className="flex">
              <SidebarMenuButton
                isActive={currentBoardId === board.id}
                onClick={() => gotoDetail(board.id)}
              >
                <PieChart className="size-4" />
                <span>{board.title}</span>
              </SidebarMenuButton>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => onRemoveBoard(board.id)}
              >
                <Trash className="size-4" />
              </Button>
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
