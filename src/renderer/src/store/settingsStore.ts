import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SettingsFrontResponse } from '@renderer/types/api/user'
import zh_CN from 'antd/locale/zh_CN'
import en_US from 'antd/locale/en_US'
import ja_JP from 'antd/locale/ja_JP'

interface SettingsState {
  baseUrl: string
  language: number // 0:中文 1:英文 2:日文
  fontSize: number
  appearance: number // 0:跟随系统 1:浅色 2:暗色
  borderRadius: number

  mainColor: string // #3142ef
  ttsAutoplay: boolean
  backgroundPath: string | null
  backgroundOpacity: number
  backgroundBlur: number
  enabledAssistantId: string | null

  version: number

  getApiBaseUrl: () => string
  getOssBaseUrl: () => string
  setSettings: (settingsFrontResponse: SettingsFrontResponse) => void
  setPartial: (patch: Partial<SettingsState>) => void
  resetCloudSettings: () => void
  reset: () => void
}

const initialState = {
  baseUrl: 'http://localhost',
  appearance: 1,
  language: 0,
  ttsAutoplay: false,
  fontSize: 14,
  mainColor: '#3142ef',
  borderRadius: 12,
  backgroundPath: null,
  backgroundOpacity: 100,
  backgroundBlur: 0,
  enabledAssistantId: null,
  version: 0
}

const initialCloudState = {
  mainColor: '#3142ef',
  ttsAutoplay: false,
  backgroundPath: null,
  backgroundOpacity: 100,
  backgroundBlur: 0,
  enabledAssistantId: null,
  version: 0
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
    (set, get) => ({
      ...initialState,

      getApiBaseUrl: () => `${get().baseUrl}:8080/api`,
      getOssBaseUrl: () => `${get().baseUrl}:9000`,
      setSettings: (settingsFrontResponse) => set(settingsFrontResponse),
      setPartial: (patch) => set((state) => ({ ...state, ...patch })),
      reset: () => set(initialState),
      resetCloudSettings: () => set(initialCloudState)
    }),
    {
      name: 'settings-store'
    }
  )
)
