// src/store/planning.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Table {
  id: string;
  title: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableState {
  list: Table[]; // Replace with your actual type

  init: () => void;
  getList: () => Table[]; // Function to get the current list of table items
  getOne: (id: string) => Table | undefined; // Function to get a specific table item by ID
  add: (table: Partial<Table>) => void;
  update: (id: string, updatedTable: Partial<Table>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      list: [],


      init: () => {
        const savedList = get().getList();
        if (savedList.length == 0) {
          get().add({
            title: "family economy",
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
      remove: (id: string) => set((state) => ({ list: state.list.filter((table) => table.id !== id) })),
      // Add a new table item to the list
      add: (table: Partial<Table>) => set((state) => {
        const newTable: Table = {
          id: table.id || crypto.randomUUID(),
          title: table.title || "New Table",
          position: table.position || get().getPosition() + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { list: [...state.list, newTable] };
      }),
      update: (id: string, updatedTable: Partial<Table>) => set((state) => ({
        list: state.list.map((table) =>
          table.id === id
            ? { ...table, ...updatedTable, updatedAt: new Date() }
            : table
        )
      })),
      getPosition: () => {
        const list = get().list;
        const maxPosition = list.reduce((max, table ) => (table.position && table.position > max ? table.position : max), 0);
        return maxPosition;
       },
       // Clear table
       clear: () => set({ list: [] }),
     }),
     {
       name: "family-eco-table", // storage key
       version: 1 // version for migration management
     }
   )
);