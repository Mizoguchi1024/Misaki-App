export interface SendMessageFrontRequest {
  content: string
  assistantId: number
  prefix: string
}

export interface ConversationFrontResponse {
  id: number
  title: string
  createTime: string
}

export interface MessageFrontResponse {
  id: number
  conversationId: number
  type: string
  content: string
  mcpEnabled: number
  timestamp: string
}
