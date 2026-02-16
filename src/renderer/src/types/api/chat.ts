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
  parentId: string
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
