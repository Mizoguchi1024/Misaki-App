import axios from 'axios'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { messageApi } from '@renderer/messageApi'
import { useChatStore } from '@renderer/store/chatStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import i18n from '@renderer/i18n'
import { useFeedbackStore } from '@renderer/store/feedbackStore'

const api = axios.create({
  timeout: 5000
})

api.interceptors.request.use((config) => {
  // config.baseURL = useSettingsStore.getState().getApiBaseUrl()  使用vite proxy
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
      const status = err.response?.status
      const serverMessage = err.response?.data?.message

      if (status === 401) {
        if (useUserStore.getState().jwt) {
          useUserStore.getState().reset()
          useSettingsStore.getState().resetCloudSettings()
          useChatStore.getState().reset()
          useAssistantStore.getState().reset()
          useFeedbackStore.getState().reset()

          messageApi?.info(i18n.t('tokenExpired', { ns: 'api' }))
        }
      } else {
        messageApi?.error(serverMessage ?? i18n.t('networkError', { ns: 'api' }))
      }
    } else {
      messageApi?.error(i18n.t('unknownError', { ns: 'api' }))
    }

    return Promise.reject(err)
  }
)

export default api
