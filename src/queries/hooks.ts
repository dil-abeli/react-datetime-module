import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchItems, updateItem } from '../api/items'
import { fetchOrgTimezone, fetchTimeConfig, fetchUserPrefs } from '../api/config'
import type { Item } from '../store/itemsStore'
import { useItemsStore } from '../store/itemsStore'

export function useItemsQuery() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    initialData: () => useItemsStore.getState().items,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })
}

export function useUpdateItemMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (item: Item) => updateItem(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })
}

export function useTimeConfigQuery() {
  return useQuery({ queryKey: ['timeConfig'], queryFn: fetchTimeConfig, staleTime: 5 * 60_000 })
}

export function useOrgTimezoneQuery() {
  return useQuery({ queryKey: ['orgTimezone'], queryFn: fetchOrgTimezone, staleTime: 5 * 60_000 })
}

export function useUserPrefsQuery() {
  return useQuery({ queryKey: ['userPrefs'], queryFn: fetchUserPrefs, staleTime: 5 * 60_000 })
}
