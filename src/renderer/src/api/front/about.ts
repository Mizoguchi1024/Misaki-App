import { Result } from '@renderer/types/api/base'
import api from '..'
import { AboutFrontResponse } from '@renderer/types/api/about'

export const likeMisaki = (): Promise<Result<void>> =>
  api.post<Result<void>>('/front/about/like').then((res) => res.data)

export const getMisakiLikes = (): Promise<Result<AboutFrontResponse>> =>
  api.get<Result<AboutFrontResponse>>('/front/about/like').then((res) => res.data)
