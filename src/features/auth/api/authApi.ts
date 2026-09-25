import api from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { UserWithOrg } from '@/entities/user/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: UserWithOrg
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(ENDPOINTS.auth.login, data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.auth.logout)
  },

  me: async (): Promise<UserWithOrg> => {
    const response = await api.get<UserWithOrg>(ENDPOINTS.auth.me)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post<{ accessToken: string; refreshToken: string }>(ENDPOINTS.auth.refresh, { refreshToken })
    return response.data
  },
}