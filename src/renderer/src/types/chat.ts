export type SendMessageFrontRequest = {
  content: string
  parentId?: string
  prefix?: string
  tools?: string[]
}

export type McpServerFrontResponse = {
  name: string
  tools: McpToolFrontResponse[]
}

export type McpToolFrontResponse = {
  name: string
  description: string
}

export type ChatFrontResponse = {
  id: string
  title: string
  token: number
  createTime: string
  updateTime: string
  version: number
}

export type MessageFrontResponse = {
  id: string
  chatId: string
  parentId: string | null
  type: string
  content: string
  createTime: string
}

export type ListPromptsFrontRequest = {
  parentId: string
  size: number
}

export type UpdateChatTitleFrontRequest = {
  title: string
  version: number
}
