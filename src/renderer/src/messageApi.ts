import type { MessageInstance } from 'antd/es/message/interface'

export let messageApi: MessageInstance | null = null

export const setMessageApi = (messageInstance: MessageInstance): void => {
  messageApi = messageInstance
}
