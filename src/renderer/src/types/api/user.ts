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
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}

export type SettingsFrontResponse = {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}
