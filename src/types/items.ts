import type { Item } from '../store/itemsStore'

export type ItemUpdatePayload = Pick<Item, 'id' | 'name' | 'scheduledForUtc'>
