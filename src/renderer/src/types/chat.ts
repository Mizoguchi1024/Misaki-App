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
  pinnedFlag: boolean
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

export type UpdateChatFrontRequest = {
  title?: string
  pinnedFlag?: boolean
  version: number
}
