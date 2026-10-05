import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'

export interface DocumentFile {
  url: string
  expiresAt: string
}

export const documentsApi = {
  getFile: async (documentId: string): Promise<DocumentFile> => {
    const response = await api.get<DocumentFile>(`/documents/${documentId}/file`)
    return response.data
  },
}

// Ссылка временная: переиспользуем кэш недолго, чтобы не открыть просроченную.
export function useDocumentFile(documentId: string | undefined) {
  return useQuery<DocumentFile, AxiosError>({
    queryKey: ['documents', documentId, 'file'],
    queryFn: () => documentsApi.getFile(documentId!),
    enabled: !!documentId,
    staleTime: 60_000,
  })
}
