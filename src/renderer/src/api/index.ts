import axios from 'axios'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { messageApi } from '@renderer/messageApi'

const api = axios.create({
  baseURL: useSettingsStore.getState().baseUrl,
  timeout: 5000
})

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['X-Timestamp'] = Date.now().toString()
  config.headers['X-Nonce'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useUserStore.getState().logout()
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
