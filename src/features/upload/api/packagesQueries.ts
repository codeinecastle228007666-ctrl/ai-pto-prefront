import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { PackageDetail } from '@/entities/package'
import { packagesApi } from './packagesApi'

const ACTIVE_STATUSES = ['uploading', 'queued', 'processing']

// Пока пакет обрабатывается — поллим состояние (SSE добавим позже).
export function usePackage(packageId: string) {
  return useQuery<PackageDetail, AxiosError>({
    queryKey: ['packages', packageId],
    queryFn: () => packagesApi.getById(packageId),
    enabled: !!packageId,
    refetchInterval: (query) =>
      query.state.data && ACTIVE_STATUSES.includes(query.state.data.status) ? 1500 : false,
  })
}
