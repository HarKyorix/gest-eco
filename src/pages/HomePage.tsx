import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Trash, Undo2, Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlanningStore, type Budget, type Depense, type Epargne, type Planning } from "@/store/db/planning"
import { useSourceStore } from "@/store/db/source"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BudgetSection, DepenseSection, EpargneSection } from "@/components/sections"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import TextEditable from "@/components/TextEditable"
import { useDiversStore } from "@/store/db/divers"
import { useCaisseStore } from "@/store/db/caisse"
import { useAppStore } from "@/store/app.store"
import { useBoardStore, type Board } from "@/store/db/board"
import { useSettingStore } from "@/store/setting.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BudgetAlert } from "@/components/BudgetAlert"
import { useDataExportImport } from "@/lib/exportImport"
import { ExportImportButtons } from "@/components/ExportImportButtons"
import { useToast } from "@/store/toast.store"
import { useHistory } from "@/hooks/useHistory"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"

export default function BoardDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const boardId = searchParams.get("boardId") || undefined
  const planningId = searchParams.get("planningId") || undefined

  const boardStore = useBoardStore()
  const planningStore = usePlanningStore()
  const sourceStore = useSourceStore()
  const diversStore = useDiversStore()
  const caisseStore = useCaisseStore()
  
  const appStore = useAppStore()
  const settingStore = useSettingStore()
  const navigate = useNavigate()
  const toast = useToast()
  const { exportData, importData } = useDataExportImport()
  const { undo, redo, canUndo, canRedo, saveSnapshot } = useHistory()
  const [isImporting, setIsImporting] = useState(false)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => planningId && canUndo && undo(planningId),
    onRedo: () => planningId && canRedo && redo(planningId),
    onEscape: () => appStore.closeForm(),
  })

  const currentBoard = useMemo(() => boardId ? boardStore.getOne(boardId) : null, [boardId, boardStore])
  const plannings = useMemo(() => planningStore.getList(boardId), [boardId, planningStore])
  const currentPlanning = useMemo(() => planningId ? planningStore.getOne({ id: planningId }) : null, [planningId, planningStore])
  const currentBudgetTotal = useMemo(() => currentPlanning?.budgets.reduce((total, b) => total + b.amount, 0) ?? 0, [currentPlanning])
  const currentDepenseTotal = useMemo(() => currentPlanning?.depenses.reduce((total, d) => total + d.amount, 0) ?? 0, [currentPlanning])
  const currentEpargneTotal = useMemo(() => currentPlanning?.epargnes.reduce((total, e) => total + e.amount, 0) ?? 0, [currentPlanning])

  // Calcul des totaux par caisse pour tous les plannings du board
  const caisseTotals = useMemo(() => {
    const totals: Record<string, { caisseTitle: string; total: number }> = {}

    // Initialiser avec toutes les caisses
    caisseStore.getList().forEach(caisse => {
      totals[caisse.id] = { caisseTitle: caisse.title, total: 0 }
    })

    // Calculer les totaux depuis tous les plannings
    plannings.forEach(planning => {
      planning.epargnes.forEach(epargne => {
        if (totals[epargne.caisseId]) {
          totals[epargne.caisseId].total += epargne.amount
        }
      })
    })

    return Object.values(totals).filter(item => item.total > 0)
  }, [plannings, caisseStore])

  useEffect(() => {
    if (!boardId) {
      setSearchParams({
        boardId: boardStore.list[0]?.id || "",
        planningId: planningStore.getList(boardStore.list[0]?.id)[0]?.id || "",
      })
      return
    }
  }, [boardStore,planningStore, planningId, boardId, setSearchParams])

  const handleAddPlanning = () => {
    const newPlanning: Partial<Planning> = { 
      title: `Nouveau planning ${plannings.length + 1}`, 
      boardId: boardId ?? undefined,
      budgets: currentPlanning?.budgets || [],
      depenses: currentPlanning?.depenses || [],
      epargnes: currentPlanning?.epargnes || [],
    }
    planningStore.add(newPlanning)
  }

  const handleUpdateBoard = (data: Partial<Board>) => {
    if (boardId) {
      boardStore.update(boardId, data)
    }
  }

  const handleExport = () => {
    try {
      exportData(
        {
          boards: boardStore.getList(),
          plannings: planningStore.getList(),
          caisses: caisseStore.getList(),
          sources: sourceStore.getList(),
          divers: diversStore.getList(),
        },
        settingStore,
        currentBoard ? currentBoard.title : "family-eco-backup"
      )
      toast.success("Export réussi", "Vos données ont été téléchargées")
    } catch (error) {
      console.log(error);
      toast.error("Erreur d'export", "Impossible d'exporter les données")
    }
  }

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true)
      const data = await importData(file)
      
      // Effacer les données existantes
      boardStore.clear()
      planningStore.clear()
      caisseStore.clear()
      sourceStore.clear()
      diversStore.clear()

      // Importer les nouvelles données
      data.boards.forEach((board) => boardStore.add(board))
      data.plannings.forEach((planning) => planningStore.add(planning))
      data.caisses.forEach((caisse) => caisseStore.add(caisse))
      data.sources.forEach((source) => sourceStore.add(source))
      data.divers.forEach((divers) => diversStore.add(divers))

      toast.success("Import réussi", "Vos données ont été importées avec succès")
      
      // Rafraîchir après un court délai
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      toast.error(
        "Erreur d'importation",
        error instanceof Error ? error.message : "Erreur lors de l'importation"
      )
    } finally {
      setIsImporting(false)
    }
  }

  // Vérifier que les paramètres requis sont présents
  if (!boardId || !planningId) {
    return <div>Paramètres manquants</div>
  }
  
  return (
    <>
      <div className="flex items-center gap-4 my-4">
        { !settingStore.displaySidebar && (
          <Button variant="outline" onClick={() => navigate("/board")} size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        )}
        { currentBoard ? (
          <TextEditable
            value={currentBoard.title}
            onSave={(value: string) => handleUpdateBoard({ title: value })}
          >
            <p className="text-2xl font-semibold">{currentBoard.title}</p>
          </TextEditable>
        ) : (
          <p className="text-2xl font-semibold">Tableau non trouvé</p>
        )}
        <div className="ml-auto flex gap-2">
          <ExportImportButtons
            onExport={handleExport}
            onImport={handleImport}
            disabled={isImporting}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAddPlanning()}
          >
            <Plus className="size-4" />
            <span className="sr-only">Ajouter un planning</span>
          </Button>
        </div>
      </div>
      
      {plannings.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des plannings...</p>
        </div>
      ) : (
        <Tabs
          value={planningId || plannings[0]?.id}
          onValueChange={(value) => {
            const nextPlanning = plannings.find((planning) => planning.id === value)
            if (nextPlanning) {
             setSearchParams({ boardId, planningId: nextPlanning.id })
            }
          }}
          className="flex-1 flex-col"
        >
          <TabsList className="w-full flex justify-start gap-2 overflow-x-auto">
            {plannings.map((planning) => (
              <TabsTrigger key={planning.id} value={planning.id} className="flex-none py-2">
                {planning.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <BudgetAlert
            budgetTotal={currentBudgetTotal}
            depenseTotal={currentDepenseTotal}
            epargneTotal={currentEpargneTotal}
            currency={settingStore.currency}
          />
          <TabsContent value={planningId} className="">
            <Card className="gap-1">
              <CardHeader className="relative">
                <CardTitle className="flex items-start justify-between gap-4">
                  <div className="text-left">
                    <TextEditable
                      value={currentPlanning?.title}
                      onSave={(value: string) => planningStore.update(planningId, { title: value })}
                    >
                      <p className="text-lg font-semibold">{currentPlanning?.title}</p>
                    </TextEditable>
                    <TextEditable
                      value={currentPlanning?.commentaire}
                      onSave={(value: string) => planningStore.update(planningId, { commentaire: value })}
                    >
                      <p className="text-sm text-muted-foreground">{currentPlanning?.commentaire || "Aucun commentaire"}</p>
                    </TextEditable>
                  </div>
                </CardTitle>
                <CardAction>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => undo(planningId)}
                      disabled={!canUndo}
                      title="Annuler (Ctrl+Z)"
                    >
                      <Undo2 className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => redo(planningId)}
                      disabled={!canRedo}
                      title="Rétablir (Ctrl+Y)"
                    >
                      <Redo2 className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => appStore.openDialog({
                        title: "Supprimer le planning",
                        description: `Êtes-vous sûr de vouloir supprimer "${currentPlanning?.title}" ?`,
                        onConfirm: () => {
                          planningStore.remove(planningId)
                          toast.success("Planning supprimé", `Le planning "${currentPlanning?.title}" a été supprimé`)
                          navigate(`/board/${boardId}`)
                        },
                      })}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="max-h-[30vh] overflow-y-auto px-4">
                <div className="mt-4 grid gap-4 xl:grid-cols-3">
                  <BudgetSection 
                    currency={settingStore.currency}
                    currentBudgetTotal={currentBudgetTotal}
                    budgets={currentPlanning?.budgets || []} 
                    sources={sourceStore.getList()}
                    addBudget={() => appStore.openForm({
                      title: "Ajouter un budget",
                      description: "Entrez les détails du nouveau budget",
                      fields: [
                        { id: "amount", name: "amount", label: "Montant", type: "number" },
                        { id: "sourceId", name: "sourceId", label: "Source", type: "select", options: sourceStore.getList().map(s => ({ label: s.title, value: s.id })) }
                      ],
                      onSubmit: (formData) => {
                        planningStore.addBudget(planningId, { 
                          amount: parseFloat(formData.amount as string),
                          sourceId: formData.sourceId as string,
                        })
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Budget ajouté")
                      }
                    })}
                    updateBudget={(id: string, data: Partial<Budget>) => {
                      planningStore.updateBudget(planningId, id, data)
                      const updated = planningStore.getOne({ id: planningId })
                      if (updated) saveSnapshot(updated, "Budget modifié")
                    }}
                    deleteBudget={(id: string) => appStore.openDialog({
                      title: "Supprimer le budget",
                      description: `Êtes-vous sûr de vouloir supprimer ce budget ?`,
                      onConfirm: () => {
                        planningStore.removeBudget(planningId, id)
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Budget supprimé")
                        toast.success("Budget supprimé", "Le budget a été supprimé avec succès")
                      }
                    })}
                  />
                  <DepenseSection 
                    currency={settingStore.currency}
                    currentDepenseTotal={currentDepenseTotal}
                    divers={diversStore.getList()}
                    depenses={currentPlanning?.depenses || []} 
                    addDepense={() => appStore.openForm({
                      title: "Ajouter une dépense",
                      description: "Entrez les détails de la nouvelle dépense",
                      fields: [
                        { id: "amount", name: "amount", label: "Montant", type: "number", max: Math.max(0, currentBudgetTotal - currentDepenseTotal).toString(), min: "0" },
                        { id: "diversId", name: "diversId", label: "Divers", type: "select", options: diversStore.getList().map(d => ({ label: d.title, value: d.id })) }
                      ],
                      onSubmit: (formData) => {
                        planningStore.addDepense(planningId, { 
                          amount: parseFloat(formData.amount as string), 
                          diversId: formData.diversId as string 
                        })
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Dépense ajoutée")
                      }
                    })}
                    updateDepense={(id: string, data: Partial<Depense>) => {
                      planningStore.updateDepense(planningId, id, data)
                      const updated = planningStore.getOne({ id: planningId })
                      if (updated) saveSnapshot(updated, "Dépense modifiée")
                    }}
                    deleteDepense={(id: string) => appStore.openDialog({
                      title: "Supprimer la dépense",
                      description: `Êtes-vous sûr de vouloir supprimer cette dépense ?`,
                      onConfirm: () => {
                        planningStore.removeDepense(planningId, id)
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Dépense supprimée")
                        toast.success("Dépense supprimée", "La dépense a été supprimée avec succès")
                      }
                    })}
                  />
                  <EpargneSection 
                    currency={settingStore.currency}
                    currentEpargneTotal={currentEpargneTotal}
                    caisses={caisseStore.getList()}
                    epargnes={currentPlanning?.epargnes || []}
                    addEpargne={() => appStore.openForm({
                      title: "Ajouter une épargne",
                      description: "Entrez les détails de la nouvelle épargne",
                      fields: [
                        { id: "amount", name: "amount", label: "Montant", type: "number", max: Math.max(0, currentBudgetTotal - currentDepenseTotal - currentEpargneTotal).toString(), min: "0" },
                        { id: "caisseId", name: "caisseId", label: "Caisse", type: "select", options: caisseStore.getList().map(c => ({ label: c.title, value: c.id })) }
                      ],
                      onSubmit: (formData) => {
                        planningStore.addEpargne(planningId, { 
                          amount: parseFloat(formData.amount as string), 
                          caisseId: formData.caisseId as string 
                        })
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Épargne ajoutée")
                      }
                    })}
                    updateEpargne={(id: string, data: Partial<Epargne>) => {
                      planningStore.updateEpargne(planningId, id, data)
                      const updated = planningStore.getOne({ id: planningId })
                      if (updated) saveSnapshot(updated, "Épargne modifiée")
                    }}
                    deleteEpargne={(id: string) => appStore.openDialog({
                      title: "Supprimer l'épargne",
                      description: `Êtes-vous sûr de vouloir supprimer cette épargne ?`,
                      onConfirm: () => {
                        planningStore.removeEpargne(planningId, id)
                        const updated = planningStore.getOne({ id: planningId })
                        if (updated) saveSnapshot(updated, "Épargne supprimée")
                        toast.success("Épargne supprimée", "L'épargne a été supprimée avec succès")
                      }
                    })}
                  />
                </div>
              </CardContent>

              <CardFooter className="mt-6">
                <div className="w-full">
                  {caisseTotals.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Caisse</TableHead>
                          <TableHead className="text-right">Total épargné</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {caisseTotals.map((item, index) => (
                          <TableRow key={index} className="text-left">
                            <TableCell className="text-left font-medium">{item.caisseTitle}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {item.total} {settingStore.currency}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2">
                          <TableCell className="text-left font-bold">Total général</TableCell>
                          <TableCell className="text-right font-bold">
                            {caisseTotals.reduce((sum, item) => sum + item.total, 0)} {settingStore.currency}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune épargne enregistrée dans les caisses pour ce tableau.
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
