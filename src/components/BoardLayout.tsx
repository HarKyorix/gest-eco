import { DashboardHeaderSection, SidebarSection } from "@/components/sections"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useBoardStore, type Board } from "@/store/board"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useMemo } from "react"


export default function BoardLayout() {
  const boardStore = useBoardStore()
  const navigate = useNavigate()
  const { boardId } = useParams<{ boardId?: string }>()

  const currentBoard = useMemo(() => {
    if (boardId) {
      return boardStore.getOne(boardId)
    }
    return null
  }, [boardId, boardStore])

  const handleGoBack = () => {
    navigate("/")
  }

  const handleGotoDetail = (id: string) => {
    navigate(`/board/${id}`)
  }

  const handleAddBoard = () => {
    boardStore.add({ title: `Nouveau tableau ${boardStore.list.length + 1}` })
  }

  const handleRemoveBoard = (id: string) => {
    boardStore.remove(id)
  }

  const handleUpdateBoard = (data: Partial<Board>) => {
    if (boardId) {
      boardStore.update(boardId, data)
    }
  }

  return (
    <SidebarProvider className="w-full min-h-svh bg-background text-foreground">
      <div className="w-full flex min-h-svh">
        <SidebarSection
          boards={boardStore.getList()}
          currentBoardId={boardId ?? null}
          goBack={handleGoBack}
          gotoDetail={handleGotoDetail}
          onAddBoard={handleAddBoard}
          onRemoveBoard={handleRemoveBoard}
        />

        <SidebarInset className="min-h-svh flex-1 bg-background p-4 overflow-x-hidden">
          <DashboardHeaderSection
            selectedBoard={currentBoard ?? undefined}
            onUpdateBoard={handleUpdateBoard}
          />
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}