import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'
import type { Finding, FindingsPage, FindingUpdate } from '@/entities/finding'

const MAX_PAGE_SIZE = 200

export const findingsApi = {
  list: async (objectId: string, packageId: string): Promise<FindingsPage> => {
    const response = await api.get<FindingsPage>(`/objects/${objectId}/findings`, {
      params: { packageId, pageSize: MAX_PAGE_SIZE },
    })
    return response.data
  },

  update: async (id: string, body: FindingUpdate): Promise<Finding> => {
    const response = await api.patch<Finding>(`/findings/${id}`, body)
    return response.data
  },
}

const findingsKey = (objectId: string, packageId: string) => ['findings', objectId, packageId] as const

/** Замечания пакета целиком — фильтрация по документу/серьёзности на клиенте. */
export function useFindings(objectId: string, packageId: string, enabled: boolean) {
  return useQuery<FindingsPage, AxiosError>({
    queryKey: findingsKey(objectId, packageId),
    queryFn: () => findingsApi.list(objectId, packageId),
    enabled: enabled && !!objectId && !!packageId,
  })
}

export function useUpdateFinding() {
  const queryClient = useQueryClient()
  return useMutation<Finding, AxiosError<{ message?: string }>, { id: string; body: FindingUpdate }>({
    mutationFn: ({ id, body }) => findingsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['findings'] })
      // счётчики замечаний в дереве документов
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })
}
