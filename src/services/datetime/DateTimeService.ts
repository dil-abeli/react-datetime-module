import { DateTime } from 'luxon'
import { TIME_FORMAT_PATTERN } from '../../providers/datetime/constants'
import type { UserDateFormat, UserTimeFormat, DefaultDisplayTz } from '../../providers/datetime/constants'

export type DateTimeServiceConfig = {
  orgTimezone: string
  userTimezone: string
  userDateFormat: UserDateFormat
  userTimeFormat: UserTimeFormat
  now?: () => Date
  defaultDisplayTz?: DefaultDisplayTz
}

export interface DateTimeService {
  getConfig(): DateTimeServiceConfig
  updateConfig(next: Partial<DateTimeServiceConfig>): void

  formatUtc(utcIso: string, fmt?: string): string
  formatRange(startUtcIso: string, endUtcIso: string, style?: 'short' | 'long'): string

  toOrg(utcIso: string): DateTime
  toUser(utcIso: string): DateTime
  toUtcIso(dt: DateTime): string

  nowInOrg(): DateTime

  startOfDayInOrg(utcIso: string): string
  endOfDayInOrg(utcIso: string): string

  compareUtcAsc(aUtcIso: string, bUtcIso: string): number
}

function buildDefaultFormat(userDateFormat: UserDateFormat, userTimeFormat: UserTimeFormat): string {
  return `${userDateFormat} ${TIME_FORMAT_PATTERN[userTimeFormat]}`
}

export function createDateTimeService(initialConfig: DateTimeServiceConfig): DateTimeService {
  let config: DateTimeServiceConfig = { ...initialConfig }

  function getConfig(): DateTimeServiceConfig {
    return { ...config }
  }

  function updateConfig(next: Partial<DateTimeServiceConfig>): void {
    config = { ...config, ...next }
  }

  function formatUtc(utcIso: string, fmt?: string): string {
    const format = fmt ?? buildDefaultFormat(config.userDateFormat, config.userTimeFormat)
    const tz = config.defaultDisplayTz === 'user' ? config.userTimezone : config.orgTimezone
    return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(tz).toFormat(format)
  }

  function formatRange(startUtcIso: string, endUtcIso: string, style: 'short' | 'long' = 'long'): string {
    const baseFmt = buildDefaultFormat(config.userDateFormat, config.userTimeFormat)
    const start = DateTime.fromISO(startUtcIso, { zone: 'utc' }).setZone(config.orgTimezone)
    const end = DateTime.fromISO(endUtcIso, { zone: 'utc' }).setZone(config.orgTimezone)
    // Same day check without depending on hasSame
    if (style === 'short' && start.toFormat('yyyy-LL-dd') === end.toFormat('yyyy-LL-dd')) {
      const dayFmt = config.userDateFormat
      const timeFmt = TIME_FORMAT_PATTERN[config.userTimeFormat]
      return `${start.toFormat(dayFmt)} ${start.toFormat(timeFmt)}–${end.toFormat(timeFmt)}`
    }
    return `${start.toFormat(baseFmt)} – ${end.toFormat(baseFmt)}`
  }

  function toOrg(utcIso: string): DateTime {
    return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(config.orgTimezone)
  }

  function toUser(utcIso: string): DateTime {
    return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(config.userTimezone)
  }

  function toUtcIso(dt: DateTime): string {
    return dt.toUTC().toISO({ suppressMilliseconds: true }) as string
  }

  function nowInOrg(): DateTime {
    const nowDate = config.now ? config.now() : new Date()
    const nowIso = nowDate.toISOString()
    return DateTime.fromISO(nowIso, { zone: 'utc' }).setZone(config.orgTimezone)
  }

  function startOfDayInOrg(utcIso: string): string {
    const dt = toOrg(utcIso)
    const start = DateTime.fromISO(dt.toISO() as string, { zone: config.orgTimezone })
      .setZone(config.orgTimezone)
      // approximate start of day via formatting round-trip
      .toFormat('yyyy-LL-dd')
    const startDt = DateTime.fromFormat(`${start} 00:00`, 'yyyy-LL-dd HH:mm', { zone: config.orgTimezone })
    return startDt.toUTC().toISO({ suppressMilliseconds: true }) as string
  }

  function endOfDayInOrg(utcIso: string): string {
    const dt = toOrg(utcIso)
    const day = DateTime.fromISO(dt.toISO() as string, { zone: config.orgTimezone }).toFormat('yyyy-LL-dd')
    const endDt = DateTime.fromFormat(`${day} 23:59`, 'yyyy-LL-dd HH:mm', { zone: config.orgTimezone })
    return endDt.toUTC().toISO({ suppressMilliseconds: true }) as string
  }

  function compareUtcAsc(aUtcIso: string, bUtcIso: string): number {
    const a = Date.parse(aUtcIso)
    const b = Date.parse(bUtcIso)
    if (a < b) return -1
    if (a > b) return 1
    return 0
  }

  return {
    getConfig,
    updateConfig,
    formatUtc,
    formatRange,
    toOrg,
    toUser,
    toUtcIso,
    nowInOrg,
    startOfDayInOrg,
    endOfDayInOrg,
    compareUtcAsc,
  }
}


