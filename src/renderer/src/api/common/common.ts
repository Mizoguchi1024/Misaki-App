import { TtsRequest } from '@renderer/types/api/common'
import api from '../index'
import { Result } from '@renderer/types/api/base'

export const upload = (data: FormData): Promise<Result<void>> =>
  api.post<Result<void>>('/common/files', data).then((res) => res.data)

export const tts = (data: TtsRequest): Promise<Result<FormData>> =>
  api.post<Result<FormData>>('/common/tts', data).then((res) => res.data)
