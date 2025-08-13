import { createContext, useContext } from 'react'
import type { TimeConfig } from './utils'

export type DateTimeContextValue = TimeConfig & { ready: boolean }
export const DateTimeContext = createContext<DateTimeContextValue | undefined>(undefined)

export function useDateTimeConfig(): DateTimeContextValue {
  const ctx = useContext(DateTimeContext)
  if (!ctx) throw new Error('useDateTimeConfig must be used within DateTimeProvider')
  return ctx
}
