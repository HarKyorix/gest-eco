
import { usePlanningStore } from "@/store/planning"
import { useTableStore } from "@/store/table"
import { useNavigate } from "react-router-dom"



export default function HomePage() {
  const tableStore = useTableStore()
  const planningStore = usePlanningStore()
  const navigate = useNavigate()

  const onAddTable = () => {
    const newTable = {
      title: "Nouveau tableau",
    }
    tableStore.add(newTable)
  }

  const onViewDetail = (id: string) => {
    navigate(`/detail/${id}`)
  }
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Accueil</h2>
            <p className="text-sm text-muted-foreground">
              Gérer vos tableaux et accéder à la page de détail.
            </p>
          </div>
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              onClick={onAddTable}
            >
              Nouveau tableau
            </button>
        </div>

        {tableStore.list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucun tableau disponible. Créez-en un pour commencer.
          </div>
        ) : (
          <div className="grid gap-4">
            {tableStore.list.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => onViewDetail(table.id)}
                className="w-full rounded-3xl border p-4 text-left transition hover:border-primary hover:bg-muted"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{table.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {/* Créé le {table.createdAt.toLocaleDateString()} */}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {planningStore.getList(table.id).length} plans
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
