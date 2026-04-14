import { DashboardHeaderSection, SidebarSection } from "@/components/sections"
import { type Planning } from "../store/planning"
import { DashboardContentSection } from "@/components/sections/DashboardContentSection"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { usePlanningStore } from "@/store/planning"
import { useNavigate, useParams } from "react-router-dom"
import { useTableStore, type Table } from "@/store/table"
import { useMemo } from "react"


export default function DetailPage() {
  const tableStore = useTableStore()
  const planningStore = usePlanningStore()
  const navigate = useNavigate()
  const { tableId } = useParams<{ tableId?: string }>()

  const currentTable = useMemo(() => {
    if (tableId) {
      return tableStore.getOne(tableId)
    }
    return null
  }, [tableId, tableStore])


  return (
      <SidebarProvider className="w-full min-h-svh bg-background text-foreground">
        <div className="w-full flex min-h-svh">
          <SidebarSection
            tables={tableStore.getList()}
            currentTableId={tableId ?? null}
            navigate={(id: string) => navigate(`/detail/${id}`)}
            onAddTable={() => tableStore.add({ title: "Nouveau tableau"+tableStore.list.length })}
            onUpdateTable={(id: string, data: Partial<Table>) => tableStore.update(id, data)}
            onRemoveTable={(id: string) => tableStore.remove(id)}
          />
  
          <SidebarInset className="min-h-svh flex-1 bg-background p-4">
            <DashboardHeaderSection
              selectedTable={currentTable ?? undefined}
            />
            <DashboardContentSection
              currentTableId={tableId ?? null}
              onPlanningInit={() => planningStore.init(tableId ?? undefined)}
              plannings={planningStore.getList(tableId ?? undefined)}
              onAddPlanning={() => planningStore.add({ title: "Nouveau planning"+planningStore.list.length, tableId: tableId ?? undefined })}
              onUptadePlanning={(id: string, data: Partial<Planning>) => planningStore.update(id, data)}
              onRemovePlanning={(id: string) => planningStore.remove(id)}
              onAddDepense={(planningId: string) => planningStore.addDepense(planningId, { amount: 0 })}
              onUptadeDepense={(planningId: string, id: string, data: Partial<Planning>) => planningStore.updateDepense(planningId, id, data)}
              onRemoveDepense={(planningId: string, id: string) => planningStore.removeDepense(planningId, id)}
              onAddBudget={(planningId: string) => planningStore.addBudget(planningId, { amount: 0 })}
              onUptadeBudget={(planningId: string, id: string, data: Partial<Planning>) => planningStore.updateBudget(planningId, id, data)}
              onRemoveBudget={(planningId: string, id: string) => planningStore.removeBudget(planningId, id)}
              onAddEpargne={(planningId: string) => planningStore.addEpargne(planningId, { amount: 0 })}
              onUptadeEpargne={(planningId: string, id: string, data: Partial<Planning>) => planningStore.updateEpargne(planningId, id, data)}
              onRemoveEpargne={(planningId: string, id: string) => planningStore.removeEpargne(planningId, id)} 
            />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
