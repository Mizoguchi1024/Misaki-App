import type { MessageInstance } from 'antd/es/message/interface'

export let messageApi: MessageInstance | null = null

export const setMessageApi = (api: MessageInstance): void => {
  messageApi = api
}
