export type PackageStatus = 'uploading' | 'queued' | 'processing' | 'done' | 'partial' | 'failed'
export type DocumentStatus =
  | 'awaiting_upload'
  | 'uploaded'
  | 'queued'
  | 'processing'
  | 'done'
  | 'failed'
  | 'needs_ocr'
export type Stage = 'extract' | 'ocr' | 'classify' | 'parse' | 'rules' | 'explain'
export type StageStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped'
export type DocumentType =
  | 'aosr'
  | 'general_work_log'
  | 'concrete_log'
  | 'welding_log'
  | 'material_passport'
  | 'as_built_scheme'
  | 'test_report'
  | 'other'
  | 'unknown'

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
] as const
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

/** Лимит бэка на файлы в одном пакете. */
export const MAX_PACKAGE_FILES = 200

export interface PackageCreateFile {
  fileName: string
  mimeType: AllowedMimeType
  sizeBytes: number
  /** Необязательно: start сверит хеш загруженного объекта */
  sha256?: string
}

export interface PackageCreate {
  files: PackageCreateFile[]
}

export interface Package {
  id: string
  objectId: string
  version: number
  status: PackageStatus
  progress?: number
  createdAt: string
}

export interface UploadTarget {
  documentId: string
  /** Временная ссылка для PUT в хранилище */
  url: string
  objectKey: string
}

export interface PackageCreated {
  packageId: string
  version: number
  /** Порядок совпадает с порядком files в запросе */
  uploads: UploadTarget[]
}

export interface StageState {
  status: StageStatus
  error?: { code: string; message: string }
  finishedAt?: string | null
}

export interface SeverityCounts {
  error: number
  warning: number
  info: number
  critical: number
}

export interface PackageDocument {
  id: string
  objectId: string
  packageId: string
  fileName: string
  mimeType: string
  sizeBytes: number
  pageCount?: number | null
  type: DocumentType
  typeConfidence?: number | null
  typeEditedManually?: boolean
  status: DocumentStatus
  stages: Partial<Record<Stage, StageState>>
  findings: SeverityCounts
  createdAt: string
}

export interface PackageDetail extends Package {
  documents: PackageDocument[]
}

/** Место в файле, откуда извлечено значение. Для PDF — page и bbox в долях страницы [x0, y0, x1, y1]. */
export interface FieldSource {
  documentId: string
  page?: number
  bbox?: [number, number, number, number]
  quote?: string
}

export interface ExtractedField {
  key: string
  label: string
  value: string | null
  confidence: number
  source?: FieldSource
  editedManually: boolean
  /** Значение до ручной правки */
  originalValue?: string | null
}

export interface DocumentDetail extends PackageDocument {
  fields: ExtractedField[]
  /** Поля с уверенностью ниже порога подсвечиваем */
  lowConfidenceThreshold?: number
}

export const DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.8

export type ChecklistStatus = 'missing' | 'partial' | 'complete'

export interface ChecklistItem {
  documentType: DocumentType
  title: string
  /** Сколько документов требуется */
  required: number
  /** Сколько найдено */
  found: number
  status: ChecklistStatus
  documentIds: string[]
}

export interface Checklist {
  /** 0..1 */
  readiness: number
  items: ChecklistItem[]
}

/** Событие SSE `progress` из GET /packages/{id}/events. Состав документов и этапов — в GET /packages/{id}. */
export interface PackageProgressEvent {
  packageId: string
  status: PackageStatus
  progress: number
}

export const PACKAGE_PROGRESS_EVENT = 'progress'

export const FINISHED_PACKAGE_STATUSES: PackageStatus[] = ['done', 'partial', 'failed']
