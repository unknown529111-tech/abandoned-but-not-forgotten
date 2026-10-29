// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BodyId } from '../types';

interface Store {
  selectedBodyId: BodyId | null;
  setSelectedBody: (id: BodyId | null) => void;
  camera: { x: number; y: number; zoom: number };
  setCamera: (c: { x: number; y: number; zoom: number }) => void;
  locale: 'en' | 'ar';
  setLocale: (l: 'en' | 'ar') => void;
}

export const useAppStore = create<Store>()(
  persist(
    (set) => ({
      selectedBodyId: null,
      setSelectedBody: (id) => set({ selectedBodyId: id }),
      camera: { x: 0, y: 0, zoom: 1 },
      setCamera: (c) => set({ camera: c }),
      locale: 'en',
      setLocale: (l) => set({ locale: l }),
    }),
    { name: 'abnf-store' }
  )
);
