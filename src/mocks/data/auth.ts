import type { User } from '@/entities/user'

export const SESSION_COOKIE = 'ai_pto_session'

const ORGANIZATION_ID = 'org-1'

/** Сид-пользователи моков (пароль у обоих — password123). */
export const mockUsers: User[] = [
  { id: 'user-1', email: 'engineer@pto.example.com', name: 'Иван Петров', organizationId: ORGANIZATION_ID, role: 'engineer' },
  { id: 'user-2', email: 'owner@pto.example.com', name: 'Анна Смирнова', organizationId: ORGANIZATION_ID, role: 'owner' },
]

export const MOCK_PASSWORD = 'password123'

export function findMockUserByEmail(email?: string) {
  return mockUsers.find((u) => u.email === email)
}

export function findMockUserById(id?: string) {
  return mockUsers.find((u) => u.id === id)
}
