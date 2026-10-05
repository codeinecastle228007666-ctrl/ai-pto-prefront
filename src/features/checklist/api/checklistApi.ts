import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'
import type { Checklist } from '@/entities/package'

export const checklistApi = {
  get: async (objectId: string, packageId: string): Promise<Checklist> => {
    const response = await api.get<Checklist>(`/objects/${objectId}/checklist`, { params: { packageId } })
    return response.data
  },
}

export function useChecklist(objectId: string, packageId: string, enabled: boolean) {
  return useQuery<Checklist, AxiosError>({
    queryKey: ['checklist', objectId, packageId],
    queryFn: () => checklistApi.get(objectId, packageId),
    enabled: enabled && !!objectId && !!packageId,
  })
}
