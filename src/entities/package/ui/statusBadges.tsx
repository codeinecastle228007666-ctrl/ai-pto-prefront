import { Badge } from '@/shared'
import type { DocumentStatus, DocumentType, PackageStatus } from '../types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

export const PACKAGE_STATUS_CONFIG: Record<PackageStatus, { badge: BadgeVariant; text: string }> = {
  uploading: { badge: 'secondary', text: 'Загрузка' },
  queued: { badge: 'info', text: 'В очереди' },
  processing: { badge: 'info', text: 'Обработка' },
  done: { badge: 'success', text: 'Готово' },
  partial: { badge: 'warning', text: 'Частично' },
  failed: { badge: 'destructive', text: 'Ошибка' },
}

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, { badge: BadgeVariant; text: string }> = {
  awaiting_upload: { badge: 'secondary', text: 'Ожидает загрузки' },
  uploaded: { badge: 'secondary', text: 'Загружен' },
  queued: { badge: 'info', text: 'В очереди' },
  processing: { badge: 'info', text: 'Обработка' },
  done: { badge: 'success', text: 'Готово' },
  failed: { badge: 'destructive', text: 'Ошибка' },
  needs_ocr: { badge: 'warning', text: 'Нужен OCR (скан)' },
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  aosr: 'АОСР',
  general_work_log: 'Общий журнал работ',
  concrete_log: 'Журнал бетонных работ',
  welding_log: 'Журнал сварки',
  material_passport: 'Паспорт материалов',
  as_built_scheme: 'Исполнительная схема',
  test_report: 'Протокол испытаний',
  other: 'Прочее',
  unknown: 'Тип не определён',
}

export function PackageStatusBadge({ status }: { status: PackageStatus }) {
  const c = PACKAGE_STATUS_CONFIG[status]
  return <Badge variant={c.badge}>{c.text}</Badge>
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const c = DOCUMENT_STATUS_CONFIG[status]
  return <Badge variant={c.badge}>{c.text}</Badge>
}
