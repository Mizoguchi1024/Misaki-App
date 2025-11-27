export interface UpdateUserFrontRequest {
  username: string
  gender: number
  birthday: string
  avatarUrl: string
  occupation: string
  detail: string
}

export interface UserFrontResponse {
  email: string
  username: string
  gender: number
  birthday: string
  avatarUrl: string
  occupation: string
  detail: string
  createTime: string
}

export interface UpdateSettingsFrontRequest {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}

export interface SettingsFrontResponse {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}
