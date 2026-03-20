export type AssistantFrontResponse = {
  id: string
  name: string
  personality: string
  detail: string
  gender: number
  birthday: string
  avatarPath: string
  modelId: string
  creatorId: string
  likes: number
  likedFlag: boolean
  duplicateName: number
  publicFlag: boolean
  createTime: string
  updateTime: string
  version: number
}

export type AddAssistantFrontRequest = {
  name: string
  gender: number
  birthday?: string
  modelId: string
  personality?: string
  detail?: string
  publicFlag: boolean
}

export type UpdateAssistantFrontRequest = {
  name?: string
  personality?: string
  detail?: string
  gender?: number
  birthday?: string
  modelId?: string
  publicFlag?: boolean
  version: number
}
