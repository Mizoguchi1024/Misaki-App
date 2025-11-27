import {
  AssistantFrontResponse,
  CreateAssistantFrontRequest,
  UpdateAssistantFrontRequest
} from '@renderer/types/api/assistant'
import api from '../index'
import { Result } from '@renderer/types/api/base'

export const listAssistants = (): Promise<Result<AssistantFrontResponse[]>> =>
  api.get<Result<AssistantFrontResponse[]>>('/front/assistants').then((res) => res.data)

export const listPublicAssistants = (): Promise<Result<AssistantFrontResponse[]>> =>
  api.get<Result<AssistantFrontResponse[]>>('/front/assistants/public').then((res) => res.data)

export const createAssistant = (data: CreateAssistantFrontRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/front/assistants', data).then((res) => res.data)

export const updateAssistant = (
  id: number,
  data: UpdateAssistantFrontRequest
): Promise<Result<void>> =>
  api.put<Result<void>>(`/front/assistants/${id}`, data).then((res) => res.data)
