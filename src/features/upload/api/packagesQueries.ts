import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/shared'
import {
  FINISHED_PACKAGE_STATUSES,
  PACKAGE_PROGRESS_EVENT,
  type PackageDetail,
  type PackageProgressEvent,
} from '@/entities/package'
import { applyProgressEvent } from '../model/applyPackageEvent'
import { packagesApi } from './packagesApi'

const ACTIVE_STATUSES = ['uploading', 'queued', 'processing']
const POLL_MS = 1500
const POLL_WHEN_LIVE_MS = 10_000 // страховка, пока SSE подключён

const packageKey = (packageId: string) => ['packages', packageId] as const

/**
 * Состояние пакета: прогресс приходит по SSE, а пока поток не подключён
 * (или оборвался) — запасной поллинг GET /packages/{id}.
 */
export function usePackage(packageId: string) {
  const queryClient = useQueryClient()
  const [live, setLive] = useState(false)

  const query = useQuery<PackageDetail, AxiosError>({
    queryKey: packageKey(packageId),
    queryFn: () => packagesApi.getById(packageId),
    enabled: !!packageId,
    refetchInterval: (q) =>
      q.state.data && ACTIVE_STATUSES.includes(q.state.data.status) ? (live ? POLL_WHEN_LIVE_MS : POLL_MS) : false,
  })

  const active = !!query.data && ACTIVE_STATUSES.includes(query.data.status)

  useEffect(() => {
    if (!packageId || !active || typeof EventSource === 'undefined') return

    const source = new EventSource(`${api.defaults.baseURL ?? '/api'}/packages/${packageId}/events`, {
      withCredentials: true,
    })
    source.onopen = () => setLive(true)
    source.onerror = () => setLive(false) // браузер переподключится сам, пока работает поллинг

    const handle = (message: MessageEvent<string>) => {
      let event: PackageProgressEvent
      try {
        event = JSON.parse(message.data) as PackageProgressEvent
      } catch {
        return
      }
      queryClient.setQueryData<PackageDetail>(packageKey(packageId), (prev) => applyProgressEvent(prev, event))
      // Истина о документах и этапах — GET пакета: перечитываем по каждому событию
      queryClient.invalidateQueries({ queryKey: packageKey(packageId) })

      if (FINISHED_PACKAGE_STATUSES.includes(event.status)) {
        source.close()
        setLive(false)
        // результаты обработки: замечания, поля, комплектность
        queryClient.invalidateQueries({ queryKey: ['findings'] })
        queryClient.invalidateQueries({ queryKey: ['checklist'] })
        queryClient.invalidateQueries({ queryKey: ['documents'] })
      }
    }
    source.addEventListener(PACKAGE_PROGRESS_EVENT, handle as EventListener)

    return () => {
      source.close()
      setLive(false)
    }
  }, [packageId, active, queryClient])

  return query
}
