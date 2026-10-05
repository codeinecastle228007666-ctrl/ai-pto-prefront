import type { PackageDetail, PackageEvent } from '@/entities/package'

/** Применяет событие SSE к кэшу пакета. Истина статуса — GET пакета, поэтому по done ещё и рефетчим. */
export function applyPackageEvent(pkg: PackageDetail | undefined, event: PackageEvent): PackageDetail | undefined {
  switch (event.type) {
    case 'package.snapshot':
      return event.package
    case 'package.progress':
      return pkg && { ...pkg, progress: event.progress }
    case 'document.stage':
      return (
        pkg && {
          ...pkg,
          documents: pkg.documents.map((d) =>
            d.id === event.documentId
              ? { ...d, stages: { ...d.stages, [event.stage]: { status: event.status, error: event.error } } }
              : d
          ),
        }
      )
    case 'package.done':
      return pkg && { ...pkg, status: event.status, progress: 1 }
  }
}
