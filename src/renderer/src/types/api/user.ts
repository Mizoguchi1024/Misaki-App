export type UpdateUserFrontRequest = {
  username: string
  gender: number
  birthday: string
  avatarUrl: string
  occupation: string
  detail: string
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
  backgroundImagePath?: string
  enabledAssistantId?: string
  version: number
}

export type SettingsFrontResponse = {
  ttsAutoplay: boolean
  colorPrimary: string
  backgroundImagePath: string
  enabledAssistantId: string
  version: number
}
