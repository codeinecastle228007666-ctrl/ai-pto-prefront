import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserWithOrg } from '@/entities/user'

interface AuthState {
  user: UserWithOrg | null
  accessToken: string | null
  refreshToken: string | null
  organizationId: string | null
  isAuthenticated: boolean
  setAuth: (data: { user: UserWithOrg; accessToken: string; refreshToken: string }) => void
  updateUser: (user: Partial<UserWithOrg>) => void
  clearAuth: () => void
  setOrganization: (orgId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      organizationId: null,
      isAuthenticated: false,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          organizationId: user.membership.organizationId,
          isAuthenticated: true,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          organizationId: null,
          isAuthenticated: false,
        }),

      setOrganization: (orgId) =>
        set((state) => ({
          organizationId: orgId,
          user: state.user ? { ...state.user, membership: { ...state.user.membership, organizationId: orgId } } : null,
        })),
    }),
    {
      name: 'ai-pto-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        organizationId: state.organizationId,
        // user не сохраняем в localStorage — получаем через /auth/me
      }),
    }
  )
)

// Селекторы для удобства
export const useUser = () => useAuthStore((state) => state.user)
export const useAccessToken = () => useAuthStore((state) => state.accessToken)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useOrganizationId = () => useAuthStore((state) => state.organizationId)
