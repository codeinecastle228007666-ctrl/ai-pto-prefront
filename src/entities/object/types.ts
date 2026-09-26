export type ObjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'archived'

export interface ObjectType {
  id: string
  groupId: string
  code: string
  name: string
  description?: string
  active: boolean
}

export interface ObjectGroup {
  id: string
  code: string
  name: string
  description?: string
  active: boolean
}

export interface WorkType {
  id: string
  code: string
  name: string
}

export interface OrganizationRef {
  id: string
  name: string
}

export interface ConstructionObject {
  id: string
  organizationId: string
  code: string
  name: string
  address: string
  objectTypeId: string
  customerOrganizationId: string
  contractorOrganizationId: string
  status: ObjectStatus
  description?: string
  startDate?: string
  plannedEndDate?: string
  actualEndDate?: string
  createdById: string
  createdAt: string
  updatedAt: string
  archivedAt?: string

  // Relations (populated in detail)
  objectType?: ObjectType
  customerOrganization?: OrganizationRef
  contractorOrganization?: OrganizationRef
  workTypes?: WorkType[]
  _count?: {
    packages: number
    findings: number
  }
  readiness?: number
  lastCheckedAt?: string
}

export type ObjectSortBy =
  | 'code'
  | 'name'
  | 'address'
  | 'createdAt'
  | 'updatedAt'
  | 'readiness'
  | 'lastCheckedAt'

export interface ObjectListParams {
  page?: number
  limit?: number
  search?: string
  status?: ObjectStatus[]
  objectTypeId?: string
  customerOrganizationId?: string
  contractorOrganizationId?: string
  sortBy?: ObjectSortBy
  sortOrder?: 'asc' | 'desc'
}

export interface ObjectListResponse {
  data: ConstructionObject[]
  total: number
  page: number
  limit: number
  totalPages: number
}
