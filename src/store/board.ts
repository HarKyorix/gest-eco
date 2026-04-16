// src/store/planning.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Board {
  id: string;
  title: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardState {
  list: Board[]; // Replace with your actual type

  init: () => void;
  getList: () => Board[]; // Function to get the current list of board items
  getOne: (id: string) => Board | undefined; // Function to get a specific board item by ID
  add: (board: Partial<Board>) => void;
  update: (id: string, updatedBoard: Partial<Board>) => void;
  remove: (id: string) => void;
  getPosition: () => number;
  clear: () => void;
}

export const useBoardStore = create<BoardState>()(
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
      remove: (id: string) => set((state) => ({ list: state.list.filter((board) => board.id !== id) })),
      // Add a new board item to the list
      add: (board: Partial<Board>) => set((state) => {
        const newBoard: Board = {
          id: board.id || crypto.randomUUID(),
          title: board.title || "New Board",
          position: board.position || get().getPosition() + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { list: [...state.list, newBoard] };
      }),
      update: (id: string, updatedBoard: Partial<Board>) => set((state) => ({
        list: state.list.map((board) =>
          board.id === id
            ? { ...board, ...updatedBoard, updatedAt: new Date() }
            : board
        )
      })),
      getPosition: () => {
        const list = get().list;
        const maxPosition = list.reduce((max, board ) => (board.position && board.position > max ? board.position : max), 0);
        return maxPosition;
       },
       // Clear table
       clear: () => set({ list: [] }),
     }),
     {
       name: "family-eco-board", // storage key
       version: 1 // version for migration management
     }
   )
);