import type { TimeConfig } from '../providers/datetime/utils'

export async function fetchTimeConfig(): Promise<TimeConfig> {
  await new Promise((r) => setTimeout(r, 300))
  return {
    orgTimezone: 'Europe/Budapest',
    userTimezone: 'America/New_York',
    userDateFormat: 'yyyy/LL/dd HH:mm',
  }
}

export async function fetchOrgTimezone(): Promise<string> {
  const cfg = await fetchTimeConfig()
  return cfg.orgTimezone
}

export async function fetchUserPrefs(): Promise<{ timezone: string; dateFormat: string }> {
  const cfg = await fetchTimeConfig()
  return { timezone: cfg.userTimezone, dateFormat: cfg.userDateFormat }
}


