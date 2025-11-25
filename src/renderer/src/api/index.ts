import axios from 'axios'

const config = await fetch('config.json').then((res) => res.json())

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 5000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['X-Timestamp'] = Date.now().toString()
  config.headers['X-Nonce'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API error:', err)
    return Promise.reject(err)
  }
)

export default api
