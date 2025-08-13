import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeConfig } from '../providers/datetime/utils'

export type SettingsState = TimeConfig & {
  setConfig: (config: TimeConfig) => void
  updateConfig: (partial: Partial<TimeConfig>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      orgTimezone: 'Europe/Budapest',
      userTimezone: 'America/New_York',
      userDateFormat: 'yyyy/LL/dd HH:mm',
      setConfig: (config) => set({ ...config }),
      updateConfig: (partial) => set({ ...get(), ...partial }),
    }),
    {
      name: 'settings-store',
      version: 1,
    },
  ),
)


