import {
  AssistantFrontResponse,
  CreateAssistantFrontRequest,
  UpdateAssistantFrontRequest
} from '@renderer/types/api/assistant'
import api from '../index'

export const listAssistants = (): Promise<AssistantFrontResponse[]> =>
  api.get<AssistantFrontResponse[]>('/front/assistants').then((res) => res.data)

export const listPublicAssistants = (): Promise<AssistantFrontResponse[]> =>
  api.get<AssistantFrontResponse[]>('/front/assistants/public').then((res) => res.data)

export const createAssistant = (data: CreateAssistantFrontRequest): Promise<void> =>
  api.post<void>('/front/assistants', data).then((res) => res.data)

export const updateAssistant = (id: number, data: UpdateAssistantFrontRequest): Promise<void> =>
  api.put<void>(`/front/assistants/${id}`, data).then((res) => res.data)
