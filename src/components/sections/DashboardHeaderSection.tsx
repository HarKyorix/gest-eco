import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Table } from "@/store/table"

interface DashboardHeaderSectionProps {
  selectedTable?: Table
}

export function DashboardHeaderSection({
  selectedTable,
}: DashboardHeaderSectionProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
      <SidebarTrigger />
      <p className="text-2xl font-semibold">{selectedTable?.title}</p>
    </div>
  )
}
