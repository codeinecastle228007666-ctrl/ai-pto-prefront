import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 401 без живой cookie-сессии → на логин (кроме самого login)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/me')

    if (status === 401 && !isAuthEndpoint && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
