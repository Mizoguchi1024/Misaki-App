import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserSettingVo {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}

interface SettingStore extends UserSettingVo {
  setSetting: <K extends keyof UserSettingVo>(key: K, value: UserSettingVo[K]) => void
  reset: () => void
}

const defaultSettings: UserSettingVo = {
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
      ...defaultSettings,
      setSetting: (key, value) => set(() => ({ [key]: value })),
      reset: () => set(() => ({ ...defaultSettings }))
    }),
    {
      name: 'user-setting-store'
    }
  )
)
