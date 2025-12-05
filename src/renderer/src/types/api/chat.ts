export type SendMessageFrontRequest = {
  content: string
  assistantId: number
  prefix: string
}

export type ChatFrontResponse = {
  id: number
  title: string
  createTime: string
}

export type MessageFrontResponse = {
  id: number
  chatId: number
  type: string
  content: string
  mcpEnabled: number
  timestamp: string
}
