import type { PackageDetail, PackageProgressEvent } from '@/entities/package'

/** Мгновенно обновляет статус и прогресс в кэше; документы и этапы подтянет рефетч GET /packages/{id}. */
export function applyProgressEvent(
  pkg: PackageDetail | undefined,
  event: PackageProgressEvent
): PackageDetail | undefined {
  if (!pkg || pkg.id !== event.packageId) return pkg
  return { ...pkg, status: event.status, progress: event.progress }
}
