export type UpdateUserFrontRequest = {
  username?: string
  gender?: number
  birthday?: string
  avatarPath?: string
  occupation?: string
  details?: string
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
  details: string
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
  promptsSuggestion?: boolean
  ttsAutoplay?: boolean
  mainColor?: string
  backgroundPath?: string
  backgroundOpacity?: number
  backgroundBlur?: number
  enabledAssistantId?: string
  version: number
}

export type SettingsFrontResponse = {
  mainColor: string
  promptsSuggestion: boolean
  ttsAutoplay: boolean
  colorPrimary: string
  backgroundPath: string
  backgroundOpacity: number
  backgroundBlur: number
  enabledAssistantId: string
  version: number
}

export type CheckInFrontResponse = {
  token: number
  crystal: number
}
