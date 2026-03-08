export type ToolDefinition = {
  name: string
  description: string
  parameters: Record<string, any>
  strict?: boolean
}

export type SendMessageFrontRequest = {
  content: string
  parentId?: string
  prefix?: string
  tools?: ToolDefinition[]
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
