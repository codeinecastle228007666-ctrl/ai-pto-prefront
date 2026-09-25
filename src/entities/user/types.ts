export interface User {
  id: string
  email: string
  name: string
  status: 'active' | 'inactive' | 'blocked'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  status: 'active' | 'inactive'
}

export interface Membership {
  id: string
  userId: string
  organizationId: string
  role: 'owner' | 'engineer' | 'contractor' | 'admin' | 'reviewer' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  createdAt: string
}

export interface UserWithOrg extends User {
  organization: Organization
  membership: Membership
}