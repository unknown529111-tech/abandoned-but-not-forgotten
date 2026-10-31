// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAppStore = create()(persist((set) => ({
    selectedBodyId: null,
    setSelectedBody: (id) => set({ selectedBodyId: id }),
    camera: { x: 0, y: 0, zoom: 1 },
    setCamera: (c) => set({ camera: c }),
    locale: 'en',
    setLocale: (l) => set({ locale: l }),
}), { name: 'abnf-store' }));
