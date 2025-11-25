export interface UserProfileResponse {
  email: string
  username: string
  gender: number
  birthday: string
  avatarUrl: string
  occupation: string
  detail: string
  createTime: string
}

export interface UserSettingResponse {
  appearance: number
  language: number
  ttsAutoplay: number
  fontSize: number
  colorPrimary: string
  borderRadius: number
  backgroundImagePath: string
}
