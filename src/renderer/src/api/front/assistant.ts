import {
  AssistantFrontResponse,
  AddAssistantFrontRequest,
  UpdateAssistantFrontRequest
} from '@renderer/types/assistant'
import api from '../index'
import { PageResult, Result } from '@renderer/types/result'

export const getAssistant = (id: string): Promise<Result<AssistantFrontResponse>> =>
  api.get<Result<AssistantFrontResponse>>(`/front/assistants/${id}`).then((res) => res.data)

export const listAssistants = (): Promise<Result<AssistantFrontResponse[]>> =>
  api.get<Result<AssistantFrontResponse[]>>('/front/assistants').then((res) => res.data)

export const listPublicAssistants = (
  pageIndex: number,
  pageSize: number
): Promise<PageResult<AssistantFrontResponse[]>> =>
  api
    .get<
      PageResult<AssistantFrontResponse[]>
    >('/front/assistants/public', { params: { pageIndex, pageSize } })
    .then((res) => res.data)

export const createAssistant = (
  data: AddAssistantFrontRequest
): Promise<Result<AssistantFrontResponse>> =>
  api.post<Result<AssistantFrontResponse>>('/front/assistants', data).then((res) => res.data)

export const copyAssistant = (id: string): Promise<Result<void>> =>
  api.post<Result<void>>(`/front/assistants/${id}`).then((res) => res.data)

export const updateAssistant = (
  id: string,
  data: UpdateAssistantFrontRequest
): Promise<Result<void>> =>
  api.put<Result<void>>(`/front/assistants/${id}`, data).then((res) => res.data)

export const likeAssistant = (id: string): Promise<Result<void>> =>
  api.post<Result<void>>(`/front/assistants/public/${id}/like`).then((res) => res.data)

export const deleteAssistant = (id: string): Promise<Result<void>> =>
  api.delete<Result<void>>(`/front/assistants/${id}`).then((res) => res.data)
