import { TtsRequest, UploadResponse } from '@renderer/types/common'
import api from '../index'
import { Result } from '@renderer/types/result'

export const upload = (data: FormData): Promise<Result<UploadResponse>> =>
  api.post<Result<UploadResponse>>('/common/files', data).then((res) => res.data)

export const tts = (data: TtsRequest): Promise<Result<FormData>> =>
  api.post<Result<FormData>>('/common/tts', data).then((res) => res.data)
