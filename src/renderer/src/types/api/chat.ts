export type SendMessageFrontRequest = {
  content: string
  assistantId: string
  prefix: string
}

export type ChatFrontResponse = {
  id: string
  title: string
  createTime: string
}

export type MessageFrontResponse = {
  id: string
  chatId: string
  type: string
  content: string
  mcpEnabled: number
  timestamp: string
}
