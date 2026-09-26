import { useQueryClient } from '@tanstack/react-query'
import { useApiQuery, useApiMutation, queryKeys } from '@/shared'
import { objectsApi, catalogsApi } from './objectsApi'
import type { ConstructionObject, ObjectListParams } from '@/entities/object'

// Список объектов
export function useObjects(params: ObjectListParams = {}) {
  return useApiQuery(
    queryKeys.objects.list(params),
    () => objectsApi.getList(params),
    {
      placeholderData: (previous) => previous,
    }
  )
}

// Детали объекта
export function useObject(id: string, enabled = true) {
  return useApiQuery(
    queryKeys.objects.detail(id),
    () => objectsApi.getById(id),
    { enabled: enabled && !!id }
  )
}

// Создание объекта
export function useCreateObject() {
  const queryClient = useQueryClient()
  return useApiMutation(
    (data: Partial<ConstructionObject>) => objectsApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
      },
    }
  )
}

// Обновление объекта
export function useUpdateObject() {
  const queryClient = useQueryClient()
  return useApiMutation(
    ({ id, data }: { id: string; data: Partial<ConstructionObject> }) => objectsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
      },
    }
  )
}

// Архивация объекта
export function useArchiveObject() {
  const queryClient = useQueryClient()
  return useApiMutation(
    (id: string) => objectsApi.archive(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
      },
    }
  )
}

// Каталоги
export function useObjectTypes() {
  return useApiQuery(
    queryKeys.catalogs.objectTypes,
    () => catalogsApi.getObjectTypes(),
    { staleTime: 5 * 60 * 1000 }
  )
}

export function useWorkTypes() {
  return useApiQuery(
    queryKeys.catalogs.workTypes,
    () => catalogsApi.getWorkTypes(),
    { staleTime: 5 * 60 * 1000 }
  )
}

export function useOrganizations() {
  return useApiQuery(
    queryKeys.catalogs.organizations,
    () => catalogsApi.getOrganizations(),
    { staleTime: 5 * 60 * 1000 }
  )
}
