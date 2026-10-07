import { useAuthStore } from '@/features/auth'
import { mockUsers } from '@/mocks/data/auth'
import { isMockMode } from '@/shared/api/mockSession'

/** Для objects_only: при моках сразу поднимаем owner-сессию без экрана /login. */
export function bootstrapMockAuth() {
  if (!isMockMode()) return

  const owner = mockUsers.find((u) => u.role === 'owner') ?? mockUsers[0]
  if (!owner) return

  useAuthStore.getState().setUser(owner)
}
