import { api, ENDPOINTS } from '@/shared'
import type { UserWithOrg } from '@/entities/user'

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

  me: async (): Promise<UserWithOrg> => {
    const response = await api.get<UserWithOrg>(ENDPOINTS.auth.me)
    return response.data
  },
}
