import axios, { type AxiosError } from 'axios'
import {
  MOCK_SESSION_HEADER,
  clearMockSessionId,
  getMockSessionId,
  isMockMode,
} from './mockSession'

// В режиме моков всегда относительный /api: обработчики MSW описаны относительно origin,
// и абсолютный VITE_API_URL (например, из CI) увёл бы запросы мимо них в реальную сеть.
const API_BASE_URL = isMockMode() ? '/api' : import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// В моках cookie из SW не сохраняется — шлём userId заголовком из sessionStorage
api.interceptors.request.use((config) => {
  if (isMockMode()) {
    const sessionId = getMockSessionId()
    if (sessionId) {
      config.headers.set(MOCK_SESSION_HEADER, sessionId)
    }
  }
  return config
})

// 401 без живой сессии: сброс мок-сессии, остаёмся в кабинете (/objects)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/me')

    if (status === 401 && !isAuthEndpoint) {
      if (isMockMode()) clearMockSessionId()
      if (!window.location.pathname.startsWith('/objects')) {
        window.location.href = '/objects'
      }
    }

    return Promise.reject(error)
  }
)

export default api
