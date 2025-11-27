import api from './index'

export const upload = (data: FormData): Promise<void> =>
  api.post<void>('/common/files', data).then((res) => res.data)

export const tts = (data: string): Promise<FormData> =>
  api.post<FormData>('/common/tts', data).then((res) => res.data) //  TODO 改后端
