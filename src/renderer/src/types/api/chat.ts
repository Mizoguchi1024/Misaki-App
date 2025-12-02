export type SendMessageFrontRequest = {
  content: string
  assistantId: number
  prefix: string
}

export type ConversationFrontResponse = {
  id: number
  title: string
  createTime: string
}

export type MessageFrontResponse = {
  id: number
  conversationId: number
  type: string
  content: string
  mcpEnabled: number
  timestamp: string
}
