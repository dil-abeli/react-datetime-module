import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Item = {
  id: string
  name: string
  createdAtUtc: string
  scheduledForUtc: string
}

export type ItemsState = {
  items: Item[]
  setItems: (items: Item[]) => void
  upsertItem: (item: Item) => void
}

export const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      upsertItem: (item) => {
        const existing = get().items
        const idx = existing.findIndex((i) => i.id === item.id)
        if (idx >= 0) {
          const next = existing.slice()
          next[idx] = item
          set({ items: next })
        } else {
          set({ items: [...existing, item] })
        }
      },
    }),
    {
      name: 'items-store',
      version: 2,
      migrate: (persistedState: unknown, version) => {
        // Drop any previously persisted items to reseed with the new 50-item dataset
        if (version < 2) {
          const state = (persistedState as Partial<ItemsState>) ?? {}
          return { ...state, items: [] } as ItemsState
        }
        return (persistedState as ItemsState)
      },
    },
  ),
)
