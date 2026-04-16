import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Board } from "@/store/board"
import TextEditable from "../TextEditable"

interface DashboardHeaderSectionProps {
  selectedBoard?: Board
  onUpdateBoard: (data: Partial<Board>) => void
}

export function DashboardHeaderSection({
  selectedBoard,
  onUpdateBoard 
}: DashboardHeaderSectionProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
      <SidebarTrigger />
      {selectedBoard ? (
        <TextEditable
          value={selectedBoard.title}
          onSave={(value: string) => onUpdateBoard({ title: value })}
        >
          <p className="text-2xl font-semibold">{selectedBoard.title}</p>
        </TextEditable>
      ) : (
        <p className="text-2xl font-semibold">Tableau non trouvé</p>
      )}
    </div>
  )
}
