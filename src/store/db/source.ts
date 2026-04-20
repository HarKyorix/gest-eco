// src/store/db/source.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Source {
  id: string;
  title: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SourceState {
  list: Source[]; // Replace with your actual type

  init: () => void;
  getList: () => Source[]; // Function to get the current list of planning items
  getOne: (id: string) => Source | undefined; // Function to get a specific planning item by ID
  add: (source: Partial<Source>) => void;
  update: (id: string, updatedSource: Partial<Source>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;
}

export const useSourceStore = create<SourceState>()(
  persist(
    (set, get) => ({
      list: [],

      init: () => {
        const savedList = get().getList();
        if (savedList.length == 0) {
          get().add({
            title: "salaire",
          });
        }
      },
      getList: () => {
        const list = get().list;
        
        return list;
      },
      getOne: (id: string) => {
        const list = get().list;
        return list.find((source) => source.id === id);
      },
      // Remove a planning item from the list
      remove: (id: string) => set((state) => ({ list: state.list.filter((source) => source.id !== id) })),
      // Add a new planning item to the list
      add: (source: Partial<Source>) => set((state) => {
        const newSource: Source = {
          id: source.id || crypto.randomUUID(),
          title: source.title || "New Source",
          position: source.position || get().getPosition() + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { list: [...state.list, newSource] };
      }),
      update: (id: string, updatedSource: Partial<Source>) => set((state) => ({
        list: state.list.map((source) =>
          source.id === id
            ? { ...source, ...updatedSource, updatedAt: new Date() }
            : source
        )
      })),
      getPosition: () => {
        const list = get().list;
        const maxPosition = list.reduce((max, source) => (source.position && source.position > max ? source.position : max), 0);
        return maxPosition;
      },
      // Clear planning
      clear: () => set({ list: [] })
     }),
     {
       name: "family-eco-source", // storage key
       version: 1 // version for migration management
     }
   )
);