import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useApiQuery, useApiMutation, queryKeys } from '@/shared'
import { objectsApi, catalogsApi, type ObjectWriteBody, type ObjectStatusTransition } from './objectsApi'
import type { ConstructionObject, ObjectListParams, ObjectListResponse } from '@/entities/object'
import { applyListParams } from '../model/applyListParams'

export function useObjects(params: ObjectListParams = {}) {
  return useQuery<ConstructionObject[], AxiosError, ObjectListResponse>({
    queryKey: queryKeys.objects.list({ includeArchived: !!params.includeArchived }),
    queryFn: () => objectsApi.getList(params),
    select: (items) => applyListParams(items, params),
    placeholderData: (previous) => previous,
  })
}

export function useObject(id: string, enabled = true) {
  return useApiQuery(queryKeys.objects.detail(id), () => objectsApi.getById(id), {
    enabled: enabled && !!id,
  })
}

export function useCreateObject() {
  const queryClient = useQueryClient()
  return useApiMutation((data: ObjectWriteBody) => objectsApi.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
    },
  })
}

export function useUpdateObject() {
  const queryClient = useQueryClient()
  return useApiMutation(
    ({ id, data }: { id: string; data: ObjectWriteBody }) => objectsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
      },
    }
  )
}

export function useChangeObjectStatus() {
  const queryClient = useQueryClient()
  return useApiMutation(
    ({ id, status }: { id: string; status: ObjectStatusTransition }) => objectsApi.changeStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
      },
    }
  )
}

export function useArchiveObject() {
  const queryClient = useQueryClient()
  return useApiMutation((id: string) => objectsApi.archive(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.objects.all })
    },
  })
}

export function useObjectTypes() {
  return useApiQuery(queryKeys.catalogs.objectTypes, () => catalogsApi.getObjectTypes(), {
    staleTime: 5 * 60 * 1000,
  })
}

export function useWorkTypes() {
  return useApiQuery(queryKeys.catalogs.workTypes, () => catalogsApi.getWorkTypes(), {
    staleTime: 5 * 60 * 1000,
  })
}

export function useCounterparties() {
  return useApiQuery(queryKeys.catalogs.counterparties, () => catalogsApi.getCounterparties(), {
    staleTime: 5 * 60 * 1000,
  })
}
