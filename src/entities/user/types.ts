export type UserRole = 'owner' | 'engineer'

/** Ответ бэка на /auth/login и /auth/me. */
export interface User {
  id: string
  email: string
  name: string
  organizationId: string
  role: UserRole
}
