import { create } from 'zustand'

type FeedbackStore = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
})) 