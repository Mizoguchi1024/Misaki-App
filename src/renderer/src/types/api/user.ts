export type UpdateUserFrontRequest = {
  username?: string
  gender?: number
  birthday?: string
  avatarPath?: string
  occupation?: string
  detail?: string
  version: number
}

export type UserFrontResponse = {
  email: string
  username: string
  gender: number
  birthday: string
  avatarUrl: string
  occupation: string
  detail: string
  createTime: string
}

export type UpdateSettingsFrontRequest = {
  ttsAutoplay?: boolean
  mainColor?: string
  backgroundPath?: string
  backgroundOpacity?: number
  backgroundBlur?: number
  enabledAssistantId?: string
  version: number
}

export type SettingsFrontResponse = {
  ttsAutoplay: boolean
  colorPrimary: string
  backgroundPath: string
  backgroundOpacity: number
  backgroundBlur: number
  enabledAssistantId: string
  version: number
}
