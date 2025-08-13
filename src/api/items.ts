import { useItemsStore, type Item } from '../store/itemsStore'

function toUtcIsoNoMs(d: Date): string {
  return d.toISOString().replace('.000Z', 'Z')
}

function seedIfEmpty() {
  const { items, setItems } = useItemsStore.getState()
  if (items.length === 0) {
    const start = Date.UTC(2025, 7, 10, 9, 30) // 2025-08-10T09:30:00Z
    const generated: Item[] = Array.from({ length: 50 }, (_, i) => {
      const id = String(i + 1)
      const createdDate = new Date(
        start +
          i * 24 * 60 * 60 * 1000 + // +i days
          (i % 5) * 60 * 60 * 1000 + // +0..4 hours for variety
          ((i * 15) % 60) * 60 * 1000, // +0..59 minutes stepping by 15
      )
      const scheduledDate = new Date(
        createdDate.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000, // +5 days + 1h30m
      )
      return {
        id,
        name: `Item ${id}`,
        createdAtUtc: toUtcIsoNoMs(createdDate),
        scheduledForUtc: toUtcIsoNoMs(scheduledDate),
      }
    })
    setItems(generated)
  }
}

export async function fetchItems(): Promise<Item[]> {
  seedIfEmpty()
  await new Promise((r) => setTimeout(r, 150))
  return useItemsStore.getState().items
}

export async function updateItem(item: Item): Promise<Item> {
  await new Promise((r) => setTimeout(r, 150))
  useItemsStore.getState().upsertItem(item)
  return item
}


