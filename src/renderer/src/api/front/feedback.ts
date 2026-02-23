import { Result } from '@renderer/types/api/base'
import api from '..'
import { AddFeedbackFrontRequest, FeedbackFrontResponse } from '@renderer/types/api/feedback'

export const createFeedback = (data: AddFeedbackFrontRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/front/feedbacks', data).then((res) => res.data)

export const listFeedbacks = (): Promise<Result<FeedbackFrontResponse[]>> =>
  api.get<Result<FeedbackFrontResponse[]>>('/front/feedbacks').then((res) => res.data)

export const deleteFeedback = (id: string): Promise<Result<void>> =>
  api.delete<Result<void>>(`/front/feedbacks/${id}`).then((res) => res.data)
