import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SettingsFrontResponse } from '@renderer/types/api/user'
import zh_CN from 'antd/locale/zh_CN'
import en_US from 'antd/locale/en_US'
import ja_JP from 'antd/locale/ja_JP'

interface SettingsState {
  baseUrl: string

  appearance: number
  language: LanguageEnum
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string

  setSettings: (s: SettingsFrontResponse) => void
  reset: () => void
}

const defaultSettings = {
  baseUrl: 'http://localhost:8080/api',
  appearance: 1,
  language: 0,
  ttsAutoplay: 0,
  fontSize: 14,
  colorPrimary: '#3142ef',
  borderRadius: 12,
  backgroundImagePath: ''
}

export enum LanguageEnum {
  ZH = 0,
  EN = 1,
  JP = 2
}

export const LanguageI18nMap = {
  [LanguageEnum.ZH]: 'zh',
  [LanguageEnum.EN]: 'en',
  [LanguageEnum.JP]: 'jp'
}
export const LanguageAntdMap = {
  [LanguageEnum.ZH]: zh_CN,
  [LanguageEnum.EN]: en_US,
  [LanguageEnum.JP]: ja_JP
}

export const LanguageMap = {
  [LanguageEnum.ZH]: '中文',
  [LanguageEnum.EN]: 'English',
  [LanguageEnum.JP]: '日本語'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      baseUrl: defaultSettings.baseUrl,
      appearance: defaultSettings.appearance,
      language: defaultSettings.language,
      ttsAutoplay: defaultSettings.ttsAutoplay,
      fontSize: defaultSettings.fontSize,
      colorPrimary: defaultSettings.colorPrimary,
      borderRadius: defaultSettings.borderRadius,
      backgroundImagePath: defaultSettings.backgroundImagePath,

      setSettings: (s: SettingsFrontResponse) =>
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
      name: 'settings-store'
    }
  )
)
