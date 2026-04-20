import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar"
import { useBoardStore } from "@/store/db/board"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useAppStore } from "@/store/app.store"
import { Button } from "./ui/button"
import { Select,SelectContent,SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ArrowLeft, PieChart, Plus, Trash } from "lucide-react"
import { useSettingStore } from "@/store/setting.store"


export default function BoardLayout() {
  const boardStore = useBoardStore()
  const appStore = useAppStore()
  const settingStore = useSettingStore()
  
  const navigate = useNavigate()
  const { boardId } = useParams<{ boardId?: string }>()


  const handleGoBack = () => {
    navigate("/board")
  }

  const handleGotoDetail = (id: string) => {
    navigate(`/board/${id}`)
  }

  const handleAddBoard = () => {
    boardStore.add({ title: `Nouveau tableau ${boardStore.list.length + 1}` })
  }

  const handleRemoveBoard = (id: string) => {
    appStore.openDialog({
      title: "Supprimer la tableau",
      description: `Êtes-vous sûr de vouloir supprimer "${boardStore.getOne(id)?.title}" ?`,
      onConfirm: () => boardStore.remove(id)
    })
  }

  return (
    <SidebarProvider 
      open={settingStore.displaySidebar} 
      onOpenChange={(open) => settingStore.setPreferances('displaySidebar', open)} 
      className="w-full min-h-svh bg-background text-foreground">
      <div className="w-full flex min-h-svh">
        <Sidebar className="w-(--sidebar-width) bg-slate-950/95 text-white shadow-lg">
          <SidebarHeader className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="icon" onClick={handleGoBack}>
                <ArrowLeft className="size-4" />
              </Button>
              <p className="text-sm font-semibold">Family Eco</p>
              <Button 
                variant="outline" 
                onClick={() => handleAddBoard()}
                size="icon"
              >
                <Plus />
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent className="mt-8 px-2 py-3">
            <SidebarMenu className="flex flex-col gap-4">
              { boardStore.getList()?.map((board) => (
                <SidebarMenuItem key={board.id} className="flex">
                  <SidebarMenuButton
                    isActive={boardId === board.id}
                    onClick={() => handleGotoDetail(board.id)}
                  >
                    <PieChart className="size-4" />
                    <span>{board.title}</span>
                  </SidebarMenuButton>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleRemoveBoard(board.id)}
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

        <SidebarInset 
          className={
            `min-h-svh 
            ${ settingStore.displaySidebar ?
              " flex-1 "
              :
              " mx-auto max-w-7xl "
            } 
            bg-background p-4 overflow-x-hidden`
          }
        >
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <SidebarTrigger />
            { !settingStore.displaySidebar && (
              <Select onValueChange={(value: string) => handleGotoDetail(value)} defaultValue={boardId}>
                <SelectTrigger>
                  <SelectValue> {boardStore.getOne(boardId)?.title || "Sélectionner un tableau"} </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {boardStore.getList().filter(b=> b.id !== boardId)?.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

          </div>
          
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}