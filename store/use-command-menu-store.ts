import { create } from 'zustand'

type CommandMenuStore = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
}

export const useCommandMenuStore = create<CommandMenuStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
})) 