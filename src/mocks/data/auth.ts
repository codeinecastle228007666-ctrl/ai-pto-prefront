export const mockUser = {
  id: 'user-1',
  email: 'engineer@pto.example.com',
  name: 'Иван Петров',
  status: 'active' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  lastLoginAt: new Date().toISOString(),
}

export const mockOrganization = {
  id: 'org-1',
  name: 'ООО «СтройМастер»',
  slug: 'stroymaster',
  status: 'active' as const,
}

export const mockMembership = {
  id: 'mem-1',
  userId: 'user-1',
  organizationId: 'org-1',
  role: 'engineer' as const,
  status: 'active' as const,
  createdAt: '2024-01-15T10:00:00Z',
}

export const mockUserWithOrg = {
  ...mockUser,
  organization: mockOrganization,
  membership: mockMembership,
}

export const generateTokens = () => ({
  accessToken: 'mock-access-token-' + Date.now(),
  refreshToken: 'mock-refresh-token-' + Date.now(),
})

export const mockCredentials = {
  email: 'engineer@pto.example.com',
  password: 'password123',
}