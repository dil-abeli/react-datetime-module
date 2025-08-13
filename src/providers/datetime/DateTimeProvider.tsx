import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import type { TimeConfig } from './utils'
import { DateTimeContext, DateTimeServiceContext } from './hooks'
import { createDateTimeService } from '../../services/datetime/DateTimeService'

interface DateTimeProviderProps extends PropsWithChildren {
  config: TimeConfig | null
  ready: boolean
}

export function DateTimeProvider({ config, ready, children }: Readonly<DateTimeProviderProps>) {
  const value = useMemo(
    () => ({
      orgTimezone: (config?.orgTimezone ?? 'UTC'),
      userTimezone: (config?.userTimezone ?? 'UTC'),
      userDateFormat: (config?.userDateFormat ?? 'yyyy/MM/dd'),
      userTimeFormat: (config?.userTimeFormat ?? '24h'),
      defaultDisplayTz: config?.defaultDisplayTz ?? 'org',
      ready,
    }),
    [config, ready],
  )

  const service = useMemo(
    () =>
      createDateTimeService({
        orgTimezone: value.orgTimezone,
        userTimezone: value.userTimezone,
        userDateFormat: value.userDateFormat,
        userTimeFormat: value.userTimeFormat,
        defaultDisplayTz: value.defaultDisplayTz,
      }),
    [value.orgTimezone, value.userTimezone, value.userDateFormat, value.userTimeFormat, value.defaultDisplayTz],
  )

  return (
    <DateTimeContext.Provider value={value}>
      <DateTimeServiceContext.Provider value={service}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>{children}</LocalizationProvider>
      </DateTimeServiceContext.Provider>
    </DateTimeContext.Provider>
  )
}


