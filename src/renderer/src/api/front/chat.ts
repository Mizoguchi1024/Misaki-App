import {
  ConversationFrontResponse,
  MessageFrontResponse,
  SendMessageFrontRequest
} from '@renderer/types/api/chat'
import api from '../index'

export const createConversation = (): Promise<number> =>
  api.post<number>('/front/conversations').then((res) => res.data)

export const sendMessage = (id: number, data: SendMessageFrontRequest): Promise<string> =>
  api.post<string>(`/front/conversations/${id}/messages`, data).then((res) => res.data)

export const getConversationTitle = (id: number): Promise<string> =>
  api.get<string>(`/front/conversations/${id}/title`).then((res) => res.data)

export const listConversations = (): Promise<ConversationFrontResponse[]> =>
  api.get<ConversationFrontResponse[]>('/front/conversations').then((res) => res.data)

export const listMessages = (id: number): Promise<MessageFrontResponse[]> =>
  api.get<MessageFrontResponse[]>(`/front/conversations/${id}/messages`).then((res) => res.data)
