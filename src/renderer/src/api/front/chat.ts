import {
  ConversationFrontResponse,
  MessageFrontResponse,
  SendMessageFrontRequest
} from '@renderer/types/api/chat'
import api from '../index'
import { Result } from '@renderer/types/api/base'

export const createConversation = (): Promise<Result<number>> =>
  api.post<Result<number>>('/front/conversations').then((res) => res.data)

export const sendMessage = (id: number, data: SendMessageFrontRequest): Promise<Result<string>> =>
  api.post<Result<string>>(`/front/conversations/${id}/messages`, data).then((res) => res.data)

export const getConversationTitle = (id: number): Promise<Result<string>> =>
  api.get<Result<string>>(`/front/conversations/${id}/title`).then((res) => res.data)

export const listConversations = (): Promise<Result<ConversationFrontResponse[]>> =>
  api.get<Result<ConversationFrontResponse[]>>('/front/conversations').then((res) => res.data)

export const listMessages = (id: number): Promise<Result<MessageFrontResponse[]>> =>
  api
    .get<Result<MessageFrontResponse[]>>(`/front/conversations/${id}/messages`)
    .then((res) => res.data)
