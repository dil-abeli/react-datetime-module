import type { TimeConfig } from '../providers/datetime/utils'
import { useSettingsStore } from '../store/settingsStore'

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function fetchTimeConfig(): Promise<TimeConfig> {
  await delay(200)
  const { orgTimezone, userTimezone, userDateFormat } = useSettingsStore.getState()
  return { orgTimezone, userTimezone, userDateFormat }
}

export async function fetchOrgTimezone(): Promise<string> {
  const cfg = await fetchTimeConfig()
  return cfg.orgTimezone
}

export async function fetchUserPrefs(): Promise<{ timezone: string; dateFormat: string }> {
  const cfg = await fetchTimeConfig()
  return { timezone: cfg.userTimezone, dateFormat: cfg.userDateFormat }
}

export async function updateTimeConfig(next: Partial<TimeConfig>): Promise<TimeConfig> {
  await delay(200)
  useSettingsStore.getState().updateConfig(next)
  const { orgTimezone, userTimezone, userDateFormat } = useSettingsStore.getState()
  return { orgTimezone, userTimezone, userDateFormat }
}


