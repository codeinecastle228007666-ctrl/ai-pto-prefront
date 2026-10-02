import { api, ENDPOINTS } from '@/shared'
import type {
  ConstructionObject,
  ObjectListParams,
  ObjectListResponse,
  ObjectStatus,
  ObjectType,
  WorkType,
  OrganizationRef,
} from '@/entities/object'

export type ObjectWriteBody = {
  code: string
  name: string
  objectTypeId: string
  workTypeIds: string[]
  address?: string
  description?: string
  customerOrganizationId?: string
  contractorOrganizationId?: string
  startDate?: string
  plannedEndDate?: string
}

export type ObjectStatusTransition = Exclude<ObjectStatus, 'archived'>

function cleanBody(data: ObjectWriteBody): ObjectWriteBody {
  const out: ObjectWriteBody = { ...data }
  ;(['address', 'description', 'customerOrganizationId', 'contractorOrganizationId', 'startDate', 'plannedEndDate'] as const).forEach(
    (key) => {
      if (out[key] === '') delete out[key]
    }
  )
  return out
}

export const objectsApi = {
  getList: async (params: ObjectListParams = {}): Promise<ObjectListResponse> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === false) return
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v))
      } else {
        searchParams.set(key, String(value))
      }
    })
    const query = searchParams.toString()
    const response = await api.get<ObjectListResponse>(
      query ? `${ENDPOINTS.objects.list}?${query}` : ENDPOINTS.objects.list
    )
    return response.data
  },

  create: async (data: ObjectWriteBody): Promise<ConstructionObject> => {
    const response = await api.post<ConstructionObject>(ENDPOINTS.objects.create, cleanBody(data))
    return response.data
  },

  getById: async (id: string): Promise<ConstructionObject> => {
    const response = await api.get<ConstructionObject>(ENDPOINTS.objects.detail(id))
    return response.data
  },

  update: async (id: string, data: ObjectWriteBody): Promise<ConstructionObject> => {
    const response = await api.patch<ConstructionObject>(ENDPOINTS.objects.update(id), cleanBody(data))
    return response.data
  },

  changeStatus: async (id: string, status: ObjectStatusTransition): Promise<ConstructionObject> => {
    const response = await api.post<ConstructionObject>(ENDPOINTS.objects.status(id), { status })
    return response.data
  },

  archive: async (id: string): Promise<ConstructionObject> => {
    const response = await api.post<ConstructionObject>(ENDPOINTS.objects.archive(id))
    return response.data
  },
}

export const catalogsApi = {
  getObjectTypes: async (): Promise<ObjectType[]> => {
    const response = await api.get<ObjectType[]>(ENDPOINTS.catalogs.objectTypes)
    return response.data
  },

  getWorkTypes: async (): Promise<WorkType[]> => {
    const response = await api.get<WorkType[]>(ENDPOINTS.catalogs.workTypes)
    return response.data
  },

  getCounterparties: async (): Promise<OrganizationRef[]> => {
    const response = await api.get<OrganizationRef[]>(ENDPOINTS.catalogs.counterparties)
    return response.data
  },
}
