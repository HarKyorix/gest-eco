import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar"
import { useBoardStore } from "@/store/db/board"
import { Outlet, useNavigate, useSearchParams } from "react-router-dom"
import { Select,SelectContent,SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Moon, PieChart, Sun } from "lucide-react"
import { useSettingStore } from "@/store/setting.store"

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { usePlanningStore } from "@/store/db/planning"
import { Button } from "./ui/button"

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams()

  const boardId = searchParams.get("boardId") || undefined

  const boardStore = useBoardStore()
  const planningStore = usePlanningStore()
  const settingStore = useSettingStore()
  
  const navigate = useNavigate()

  const handleGotoDetail = (id: string) => {
    setSearchParams({ 
      boardId: id, 
      planningId: planningStore.getList(id)[0]?.id || "" 
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
            Family Eco
          </SidebarHeader>

          <SidebarContent className="mt-8 px-2 py-3">
            <SidebarMenu className="flex flex-col gap-4">
              <SidebarMenuItem className="flex">
                <SidebarMenuButton
                  onClick={() => navigate("/board")}
                >
                  <PieChart className="size-4" />
                  <span>Boards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex">
                <SidebarMenuButton
                  onClick={() => navigate("/source")}
                >
                  <PieChart className="size-4" />
                  <span>Sources</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex">
                <SidebarMenuButton
                  onClick={() => navigate("/divers")}
                >
                  <PieChart className="size-4" />
                  <span>Divers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex">
                <SidebarMenuButton
                  onClick={() => navigate("/caisse")}
                >
                  <PieChart className="size-4" />
                  <span>Caisses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
          </SidebarContent>
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
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              { boardId && (
              <Select onValueChange={(value: string | null) => value && handleGotoDetail(value)} value={boardId || ""}>
                <SelectTrigger>
                  <SelectValue> {boardId ? boardStore.getOne(boardId)?.title || "Sélectionner un tableau" : "Sélectionner un tableau"} </SelectValue>
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
            { !settingStore.displaySidebar && (
            <Menubar className="justify-between">
              <MenubarMenu>
                <MenubarTrigger onClick={()=>navigate("/board")}>
                  Board
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger onClick={()=>navigate("/source")}>
                  Source
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger onClick={()=>navigate("/divers")}>
                  Divers
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger onClick={()=>navigate("/caisse")}>
                  Caisse
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
            )}
             <Button
              variant="default"
              size="icon"
              onClick={() => settingStore.setPreferances('theme', settingStore.theme === 'light' ? 'dark' : 'light')}
            >
              { settingStore.theme === 'light' ? 
                <Sun className="size-4" />
                : 
                <Moon className="size-4" />
              }
            </Button>
          </div>
          
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}