export type ReportStatus = 'queued' | 'generating' | 'ready' | 'failed'
export type ReportScope = 'accepted' | 'errors' | 'all_open'

export interface Report {
  id: string
  objectId: string
  packageId: string
  status: ReportStatus
  version: number
  scope?: ReportScope
  recipient?: string | null
  findingsCount?: number
  error?: { code: string; message: string }
  createdBy?: string
  createdAt: string
  readyAt?: string | null
}

export interface ReportCreate {
  scope?: ReportScope
  recipient?: string
}

export const REPORT_SCOPE_LABELS: Record<ReportScope, string> = {
  accepted: 'Принятые замечания',
  errors: 'Только ошибки',
  all_open: 'Все открытые замечания',
}
