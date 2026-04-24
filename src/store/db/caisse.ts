// src/store/db/caisse.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Caisse {
  id: string;
  title: string;
  limit?: number;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaisseState {
  list: Caisse[]; // Replace with your actual type

  init: () => void;
  getList: () => Caisse[]; // Function to get the current list of caisse items
  getOne: (id: string) => Caisse | undefined; // Function to get a specific caisse item by ID
  add: (caisse: Partial<Caisse>) => void;
  update: (id: string, updatedCaisse: Partial<Caisse>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;
}

export const useCaisseStore = create<CaisseState>()(
  persist(
    (set, get) => ({
      list: [],


      init: () => {
        const savedList = get().getList();
        if (savedList.length == 0) {
          get().add({
            title: "economie",
          });
        }
      },
      getList: () => {
        const list = get().list;
        
        return list;
      },
      getOne: (id: string) => {
        const list = get().list;
        return list.find((caisse) => caisse.id === id);
      },
      // Remove a caisse item from the list
      remove: (id: string) => set((state) => ({ list: state.list.filter((caisse) => caisse.id !== id) })),
      // Add a new caisse item to the list
      add: (caisse: Partial<Caisse>) => set((state) => {
        const newCaisse: Caisse = {
          id: caisse.id || crypto.randomUUID(),
          title: caisse.title || "New Caisse",
          limit: caisse.limit,
          position: caisse.position || get().getPosition() + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { list: [...state.list, newCaisse] };
      }),
      update: (id: string, updatedCaisse: Partial<Caisse>) => set((state) => ({
        list: state.list.map((caisse) =>
          caisse.id === id
            ? { ...caisse, ...updatedCaisse, updatedAt: new Date() }
            : caisse
        )
      })),
      getPosition: () => {
        const list = get().list;
        const maxPosition = list.reduce((max, caisse) => (caisse.position && caisse.position > max ? caisse.position : max), 0);
        return maxPosition;
       },
       // Clear caisse
       clear: () => set({ list: [] }),
     }),
     {
       name: "family-eco-caisse", // storage key
       version: 1 // version for migration management
     }
   )
);