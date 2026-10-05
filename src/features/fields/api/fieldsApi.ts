import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'
import type { DocumentDetail } from '@/entities/package'

export interface FieldChange {
  key: string
  value: string | null
}

export const fieldsApi = {
  getDocument: async (documentId: string): Promise<DocumentDetail> => {
    const response = await api.get<DocumentDetail>(`/documents/${documentId}`)
    return response.data
  },

  updateFields: async (documentId: string, fields: FieldChange[]): Promise<DocumentDetail> => {
    const response = await api.patch<DocumentDetail>(`/documents/${documentId}/fields`, { fields })
    return response.data
  },
}

const documentKey = (documentId: string) => ['documents', documentId, 'detail'] as const

export function useDocumentDetail(documentId: string | undefined, enabled = true) {
  return useQuery<DocumentDetail, AxiosError>({
    queryKey: documentKey(documentId ?? ''),
    queryFn: () => fieldsApi.getDocument(documentId!),
    enabled: enabled && !!documentId,
  })
}

export function useUpdateFields(documentId: string) {
  const queryClient = useQueryClient()
  return useMutation<DocumentDetail, AxiosError<{ message?: string }>, FieldChange[]>({
    mutationFn: (fields) => fieldsApi.updateFields(documentId, fields),
    onSuccess: (document) => {
      queryClient.setQueryData(documentKey(documentId), document)
      // после правки перезапускается этап rules: обновим этапы документа и замечания
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      queryClient.invalidateQueries({ queryKey: ['findings'] })
    },
  })
}
