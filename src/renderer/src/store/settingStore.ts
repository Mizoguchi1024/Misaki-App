import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserSettingResponse {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}

interface SettingStore {
  setting: UserSettingResponse | null

  setSetting: (setting: UserSettingResponse) => void
  reset: () => void
}

const defaultSettings: UserSettingResponse = {
  appearance: 1,
  language: 0,
  ttsAutoplay: 0,
  fontSize: 14,
  colorPrimary: '#3142ef',
  borderRadius: 12,
  backgroundImagePath: ''
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      setting: defaultSettings,
      setSetting: (setting) => set({ setting }),
      reset: () => set(() => ({ setting: defaultSettings }))
    }),
    {
      name: 'user-setting-store'
    }
  )
)
