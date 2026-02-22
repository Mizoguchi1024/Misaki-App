import axios from 'axios'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { messageApi } from '@renderer/messageApi'
import { useChatStore } from '@renderer/store/chatStore'
import { useAssistantStore } from '@renderer/store/assistantStore'

const api = axios.create({
  baseURL: useSettingsStore.getState().baseUrl,
  timeout: 5000
})

api.interceptors.request.use((config) => {
  const jwt = useUserStore.getState().jwt
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`
  config.headers['X-Timestamp'] = Date.now().toString()
  config.headers['X-Nonce'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useUserStore.getState().logout()
      useSettingsStore.getState().resetCloudSettings()
      useChatStore.getState().reset()
      useAssistantStore.getState().reset()
      messageApi?.info('Please login again')
      window.location.href = '/login'
    }
    const serverMessage = err.response?.data?.message
    if (serverMessage) {
      messageApi?.error(serverMessage)
    } else {
      messageApi?.error((err as Error).message)
    }
    return Promise.reject(err)
  }
)

export default api
