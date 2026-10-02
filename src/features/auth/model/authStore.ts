import { create } from 'zustand'
import type { UserWithOrg } from '@/entities/user'
import { clearMockSessionId, setMockSessionId } from '@/shared/api/mockSession'

interface AuthState {
  user: UserWithOrg | null
  organizationId: string | null
  isAuthenticated: boolean
  /** false до первой попытки восстановить сессию через /auth/me */
  sessionChecked: boolean
  setUser: (user: UserWithOrg) => void
  updateUser: (user: Partial<UserWithOrg>) => void
  clearAuth: () => void
  setSessionChecked: (checked: boolean) => void
  setOrganization: (orgId: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organizationId: null,
  isAuthenticated: false,
  sessionChecked: false,

  setUser: (user) => {
    setMockSessionId(user.id)
    set({
      user,
      organizationId: user.membership.organizationId,
      isAuthenticated: true,
      sessionChecked: true,
    })
  },

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  clearAuth: () => {
    clearMockSessionId()
    set({
      user: null,
      organizationId: null,
      isAuthenticated: false,
      sessionChecked: true,
    })
  },

  setSessionChecked: (checked) => set({ sessionChecked: checked }),

  setOrganization: (orgId) =>
    set((state) => ({
      organizationId: orgId,
      user: state.user
        ? { ...state.user, membership: { ...state.user.membership, organizationId: orgId } }
        : null,
    })),
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useOrganizationId = () => useAuthStore((state) => state.organizationId)
export const useIsOwner = () => useAuthStore((state) => state.user?.membership?.role === 'owner')

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Владелец',
  engineer: 'Инженер',
}
