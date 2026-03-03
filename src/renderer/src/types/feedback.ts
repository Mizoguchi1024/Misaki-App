export type AddFeedbackFrontRequest = {
  type: number
  title: string
  content: string
}

export type FeedbackFrontResponse = {
  id: string
  replierId: string
  type: number
  title: string
  content: string
  reply: string
  status: number
  createTime: string
  updateTime: string
  version: number
}
