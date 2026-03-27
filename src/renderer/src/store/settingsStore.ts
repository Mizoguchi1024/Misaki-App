import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import zh_CN from 'antd/locale/zh_CN'
import en_US from 'antd/locale/en_US'
import ja_JP from 'antd/locale/ja_JP'
import zhCN_X from '@ant-design/x/locale/zh_CN'
import enUS_X from '@ant-design/x/locale/en_US'
import { MessageInstance } from 'antd/es/message/interface'

interface SettingsState {
  staticMessage: MessageInstance | null

  baseUrl: string
  language: number // 0:中文 1:英文 2:日文
  fontSize: number
  appearance: number // 0:跟随系统 1:浅色 2:暗色
  borderRadius: number

  getApiBaseUrl: () => string
  getOssBaseUrl: () => string

  setStaticMessage: (staticMessage: any) => void
  setPartial: (patch: Partial<SettingsState>) => void

  reset: () => void
  resetLocalSettings: () => void
}

const initialState = {
  staticMessage: null,
  baseUrl: 'https://localhost',
  appearance: 0,
  language: 0,
  fontSize: 14,
  borderRadius: 12
}

const initialLocalState = {
  baseUrl: 'https://localhost',
  language: 0,
  fontSize: 14,
  appearance: 0,
  borderRadius: 12
}

export enum LanguageEnum {
  ZH = 0,
  EN = 1,
  JP = 2
}

export const LanguageI18nMap = {
  [LanguageEnum.ZH]: 'zh',
  [LanguageEnum.EN]: 'en',
  [LanguageEnum.JP]: 'ja'
}

export const LanguageDayjsMap = {
  [LanguageEnum.ZH]: 'zh-cn',
  [LanguageEnum.EN]: 'en',
  [LanguageEnum.JP]: 'ja'
}

export const LanguageAntdMap = {
  [LanguageEnum.ZH]: zh_CN,
  [LanguageEnum.EN]: en_US,
  [LanguageEnum.JP]: ja_JP
}

export const LanguageAntdXMap = {
  [LanguageEnum.ZH]: zhCN_X,
  [LanguageEnum.EN]: enUS_X
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

      getApiBaseUrl: () => `${get().baseUrl}/api`,
      getOssBaseUrl: () => `${get().baseUrl}/oss`,
      setStaticMessage: (staticMessage) => set({ staticMessage }),
      setPartial: (patch) => set((state) => ({ ...state, ...patch })),
      reset: () => set(initialState),
      resetLocalSettings: () => set(initialLocalState)
    }),
    {
      name: 'settings-store'
    }
  )
)
