import { useItemsStore, type Item } from '../store/itemsStore'

function seedIfEmpty() {
  const { items, setItems } = useItemsStore.getState()
  if (items.length === 0) {
    setItems([
      { id: '1', name: 'Alpha', createdAtUtc: '2025-08-10T09:30:00Z', scheduledForUtc: '2025-08-15T13:00:00Z' },
      { id: '2', name: 'Beta', createdAtUtc: '2025-08-11T18:45:00Z', scheduledForUtc: '2025-08-16T08:15:00Z' },
      { id: '3', name: 'Gamma', createdAtUtc: '2025-08-12T22:10:00Z', scheduledForUtc: '2025-08-17T17:30:00Z' },
      { id: '4', name: 'Delta', createdAtUtc: '2025-08-13T05:05:00Z', scheduledForUtc: '2025-08-18T21:45:00Z' },
      { id: '5', name: 'Epsilon', createdAtUtc: '2025-08-14T12:00:00Z', scheduledForUtc: '2025-08-19T10:00:00Z' },
    ])
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


