import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import type { TimeConfig } from './utils'
import { DateTimeContext } from './hooks'

interface DateTimeProviderProps extends PropsWithChildren {
  config: TimeConfig | null
  ready: boolean
}

export function DateTimeProvider({ config, ready, children }: Readonly<DateTimeProviderProps>) {
  const value = useMemo(
    () => ({
      orgTimezone: config?.orgTimezone ?? 'UTC',
      userTimezone: config?.userTimezone ?? 'UTC',
      userDateFormat: config?.userDateFormat ?? "yyyy-LL-dd'T'HH:mm",
      ready,
    }),
    [config, ready],
  )

  return (
    <DateTimeContext.Provider value={value}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>{children}</LocalizationProvider>
    </DateTimeContext.Provider>
  )
}


