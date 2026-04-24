import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export interface HistoryState {
  budgets: Array<{ 
    id: string
    sourceId: string
    amount: number
    commentaire?: string
  }>
  depenses: Array<{ 
    id: string
    diversId?: string
    caisseId?: string
    amount: number
    commentaire?: string
  }>
  epargnes: Array<{ 
    id: string
    caisseId: string
    amount: number
    commentaire?: string
  }>
}

export interface HistoryEntry {
  id: string
  timestamp: number
  state: HistoryState
  description: string
}

interface HistoryStore {
  history: HistoryEntry[]
  currentIndex: number
  maxHistorySize: number
  
  push: (state: HistoryState, description: string) => void
  undo: () => HistoryState | null
  redo: () => HistoryState | null
  clear: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  getCurrentState: () => HistoryState | null
}

export const useHistoryStore = create<HistoryStore>()(
  subscribeWithSelector((set, get) => ({
    history: [],
    currentIndex: -1,
    maxHistorySize: 50,

    push: (state: HistoryState, description: string) => {
      const { history, currentIndex, maxHistorySize } = get()
      
      // Supprimer l'historique futur si on était pas à la fin
      const newHistory = history.slice(0, currentIndex + 1)
      
      // Ajouter la nouvelle entrée
      newHistory.push({
        id: `history-${Date.now()}`,
        timestamp: Date.now(),
        state: JSON.parse(JSON.stringify(state)), // Deep copy
        description,
      })
      
      // Limiter la taille
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
      } else {
        set({ currentIndex: newHistory.length - 1 })
      }
      
      set({ history: newHistory })
    },

    undo: () => {
      const { history, currentIndex } = get()
      
      if (currentIndex <= 0) return null
      
      const newIndex = currentIndex - 1
      set({ currentIndex: newIndex })
      
      return history[newIndex]?.state || null
    },

    redo: () => {
      const { history, currentIndex } = get()
      
      if (currentIndex >= history.length - 1) return null
      
      const newIndex = currentIndex + 1
      set({ currentIndex: newIndex })
      
      return history[newIndex]?.state || null
    },

    clear: () => {
      set({ history: [], currentIndex: -1 })
    },

    canUndo: () => {
      const { currentIndex } = get()
      return currentIndex > 0
    },

    canRedo: () => {
      const { history, currentIndex } = get()
      return currentIndex < history.length - 1
    },

    getCurrentState: () => {
      const { history, currentIndex } = get()
      return history[currentIndex]?.state || null
    },
  }))
)
