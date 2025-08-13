import { DateTime } from 'luxon'

export type TimeConfig = {
  orgTimezone: string
  userTimezone: string
  userDateFormat: string
}

export function utcIsoToOrgDateTime(utcIso: string, orgTimezone: string): DateTime {
  return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(orgTimezone)
}

export function orgDateTimeToUtcIso(orgDateTime: DateTime): string {
  return orgDateTime.toUTC().toISO({ suppressMilliseconds: true }) as string
}

export function formatUtcForDisplay(
  utcIso: string,
  orgTimezone: string,
  format: string,
): string {
  return utcIsoToOrgDateTime(utcIso, orgTimezone).toFormat(format)
}

export function parseOrgInputToUtcIso(
  value: string,
  format: string,
  orgTimezone: string,
): string | null {
  const dt = DateTime.fromFormat(value, format, { zone: orgTimezone })
  if (!dt.isValid) return null
  return orgDateTimeToUtcIso(dt)
}


// Generic helpers for arbitrary timezones
export function utcIsoToTimezoneDateTime(utcIso: string, timezone: string): DateTime {
  return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(timezone)
}

export function formatUtcForTimezone(
  utcIso: string,
  timezone: string,
  format: string,
): string {
  return utcIsoToTimezoneDateTime(utcIso, timezone).toFormat(format)
}


