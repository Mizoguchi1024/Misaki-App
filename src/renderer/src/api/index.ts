import axios from 'axios'
import i18n from '@renderer/i18n'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useChatStore } from '@renderer/store/chatStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useFeedbackStore } from '@renderer/store/feedbackStore'

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
      const status = err.response?.status
      const serverMessage = err.response?.data?.message

      if (status === 401) {
        if (useUserStore.getState().jwt) {
          useUserStore.getState().reset()
          useSettingsStore.getState().resetCloudSettings()
          useChatStore.getState().reset()
          useAssistantStore.getState().reset()
          useFeedbackStore.getState().reset()

          useSettingsStore.getState().staticMessage?.info(i18n.t('tokenExpired', { ns: 'api' }))
        }
      } else {
        useSettingsStore
          .getState()
          .staticMessage?.error(serverMessage ?? i18n.t('networkError', { ns: 'api' }))
      }
    } else {
      useSettingsStore.getState().staticMessage?.error(i18n.t('unknownError', { ns: 'api' }))
    }

    return Promise.reject(err)
  }
)

export default api
