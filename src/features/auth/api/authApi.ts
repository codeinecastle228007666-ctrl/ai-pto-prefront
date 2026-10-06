import { api, ENDPOINTS } from '@/shared'
import type { User } from '@/entities/user'

export interface LoginRequest {
  email: string
  password: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<void> => {
    await api.post(ENDPOINTS.auth.login, data)
  },

  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.auth.logout)
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>(ENDPOINTS.auth.me)
    return response.data
  },
}
