import { Result } from '@renderer/types/result'
import api from '..'
import { ModelFrontResponse } from '@renderer/types/model'

export const listModels = (): Promise<Result<ModelFrontResponse[]>> =>
  api.get<Result<ModelFrontResponse[]>>('/front/models').then((res) => res.data)

export const buyModel = (id: string): Promise<Result<void>> =>
  api.post<Result<void>>(`/front/models${id}`).then((res) => res.data)
