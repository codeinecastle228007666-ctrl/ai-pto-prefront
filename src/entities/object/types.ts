export type ObjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'archived'

export interface ObjectGroupRef {
  id: string
  code: string
  name: string
}

export interface ObjectType {
  id: string
  code: string
  name: string
  description?: string | null
  group: ObjectGroupRef
}

export interface WorkType {
  id: string
  code: string
  name: string
  description?: string | null
}

export interface OrganizationRef {
  id: string
  name: string
}

export interface Counterparty extends OrganizationRef {
  slug: string
}

export interface ConstructionObject {
  id: string
  code: string
  name: string
  address: string | null
  status: ObjectStatus
  description: string | null
  objectType: ObjectType
  customer: OrganizationRef | null
  contractor: OrganizationRef | null
  workTypes: WorkType[]
  startDate: string | null
  plannedEndDate: string | null
  actualEndDate: string | null
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export type ObjectSortBy =
  | 'code'
  | 'name'
  | 'address'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'objectTypeId'
  | 'customerOrganizationId'
  | 'contractorOrganizationId'

export interface ObjectListParams {
  page?: number
  limit?: number
  search?: string
  /** Включить архивные объекты (stage-1: includeArchived=true) */
  includeArchived?: boolean
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
