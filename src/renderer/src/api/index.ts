import axios from 'axios'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { messageApi } from '@renderer/messageApi'
import { useChatStore } from '@renderer/store/chatStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import i18n from '@renderer/i18n'

const api = axios.create({
  timeout: 5000
})

api.interceptors.request.use((config) => {
  config.baseURL = useSettingsStore.getState().getApiBaseUrl()
  const jwt = useUserStore.getState().jwt
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`
  config.headers['X-Timestamp'] = Date.now().toString()
  config.headers['X-Nonce'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      messageApi?.error(i18n.t('networkError', { ns: 'api' }))
    } else {
      const serverMessage = err.response?.data?.message
      if (err.response?.status === 401) {
        useUserStore.getState().logout()
        useSettingsStore.getState().resetCloudSettings()
        useChatStore.getState().reset()
        useAssistantStore.getState().reset()
        messageApi?.info(serverMessage)
        window.location.href = '/login'
      } else {
        messageApi?.error(serverMessage)
      }
    }

    return Promise.reject(err)
  }
)

export default api
