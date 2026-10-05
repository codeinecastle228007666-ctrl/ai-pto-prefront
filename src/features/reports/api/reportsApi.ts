import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'
import type { Report, ReportCreate } from '@/entities/report'

export const reportsApi = {
  create: async (packageId: string, body: ReportCreate): Promise<Report> => {
    const response = await api.post<Report>(`/packages/${packageId}/reports`, body)
    return response.data
  },

  get: async (reportId: string): Promise<Report> => {
    const response = await api.get<Report>(`/reports/${reportId}`)
    return response.data
  },

  // Через axios, а не ссылкой: нужна cookie-сессия и обработка 409/401
  download: async (reportId: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/reports/${reportId}/download`, { responseType: 'blob' })
    return response.data
  },
}

export function useCreateReport(packageId: string) {
  return useMutation<Report, AxiosError<{ message?: string }>, ReportCreate>({
    mutationFn: (body) => reportsApi.create(packageId, body),
  })
}

/** Поллим отчёт, пока он генерируется. */
export function useReport(reportId: string | undefined) {
  return useQuery<Report, AxiosError>({
    queryKey: ['reports', reportId],
    queryFn: () => reportsApi.get(reportId!),
    enabled: !!reportId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'queued' || status === 'generating' ? 1000 : false
    },
  })
}

export async function downloadReportFile(report: Report): Promise<void> {
  const blob = await reportsApi.download(report.id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `report-v${report.version}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
