// src/store/planning.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Budget {
  id: string;
  amount: number;
  sourceId: string;
  commentaire?: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Depense {
  id: string;
  amount: number;
  diversId: string;
  commentaire?: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Epargne {
  id: string;
  amount: number;
  caisseId: string;
  commentaire?: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Planning {
  id: string;
  title: string;
  commentaire?: string;
  budgets: Budget[];
  depenses: Depense[];
  epargnes: Epargne[];
  position?: number;
  boardId?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface PlanningState {
  list: Planning[];

  init: (boardId?: string) => void;

  getList: (boardId?: string) => Planning[];
  getOne: ({id, boardId}: {id: string, boardId?: string}) => Planning | undefined;
  add: (planning: Partial<Planning>) => void;
  update: (id: string, updatedPlanning: Partial<Planning>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;

  addDepense: (planningId: string, depense: Partial<Depense>) => void;
  updateDepense: (
    planningId: string,
    depenseId: string,
    updatedDepense: Partial<Depense>
  ) => void;
  removeDepense: (planningId: string, depenseId: string) => void;

  addEpargne: (planningId: string, epargne: Partial<Epargne>) => void;
  updateEpargne: (
    planningId: string,
    epargneId: string,
    updatedEpargne: Partial<Epargne>
  ) => void;
  removeEpargne: (planningId: string, epargneId: string) => void;

  addBudget: (planningId: string, budget: Partial<Budget>) => void;
  updateBudget: (
    planningId: string,
    budgetId: string,
    updatedBudget: Partial<Budget>
  ) => void;
  removeBudget: (planningId: string, budgetId: string) => void;
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set, get) => ({
      list: [],

      init: (boardId?: string) => {
        const savedList = get().getList(boardId);
        if (savedList.length == 0) {
          get().add({
            title: "Example Planning",
            budgets: [],
            depenses: [],
            epargnes: [],
            boardId: boardId || undefined,
          });
        }
      },


      getList: (boardId?: string) => {
        const list = get().list;
        if (boardId) {
          return list.filter((planning) => planning.boardId === boardId);
        }
        return list;

      },
      getOne: ({id, boardId}: {id: string, boardId?: string}) => {
        const list = get().getList(boardId);
        return list.find((planning) => planning.id === id);
      },

      remove: (id: string) =>
        set((state) => ({
          list: state.list.filter((planning) => planning.id !== id),
        })),

      add: (planning: Partial<Planning>) => {
        const newPlanning: Planning = {
          id: crypto.randomUUID(),
          title: planning.title || "Untitled Planning",
          budgets: planning.budgets || [],
          depenses: planning.depenses || [],
          epargnes: planning.epargnes || [],
          position: planning.position || get().getPosition() + 1,
          boardId: planning.boardId || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({ list: [...state.list, newPlanning] }));
      },

      update: (id: string, updatedPlanning: Partial<Planning>) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === id
              ? { ...planning, ...updatedPlanning, updatedAt: new Date() }
              : planning
          ),
        })),

      clear: () => set({ list: [] }),

      getPosition: () => {
        const list = get().list;
        return list.length > 0 ? list[list.length - 1].position || 0 : 0;
      },

      addDepense: (planningId: string, depense: Partial<Depense>) => {
        const planning = get().list.find((p) => p.id === planningId);
        const maxPosition = planning?.depenses.reduce((max, d) => Math.max(max, d.position || 0), 0) || 0;
        const newDepense: Depense = {
          id: crypto.randomUUID(),
          amount: depense.amount || 0,
          diversId: depense.diversId || "",
          commentaire: depense.commentaire || "",
          position: depense.position || maxPosition + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? { ...planning, depenses: [...planning.depenses, newDepense] }
              : planning
          ),
        }));
      },

      updateDepense: (
        planningId: string,
        depenseId: string,
        updatedDepense: Partial<Depense>
      ) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  depenses: planning.depenses.map((depense) =>
                    depense.id === depenseId
                      ? { ...depense, ...updatedDepense, updatedAt: new Date() }
                      : depense
                  ),
                }
              : planning
          ),
        })),

      removeDepense: (planningId: string, depenseId: string) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  depenses: planning.depenses.filter(
                    (depense) => depense.id !== depenseId
                  ),
                }
              : planning
          ),
        })),

      addEpargne: (planningId: string, epargne: Partial<Epargne>) => {
        const planning = get().list.find((p) => p.id === planningId);
        const maxPosition = planning?.epargnes.reduce((max, e) => Math.max(max, e.position || 0), 0) || 0;
        const newEpargne: Epargne = {
          id: crypto.randomUUID(),
          amount: epargne.amount || 0,
          caisseId: epargne.caisseId || "",
          commentaire: epargne.commentaire || "",
          position: epargne.position || maxPosition + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? { ...planning, epargnes: [...planning.epargnes, newEpargne] }
              : planning
          ),
        }));
      },

      updateEpargne: (
        planningId: string,
        epargneId: string,
        updatedEpargne: Partial<Epargne>
      ) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  epargnes: planning.epargnes.map((epargne) =>
                    epargne.id === epargneId
                      ? { ...epargne, ...updatedEpargne, updatedAt: new Date() }
                      : epargne
                  ),
                }
              : planning
          ),
        })),

      removeEpargne: (planningId: string, epargneId: string) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  epargnes: planning.epargnes.filter(
                    (epargne) => epargne.id !== epargneId
                  ),
                }
              : planning
          ),
        })),

      addBudget: (planningId: string, budget: Partial<Budget>) => {
        const planning = get().list.find((p) => p.id === planningId);
        const maxPosition = planning?.budgets.reduce((max, b) => Math.max(max, b.position || 0), 0) || 0;
        const newBudget: Budget = {
          id: crypto.randomUUID(),
          amount: budget.amount || 0,
          sourceId: budget.sourceId || "",
          commentaire: budget.commentaire || "",
          position: budget.position || maxPosition + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? { ...planning, budgets: [...planning.budgets, newBudget] }
              : planning
          ),
        }));
      },

      updateBudget: (
        planningId: string,
        budgetId: string,
        updatedBudget: Partial<Budget>
      ) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  budgets: planning.budgets.map((budget) =>
                    budget.id === budgetId
                      ? { ...budget, ...updatedBudget, updatedAt: new Date() }
                      : budget
                  ),
                }
              : planning
          ),
        })),

      removeBudget: (planningId: string, budgetId: string) =>
        set((state) => ({
          list: state.list.map((planning) =>
            planning.id === planningId
              ? {
                  ...planning,
                  budgets: planning.budgets.filter(
                    (budget) => budget.id !== budgetId
                  ),
                }
              : planning
          ),
        })),
    }),
    {
      name: "family-eco-planning",
      version: 1,
    }
  )
);