import { create } from 'zustand'
import type { User } from '@/entities/user'
import { clearMockSessionId, setMockSessionId } from '@/shared/api/mockSession'

interface AuthState {
  user: User | null
  organizationId: string | null
  isAuthenticated: boolean
  /** false до первой попытки восстановить сессию через /auth/me */
  sessionChecked: boolean
  setUser: (user: User) => void
  updateUser: (user: Partial<User>) => void
  clearAuth: () => void
  setSessionChecked: (checked: boolean) => void
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
      organizationId: user.organizationId,
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
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useOrganizationId = () => useAuthStore((state) => state.organizationId)
export const useIsOwner = () => useAuthStore((state) => state.user?.role === 'owner')

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Владелец',
  engineer: 'Инженер',
}
