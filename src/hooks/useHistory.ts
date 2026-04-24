import { useCallback, useRef } from "react"
import { usePlanningStore, type Budget, type Depense, type Epargne, type Planning } from "@/store/db/planning"
import { useHistoryStore, type HistoryState } from "@/store/history.store"
import { useToast } from "@/store/toast.store"

export function useHistory() {
  const planningStore = usePlanningStore()
  const history = useHistoryStore()
  const toast = useToast()
  const skipHistoryRef = useRef(false)

  const captureState = useCallback(
    (planning: Planning): HistoryState => {
      return {
        budgets: planning.budgets.map((b: Budget) => ({
          id: b.id,
          commentaire: b.commentaire,
          amount: b.amount,
          sourceId: b.sourceId,
        })),
        depenses: planning.depenses.map((d: Depense) => ({
          id: d.id,
          commentaire: d.commentaire,
          amount: d.amount,
          diversId: d.diversId,
          caisseId: d.caisseId,
        })),
        epargnes: planning.epargnes.map((e: Epargne) => ({
          id: e.id,
          commentaire: e.commentaire,
          amount: e.amount,
          caisseId: e.caisseId,
        })),
      }
    },
    []
  )

  const saveSnapshot = useCallback(
    (planning: Planning, description: string) => {
      if (skipHistoryRef.current) {
        skipHistoryRef.current = false
        return
      }

      const state = captureState(planning)
      history.push(state, description)
    },
    [captureState, history]
  )

  const restoreState = useCallback(
    (planningId: string, state: HistoryState | null) => {
      if (!state) return

      skipHistoryRef.current = true
      const planning = planningStore.getOne({ id: planningId })
      if (!planning) return

      // Créer des sets des IDs actuels et nouveaux
      const newBudgetIds = new Set(state.budgets.map((b) => b.id))
      const newDepenseIds = new Set(state.depenses.map((d) => d.id))
      const newEpargneIds = new Set(state.epargnes.map((e) => e.id))

      // Supprimer les budgets qui ne sont pas dans le nouvel état
      planning.budgets.forEach((budget) => {
        if (!newBudgetIds.has(budget.id)) {
          planningStore.removeBudget(planningId, budget.id)
        }
      })

      // Supprimer les dépenses qui ne sont pas dans le nouvel état
      planning.depenses.forEach((depense) => {
        if (!newDepenseIds.has(depense.id)) {
          planningStore.removeDepense(planningId, depense.id)
        }
      })

      // Supprimer les épargnes qui ne sont pas dans le nouvel état
      planning.epargnes.forEach((epargne) => {
        if (!newEpargneIds.has(epargne.id)) {
          planningStore.removeEpargne(planningId, epargne.id)
        }
      })

      // Mettre à jour ou ajouter les budgets
      state.budgets.forEach((budget) => {
        const existing = planning.budgets.find((b) => b.id === budget.id)
        if (existing) {
          planningStore.updateBudget(planningId, budget.id, {
            amount: budget.amount,
            sourceId: budget.sourceId,
            commentaire: budget.commentaire,
          })
        } else {
          planningStore.addBudget(planningId, {
            amount: budget.amount,
            sourceId: budget.sourceId,
            commentaire: budget.commentaire,
          })
        }
      })

      // Mettre à jour ou ajouter les dépenses
      state.depenses.forEach((depense) => {
        const existing = planning.depenses.find((d) => d.id === depense.id)
        if (existing) {
          planningStore.updateDepense(planningId, depense.id, {
            amount: depense.amount,
            diversId: depense.diversId,
            commentaire: depense.commentaire,
          })
        } else {
          planningStore.addDepense(planningId, {
            amount: depense.amount,
            diversId: depense.diversId,
            commentaire: depense.commentaire,
          })
        }
      })

      // Mettre à jour ou ajouter les épargnes
      state.epargnes.forEach((epargne) => {
        const existing = planning.epargnes.find((e) => e.id === epargne.id)
        if (existing) {
          planningStore.updateEpargne(planningId, epargne.id, {
            amount: epargne.amount,
            caisseId: epargne.caisseId,
            commentaire: epargne.commentaire,
          })
        } else {
          planningStore.addEpargne(planningId, {
            amount: epargne.amount,
            caisseId: epargne.caisseId,
            commentaire: epargne.commentaire,
          })
        }
      })

      skipHistoryRef.current = false
    },
    [planningStore]
  )

  const undo = useCallback(
    (planningId: string) => {
      const prevState = history.undo()
      if (prevState) {
        restoreState(planningId, prevState)
        toast.info("Annulé", "Modification annulée")
      }
    },
    [history, restoreState, toast]
  )

  const redo = useCallback(
    (planningId: string) => {
      const nextState = history.redo()
      if (nextState) {
        restoreState(planningId, nextState)
        toast.info("Rétabli", "Modification rétablie")
      }
    },
    [history, restoreState, toast]
  )

  const clearHistory = useCallback(() => {
    history.clear()
  }, [history])

  return {
    saveSnapshot,
    undo,
    redo,
    clearHistory,
    canUndo: history.canUndo(),
    canRedo: history.canRedo(),
  }
}
