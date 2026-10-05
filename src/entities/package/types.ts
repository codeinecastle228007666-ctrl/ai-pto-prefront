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
  fileName: string
  /** null — файл дубликат, загружать не нужно */
  uploadUrl: string | null
  headers?: Record<string, string>
  expiresAt?: string
  duplicateOf?: string | null
}

export interface PackageCreated {
  package: Package
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
