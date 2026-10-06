import type { DocumentStageEvent, PackageDetail, PackageProgressEvent } from '@/entities/package'

/** Мгновенно обновляет статус и прогресс пакета в кэше. */
export function applyProgressEvent(
  pkg: PackageDetail | undefined,
  event: PackageProgressEvent
): PackageDetail | undefined {
  if (!pkg || pkg.id !== event.packageId) return pkg
  return { ...pkg, status: event.status, progress: event.progress }
}

/** Обновляет статус этапа одного документа; статус самого документа подтянет рефетч GET /packages/{id}. */
export function applyDocumentStage(
  pkg: PackageDetail | undefined,
  event: DocumentStageEvent
): PackageDetail | undefined {
  if (!pkg || pkg.id !== event.packageId) return pkg
  return {
    ...pkg,
    documents: pkg.documents.map((d) =>
      d.id === event.documentId
        ? { ...d, stages: { ...d.stages, [event.stage]: { status: event.status, error: event.error } } }
        : d
    ),
  }
}
