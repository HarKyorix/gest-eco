import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingState {
  
  theme: 'light' | 'dark' | 'system';
  displayMode: 'list' | 'grid';
  displaySidebar: boolean;

  setPreferances: (key: string, value: string | boolean) => void;
  resetPreferances: () => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      theme: 'system',
      displayMode: 'grid',
      displaySidebar: true,

      setPreferances: (key, value) => {
        set({[key]: value});
      },
      resetPreferances: () => {
        set({
          theme: 'system',
          displayMode: 'grid',
          displaySidebar: true,
        });
      }
    }),
    {
      name: "setting-storage",
    }
  )
);