import {
  ChatFrontResponse,
  MessageFrontResponse,
  SendMessageFrontRequest
} from '@renderer/types/api/chat'
import api from '../index'
import { Result } from '@renderer/types/api/base'

export const createChat = (): Promise<Result<number>> =>
  api.post<Result<number>>('/front/chats').then((res) => res.data)

export const sendMessage = (id: number, data: SendMessageFrontRequest): Promise<Result<string>> =>
  api.post<Result<string>>(`/front/chats/${id}/messages`, data).then((res) => res.data)

export const getChatTitle = (id: number): Promise<Result<string>> =>
  api.get<Result<string>>(`/front/chats/${id}/title`).then((res) => res.data)

export const listChats = (): Promise<Result<ChatFrontResponse[]>> =>
  api.get<Result<ChatFrontResponse[]>>('/front/chats').then((res) => res.data)

export const listMessages = (id: number): Promise<Result<MessageFrontResponse[]>> =>
  api.get<Result<MessageFrontResponse[]>>(`/front/chats/${id}/messages`).then((res) => res.data)
