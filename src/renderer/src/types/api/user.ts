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
  id: string
  email: string
  username: string
  gender: number
  birthday: string
  avatarPath: string
  occupation: string
  detail: string
  token: number
  crystal: number
  puzzle: number
  stardust: number
  lastLoginTime: string
  lastCheckInDate: string
  createTime: string
  version: number
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
