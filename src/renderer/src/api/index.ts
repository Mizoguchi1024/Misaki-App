import axios from 'axios'
import { useUserStore } from '@renderer/store/userStore'
import { useSettingsStore } from '@renderer/store/settingsStore'

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
    console.error('API error:', err)
    return Promise.reject(err)
  }
)

export default api
