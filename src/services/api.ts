import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gateway-production-bc87.up.railway.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.warn('Access denied (403):', error.config?.url)
    }
    return Promise.reject(error)
  }
)

export default api
