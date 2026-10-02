import type { UserWithOrg } from '@/entities/user'

export const SESSION_COOKIE = 'ai_pto_session'

export const mockOrganization = {
  id: 'org-1',
  name: 'ООО «СтройМастер»',
  slug: 'stroymaster',
  status: 'active' as const,
}

function makeUser(id: string, email: string, name: string, role: 'owner' | 'engineer'): UserWithOrg {
  return {
    id,
    email,
    name,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastLoginAt: new Date().toISOString(),
    organization: mockOrganization,
    membership: {
      id: `mem-${id}`,
      userId: id,
      organizationId: mockOrganization.id,
      role,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
    },
  }
}

/** Сид-пользователи моков (пароль у обоих — password123). */
export const mockUsers: UserWithOrg[] = [
  makeUser('user-1', 'engineer@pto.example.com', 'Иван Петров', 'engineer'),
  makeUser('user-2', 'owner@pto.example.com', 'Анна Смирнова', 'owner'),
]

export const MOCK_PASSWORD = 'password123'

export function findMockUserByEmail(email?: string) {
  return mockUsers.find((u) => u.email === email)
}

export function findMockUserById(id?: string) {
  return mockUsers.find((u) => u.id === id)
}
