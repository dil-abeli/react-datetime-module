import { createContext, useContext } from 'react'
import type { TimeConfig } from './utils'
import type { DateTimeService } from '../../services/datetime/DateTimeService'

export type DateTimeContextValue = TimeConfig & { ready: boolean }
export const DateTimeContext = createContext<DateTimeContextValue | undefined>(undefined)

export function useDateTimeConfig(): DateTimeContextValue {
  const ctx = useContext(DateTimeContext)
  if (!ctx) throw new Error('useDateTimeConfig must be used within DateTimeProvider')
  return ctx
}

export const DateTimeServiceContext = createContext<DateTimeService | undefined>(undefined)

export function useDateTimeService(): DateTimeService {
  const svc = useContext(DateTimeServiceContext)
  if (!svc) throw new Error('useDateTimeService must be used within DateTimeProvider')
  return svc
}
