import {
  ChatFrontResponse,
  ListPromptsFrontRequest,
  MessageFrontResponse,
  SendMessageFrontRequest,
  UpdateChatTitleFrontRequest
} from '@renderer/types/chat'
import api from '../index'
import { Result } from '@renderer/types/result'

export const createChat = (): Promise<Result<ChatFrontResponse>> =>
  api.post<Result<ChatFrontResponse>>('/front/chats').then((res) => res.data)

export const listPrompts = (id: string, data: ListPromptsFrontRequest): Promise<Result<string[]>> =>
  api.post<Result<string[]>>(`/front/chats/${id}/prompts`, data).then((res) => res.data)

export const sendMessage = (id: string, data: SendMessageFrontRequest): Promise<Result<string>> =>
  api.post<Result<string>>(`/front/chats/${id}/messages`, data).then((res) => res.data)

export const createChatTitle = (id: string): Promise<Result<void>> =>
  api.get<Result<void>>(`/front/chats/${id}/title`).then((res) => res.data)

export const updateChatTitle = (
  id: string,
  data: UpdateChatTitleFrontRequest
): Promise<Result<void>> =>
  api.put<Result<void>>(`/front/chats/${id}/title`, data).then((res) => res.data)

export const listChats = (): Promise<Result<ChatFrontResponse[]>> =>
  api.get<Result<ChatFrontResponse[]>>('/front/chats').then((res) => res.data)

export const searchChats = (keyword: string): Promise<Result<ChatFrontResponse[]>> =>
  api
    .get<Result<ChatFrontResponse[]>>('/front/chats/search', { params: { keyword } })
    .then((res) => res.data)

export const listMessages = (id: string): Promise<Result<MessageFrontResponse[]>> =>
  api.get<Result<MessageFrontResponse[]>>(`/front/chats/${id}/messages`).then((res) => res.data)

export const deleteChat = (id: string): Promise<Result<void>> =>
  api.delete<Result<void>>(`/front/chats/${id}`).then((res) => res.data)

export const deleteAllChats = (): Promise<Result<void>> =>
  api.delete<Result<void>>(`/front/chats`).then((res) => res.data)
