// src/store/alert-dialog.ts
import type { Field } from "@/components/DialogForm";
import { create } from "zustand";

export interface AppState {
  alert: {
    open: boolean;
    title: string;
    description?: string;
    onConfirm?: () => void;
  };

  form: {
    open: boolean;
    title: string;
    description?: string;
    fields: Field[];
    initialData?: Record<string, string | string[] | number>;
    onSubmit: (data: Record<string, string | string[] | number>) => void;
  };

  openDialog: (params: { title: string; description?: string; onConfirm?: () => void }) => void;
  closeDialog: () => void;
  confirmDialog: () => void;

  openForm: (params: { title: string; description?: string; fields: Field[]; initialData?: Record<string, string | string[] | number>; onSubmit: (data: Record<string, string | string[] | number>) => void }) => void;
  closeForm: () => void;
  submitForm: (data: Record<string, string | string[] | number>) => void;

}

export const useAppStore = create<AppState>((set, get) => ({
  alert: {
    open: false,
    title: "",
    description: undefined,
    onConfirm: undefined,
  },
  form: {
    open: false,
    title: "",
    description: undefined,
    fields: [],
    initialData: undefined,
    onSubmit: () => {},
  },
  preferances: {
    theme: 'system',
    displayMode: 'grid',
    displaySidebar: true,
  },

  openDialog: ({ title, description, onConfirm }) => {
    set({
      alert: {
        open: true,
        title,
        description,
        onConfirm
      }
    }); 
  },

  closeDialog: () => {
    set({
      alert: {
        open: false,
        title: "",
        description: undefined,
        onConfirm: undefined,
      }
    });
  },

  confirmDialog: () => {
    const { onConfirm } = get().alert;
    onConfirm?.();
    get().closeDialog();
  },

  openForm: ({ title, description, fields, initialData, onSubmit }) => {
    set({
      form: {
        open: true,
        title,
        description,
        fields,
        initialData,
        onSubmit
      }
    });
  },

  closeForm: () => {
    set({
      form: {
        open: false,
        title: "",
        description: undefined,
        fields: [],
        initialData: undefined,
        onSubmit: () => {},
      }
    });
  },

  submitForm: (data) => {
    const { onSubmit } = get().form;
    onSubmit(data);
    get().closeForm();
  },
}));