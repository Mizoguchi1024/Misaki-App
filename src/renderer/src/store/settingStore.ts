import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SettingFrontResponse } from '@renderer/types/api/user'

interface SettingStore {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string

  setSetting: (s: SettingFrontResponse) => void
  reset: () => void
}

const defaultSettings: SettingFrontResponse = {
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
      appearance: defaultSettings.appearance,
      language: defaultSettings.language,
      ttsAutoplay: defaultSettings.ttsAutoplay,
      fontSize: defaultSettings.fontSize,
      colorPrimary: defaultSettings.colorPrimary,
      borderRadius: defaultSettings.borderRadius,
      backgroundImagePath: defaultSettings.backgroundImagePath,

      setSetting: (s: SettingFrontResponse) =>
        set(() => ({
          appearance: s.appearance ?? defaultSettings.appearance,
          language: s.language ?? defaultSettings.language,
          ttsAutoplay: s.ttsAutoplay ?? defaultSettings.ttsAutoplay,
          fontSize: s.fontSize ?? defaultSettings.fontSize,
          colorPrimary: s.colorPrimary ?? defaultSettings.colorPrimary,
          borderRadius: s.borderRadius ?? defaultSettings.borderRadius,
          backgroundImagePath: s.backgroundImagePath ?? defaultSettings.backgroundImagePath
        })),

      reset: () =>
        set(() => ({
          appearance: defaultSettings.appearance,
          language: defaultSettings.language,
          ttsAutoplay: defaultSettings.ttsAutoplay,
          fontSize: defaultSettings.fontSize,
          colorPrimary: defaultSettings.colorPrimary,
          borderRadius: defaultSettings.borderRadius,
          backgroundImagePath: defaultSettings.backgroundImagePath
        }))
    }),
    {
      name: 'user-setting-store'
    }
  )
)
