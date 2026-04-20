// src/store/planning.ts
import { fields } from "@/helper/formField";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Divers {
  id: string;
  title: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const diversAddForm = {
  title: 'Add Divers',
  description: 'Add a new divers to your family economy management',
  fields: [ fields.title ],
}
export const diversEditForm = {
  title: 'Edit Divers',
  description: 'Edit the divers details',
  fields: [ fields.title ],
}

export interface DiversState {
  list: Divers[]; // Replace with your actual type

  init: () => void;
  getList: () => Divers[]; // Function to get the current list of divers items
  getOne: (id: string) => Divers | undefined; // Function to get a specific divers item by ID
  add: (divers: Partial<Divers>) => void;
  update: (id: string, updatedDivers: Partial<Divers>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;
}

export const useDiversStore = create<DiversState>()(
  persist(
    (set, get) => ({
      list: [],

      init: () => {
        const savedList = get().getList();
        if (savedList.length == 0) {
          get().add({
            title: "Divers",
          });
        }
      },

      getList: () => {
        const list = get().list;
        
        return list;
      },
      getOne: (id: string) => {
        const list = get().list;
        return list.find((divers) => divers.id === id);
      },
      // Remove a divers item from the list
      remove: (id: string) => set((state) => ({ list: state.list.filter((divers) => divers.id !== id) })),
      // Add a new divers item to the list
      add: (divers: Partial<Divers>) => set((state) => {
        const newDivers: Divers = {
          id: divers.id || crypto.randomUUID(),
          title: divers.title || "New Divers",
          position: divers.position || get().getPosition() + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { list: [...state.list, newDivers] };
      }),
      update: (id: string, updatedDivers: Partial<Divers>) => set((state) => ({
        list: state.list.map((divers) =>
          divers.id === id
            ? { ...divers, ...updatedDivers, updatedAt: new Date() }
            : divers
        )
      })),
      clear: () => set({ list: [] }),
      getPosition: () => {
        const list = get().list;
        const maxPosition = list.reduce((max, divers) => (divers.position && divers.position > max ? divers.position : max), 0);
        return maxPosition;
      },
    }),
    {
      name: "family-eco-divers", // storage key
      version: 1 // version for migration management
    }
  )
);