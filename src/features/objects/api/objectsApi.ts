import { api, ENDPOINTS } from '@/shared'
import type {
  ConstructionObject,
  ObjectListParams,
  ObjectStatus,
  ObjectType,
  WorkType,
  Counterparty,
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
}

export type ObjectStatusTransition = Exclude<ObjectStatus, 'archived'>

function cleanBody(data: ObjectWriteBody): ObjectWriteBody {
  const out: ObjectWriteBody = { ...data }
  ;(['address', 'description', 'customerOrganizationId', 'contractorOrganizationId'] as const).forEach(
    (key) => {
      if (out[key] === '') delete out[key]
    }
  )
  return out
}

export const objectsApi = {
  // Бэк: GET /objects → массив (серверный фильтр только includeArchived).
  getList: async (params: ObjectListParams = {}): Promise<ConstructionObject[]> => {
    const response = await api.get<ConstructionObject[]>(ENDPOINTS.objects.list, {
      params: params.includeArchived ? { includeArchived: true } : undefined,
    })
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

  getCounterparties: async (): Promise<Counterparty[]> => {
    const response = await api.get<Counterparty[]>(ENDPOINTS.catalogs.counterparties)
    return response.data
  },
}
