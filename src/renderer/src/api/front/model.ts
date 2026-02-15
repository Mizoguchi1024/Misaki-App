import { Result } from '@renderer/types/api/base'
import api from '..'
import { ModelFrontResponse } from '@renderer/types/api/model'

export const listModels = (): Promise<Result<ModelFrontResponse[]>> =>
  api.get<Result<ModelFrontResponse[]>>('/front/models').then((res) => res.data)

export const buyModel = (id: string): Promise<Result<void>> =>
  api.post<Result<void>>(`/front/models${id}`).then((res) => res.data)
