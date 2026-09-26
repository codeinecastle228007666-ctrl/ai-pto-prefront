import { api, ENDPOINTS } from '@/shared'
import type { ConstructionObject, ObjectListParams, ObjectListResponse, ObjectType, WorkType, OrganizationRef } from '@/entities/object'

export const objectsApi = {
  // Список объектов с фильтрами и пагинацией
  getList: async (params: ObjectListParams = {}): Promise<ObjectListResponse> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v))
        } else {
          searchParams.set(key, String(value))
        }
      }
    })
    const response = await api.get<ObjectListResponse>(`${ENDPOINTS.objects.list}?${searchParams.toString()}`)
    return response.data
  },

  // Создание объекта
  create: async (data: Partial<ConstructionObject>): Promise<ConstructionObject> => {
    const response = await api.post<ConstructionObject>(ENDPOINTS.objects.create, data)
    return response.data
  },

  // Получение деталей объекта
  getById: async (id: string): Promise<ConstructionObject> => {
    const response = await api.get<ConstructionObject>(ENDPOINTS.objects.detail(id))
    return response.data
  },

  // Обновление объекта
  update: async (id: string, data: Partial<ConstructionObject>): Promise<ConstructionObject> => {
    const response = await api.patch<ConstructionObject>(ENDPOINTS.objects.update(id), data)
    return response.data
  },

  // Архивация (soft delete)
  archive: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.objects.delete(id))
  },
}

// Каталоги
export const catalogsApi = {
  getObjectTypes: async (): Promise<ObjectType[]> => {
    const response = await api.get<ObjectType[]>(ENDPOINTS.catalogs.objectTypes)
    return response.data
  },

  getWorkTypes: async (): Promise<WorkType[]> => {
    const response = await api.get<WorkType[]>(ENDPOINTS.catalogs.workTypes)
    return response.data
  },

  getOrganizations: async (): Promise<OrganizationRef[]> => {
    const response = await api.get<OrganizationRef[]>(ENDPOINTS.catalogs.organizations)
    return response.data
  },
}
